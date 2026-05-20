import os
import re
import asyncio
import subprocess
import textwrap
from bs4 import BeautifulSoup
from PIL import Image, ImageDraw, ImageFont

# Configuración
HTML_FILE = "../cuentos/01-el-primer-movimiento.html"
OUTPUT_VIDEO = "../assets/video/cuento_01_audiolibro.mp4"
TEMP_DIR = "temp_v2"
ASSETS_DIR = "../assets/img"
RESOLUTION = (1920, 1080)
FPS = 25

NEW_IMAGES_MAPPING = {
    "El puente era una columna": "puente_rio_central_1779239550750.png",
    "caballo que practicaba saltos": "caballo_l_equivocado_1779239565440.png",
    "sacrificó su alfil": "sacrificio_greco_1779239578282.png",
    "ACHÍS": "reina_estornudo_1779239591968.png"
}

os.makedirs(TEMP_DIR, exist_ok=True)
os.makedirs(os.path.dirname(OUTPUT_VIDEO), exist_ok=True)

def create_transparent_text(text, filename):
    """Crea un PNG transparente con el texto renderizado en la parte inferior."""
    img = Image.new('RGBA', RESOLUTION, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    try:
        # Usa una fuente estándar disponible en Linux
        font = ImageFont.truetype("DejaVuSans-Bold.ttf", 48)
    except IOError:
        font = ImageFont.load_default()
        
    lines = textwrap.wrap(text, width=60)
    
    # Calcular altura de la caja de fondo
    line_height = 60
    total_height = len(lines) * line_height
    padding = 30
    
    y_start = RESOLUTION[1] - total_height - padding * 2 - 50 # Un poco arriba del borde inferior
    
    # Dibujar fondo semitransparente oscuro
    draw.rectangle(
        [(RESOLUTION[0]*0.1, y_start), (RESOLUTION[0]*0.9, y_start + total_height + padding*2)],
        fill=(0, 0, 0, 180)
    )
    
    y_text = y_start + padding
    for line in lines:
        try:
            bbox = draw.textbbox((0, 0), line, font=font)
            width = bbox[2] - bbox[0]
        except:
            width = 800 # Fallback
            
        draw.text(((RESOLUTION[0] - width) / 2, y_text), line, font=font, fill=(255, 255, 255, 255))
        y_text += line_height
        
    img.save(filename)
    return filename

async def generate_tts(text, output_file):
    # import dinámico para asegurar que esté en el venv
    import edge_tts
    voice = "es-ES-AlvaroNeural"
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(output_file)

def get_audio_duration(audio_file):
    cmd = ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", audio_file]
    out = subprocess.check_output(cmd).decode("utf-8").strip()
    return float(out)

def parse_html_to_timeline(html_path):
    with open(html_path, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f.read(), "html.parser")
        
    article = soup.find("article", class_="story-body")
    timeline = []
    current_image = "mundo_magico_1778904597376.png" # Fondo por defecto
    
    for element in article.children:
        if element.name == "div" and "story-image-wrapper" in element.get("class", []):
            img_tag = element.find("img")
            if img_tag and img_tag.has_attr("src"):
                current_image = os.path.basename(img_tag["src"])
        elif element.name == "p":
            text = element.get_text(strip=True)
            if not text or "Fin del primer cuento" in text:
                continue
            
            for key_phrase, img_name in NEW_IMAGES_MAPPING.items():
                if key_phrase in text:
                    current_image = img_name
            
            timeline.append({"text": text, "image": current_image})
            
    return timeline

def render_clip(audio_file, bg_image, text_image, output_clip):
    # Genera el comando ffmpeg
    # [0:v] es bg_image. Le aplicamos scale y luego zoompan lento para efecto cinemático
    # [1:v] es text_image transparente con los subtítulos
    filter_complex = (
        "[0:v]scale=8000:-1,zoompan=z='min(zoom+0.0005,1.5)':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)',scale=1920:1080,setsar=1[bg];"
        "[bg][1:v]overlay=0:0:shortest=1[v]"
    )
    
    cmd = [
        "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
        "-loop", "1", "-framerate", str(FPS), "-i", bg_image,
        "-loop", "1", "-framerate", str(FPS), "-i", text_image,
        "-i", audio_file,
        "-filter_complex", filter_complex,
        "-map", "[v]", "-map", "2:a",
        "-c:v", "libx264", "-preset", "ultrafast", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k",
        "-shortest", output_clip
    ]
    subprocess.run(cmd, check=True)

async def main():
    print("Analizando HTML...")
    timeline = parse_html_to_timeline(HTML_FILE)
    
    clips_list = []
    
    print(f"Generando {len(timeline)} mini-clips...")
    for i, item in enumerate(timeline):
        print(f"Procesando {i+1}/{len(timeline)}...")
        text = item["text"]
        bg_name = item["image"]
        
        audio_file = os.path.join(TEMP_DIR, f"audio_{i:03d}.mp3")
        text_img_file = os.path.join(TEMP_DIR, f"text_{i:03d}.png")
        bg_file = os.path.join(ASSETS_DIR, bg_name) if bg_name else os.path.join(ASSETS_DIR, "mundo_magico_1778904597376.png")
        clip_file = os.path.join(TEMP_DIR, f"clip_{i:03d}.mp4")
        
        # 1. Generar audio
        if not os.path.exists(audio_file):
            await generate_tts(text, audio_file)
            
        # 2. Generar imagen transparente con texto
        create_transparent_text(text, text_img_file)
        
        # 3. Renderizar clip
        if not os.path.exists(clip_file):
            render_clip(audio_file, bg_file, text_img_file, clip_file)
            
        clips_list.append(clip_file)

    # 4. Concatenar clips (super rápido sin re-encode)
    print("Concatenando todo...")
    concat_txt = os.path.join(TEMP_DIR, "concat.txt")
    with open(concat_txt, "w", encoding="utf-8") as f:
        for clip in clips_list:
            f.write(f"file '{os.path.basename(clip)}'\n")
            
    concat_cmd = [
        "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
        "-f", "concat", "-safe", "0",
        "-i", concat_txt,
        "-c", "copy",
        OUTPUT_VIDEO
    ]
    subprocess.run(concat_cmd, check=True)
    
    print(f"¡Audiobook V2 completado! Guardado en: {OUTPUT_VIDEO}")

if __name__ == "__main__":
    asyncio.run(main())
