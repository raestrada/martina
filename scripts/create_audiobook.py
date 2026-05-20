import os
import re
import asyncio
import subprocess
import textwrap
from bs4 import BeautifulSoup
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg

HTML_FILE = "../cuentos/01-el-primer-movimiento.html"
OUTPUT_VIDEO = "../assets/video/cuento_01_audiolibro.mp4"
TEMP_DIR = "temp_v4"
ASSETS_DIR = "../assets/img"
PARTICLES_VIDEO = "../assets/video/magical_particles_720p.mp4"
FFMPEG_CMD = imageio_ffmpeg.get_ffmpeg_exe()

RESOLUTION = (1280, 720)
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
    img = Image.new('RGBA', RESOLUTION, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    try:
        # Intenta usar una fuente estándar de Windows o cae en la por defecto
        font = ImageFont.truetype("arialbd.ttf", 36)
    except IOError:
        font = ImageFont.load_default()
        
    lines = textwrap.wrap(text, width=50)
    line_height = 45
    total_height = len(lines) * line_height
    padding = 20
    y_start = RESOLUTION[1] - total_height - padding * 2 - 40
    
    # Fondo semi-transparente oscuro
    draw.rectangle(
        [(RESOLUTION[0]*0.1, y_start), (RESOLUTION[0]*0.9, y_start + total_height + padding*2)],
        fill=(0, 0, 0, 200)
    )
    
    y_text = y_start + padding
    for line in lines:
        try:
            bbox = draw.textbbox((0, 0), line, font=font)
            width = bbox[2] - bbox[0]
        except:
            width = 600
        draw.text(((RESOLUTION[0] - width) / 2, y_text), line, font=font, fill=(255, 255, 255, 255))
        y_text += line_height
        
    img.save(filename)

async def generate_tts(text, output_file):
    import edge_tts
    voice = "es-ES-AlvaroNeural"
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(output_file)

def render_clip(audio_file, bg_image, text_image, output_clip):
    # La imagen se escala a 1080p, hace el zoom, baja a 720p y se mezcla con las partículas
    filter_complex = (
        "[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,"
        "zoompan=z='min(zoom+0.001,1.5)':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)',"
        "scale=1280:720[bg_zoomed];"
        "[bg_zoomed][3:v]blend=all_mode='screen':all_opacity=0.8[with_particles];"
        "[with_particles][1:v]overlay=0:0:shortest=1[v]"
    )
    
    cmd = [
        FFMPEG_CMD, "-y", "-hide_banner", "-loglevel", "error",
        "-loop", "1", "-framerate", str(FPS), "-i", bg_image,
        "-loop", "1", "-framerate", str(FPS), "-i", text_image,
        "-i", audio_file,
        "-stream_loop", "-1", "-i", PARTICLES_VIDEO,
        "-filter_complex", filter_complex,
        "-map", "[v]", "-map", "2:a",
        "-c:v", "h264_nvenc", "-preset", "p4", "-cq", "28", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k",
        "-shortest", output_clip
    ]
    subprocess.run(cmd, check=True)

async def main():
    print("Analizando HTML...")
    with open(HTML_FILE, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f.read(), "html.parser")
        
    article = soup.find("article", class_="story-body")
    timeline = []
    
    # Imagen por defecto muy oscura si no hay otra
    default_image = "mundo_magico_1778904597376.png"
    current_image = default_image
    
    for element in article.children:
        if element.name == "div" and "story-image-wrapper" in element.get("class", []):
            img_tag = element.find("img")
            if img_tag and img_tag.has_attr("src"):
                current_image = os.path.basename(img_tag["src"])
        elif element.name == "p":
            text = element.get_text(strip=True)
            if not text or "Fin del primer cuento" in text:
                continue
            
            # Si el texto es de descripción u otro momento, quizás resetear a la mágica o mantener
            for key_phrase, img_name in NEW_IMAGES_MAPPING.items():
                if key_phrase in text:
                    current_image = img_name
            
            timeline.append({"text": text, "image": current_image})
            
    clips_list = []
    print(f"Generando {len(timeline)} mini-clips con Aceleración NVIDIA (V4 a 720p)...")
    
    for i, item in enumerate(timeline):
        text = item["text"]
        bg_name = item["image"]
        
        audio_file = os.path.join(TEMP_DIR, f"audio_{i:03d}.mp3")
        text_img_file = os.path.join(TEMP_DIR, f"text_{i:03d}.png")
        bg_file = os.path.join(ASSETS_DIR, bg_name)
        clip_file = os.path.join(TEMP_DIR, f"clip_{i:03d}.mp4")
        
        if not os.path.exists(audio_file):
            await generate_tts(text, audio_file)
            
        create_transparent_text(text, text_img_file)
        
        if not os.path.exists(clip_file):
            render_clip(audio_file, bg_file, text_img_file, clip_file)
            print(f"Renderizado clip {i+1}/{len(timeline)}")
            
        clips_list.append(clip_file)

    print("Concatenando todo...")
    concat_txt = os.path.join(TEMP_DIR, "concat.txt")
    with open(concat_txt, "w", encoding="utf-8") as f:
        for clip in clips_list:
            # We must use forward slashes for ffmpeg concat file paths, even on Windows
            safe_path = clip.replace('\\', '/')
            f.write(f"file '{safe_path}'\n")
            
    concat_cmd = [
        FFMPEG_CMD, "-y", "-hide_banner", "-loglevel", "error",
        "-f", "concat", "-safe", "0",
        "-i", concat_txt,
        "-c", "copy",
        OUTPUT_VIDEO
    ]
    subprocess.run(concat_cmd, check=True)
    print(f"¡Audiobook V4 completado! Guardado en: {OUTPUT_VIDEO}")

if __name__ == "__main__":
    asyncio.run(main())
