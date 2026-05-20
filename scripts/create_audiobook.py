import os
import re
import asyncio
import edge_tts
from bs4 import BeautifulSoup
from PIL import Image, ImageDraw, ImageFont
from moviepy import *
import textwrap

# Configuración
HTML_FILE = "../cuentos/01-el-primer-movimiento.html"
OUTPUT_VIDEO = "../cuento_01_audiolibro.mp4"
TEMP_DIR = "temp_audiobook"
ASSETS_DIR = "../assets/img"
RESOLUTION = (1920, 1080)
FPS = 10  # Bajo FPS para renders rápidos

# Diccionario para mapear nuevas imágenes generadas a frases clave
NEW_IMAGES_MAPPING = {
    "El puente era una columna": "puente_rio_central_1779239550750.png",
    "caballo que practicaba saltos": "caballo_l_equivocado_1779239565440.png",
    "sacrificó su alfil": "sacrificio_greco_1779239578282.png",
    "ACHÍS": "reina_estornudo_1779239591968.png"
}

os.makedirs(TEMP_DIR, exist_ok=True)

def create_text_image(text, filename, size=(1920, 1080)):
    """Crea una imagen oscura con texto blanco centrado usando Pillow para no depender de ImageMagick."""
    img = Image.new('RGB', size, color=(15, 15, 20))
    draw = ImageDraw.Draw(img)
    # Fuente por defecto, intenta cargar una fuente TrueType si está disponible
    try:
        font = ImageFont.truetype("arial.ttf", 60)
    except IOError:
        font = ImageFont.load_default()
    
    # Envolver texto
    lines = textwrap.wrap(text, width=50)
    
    # Calcular altura total
    y_text = size[1] / 2 - (len(lines) * 80) / 2
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=font)
        width = bbox[2] - bbox[0]
        height = bbox[3] - bbox[1]
        draw.text(((size[0] - width) / 2, y_text), line, font=font, fill=(255, 255, 255))
        y_text += height + 20
        
    img.save(filename)
    return filename

async def generate_tts(text, output_file):
    voice = "es-ES-AlvaroNeural"
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(output_file)

def parse_html_to_timeline(html_path):
    with open(html_path, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f.read(), "html.parser")
        
    article = soup.find("article", class_="story-body")
    timeline = []
    current_image = None
    
    for element in article.children:
        if element.name == "div" and "story-image-wrapper" in element.get("class", []):
            img_tag = element.find("img")
            if img_tag and img_tag.has_attr("src"):
                current_image = os.path.basename(img_tag["src"])
        elif element.name == "p":
            text = element.get_text(strip=True)
            if not text or "Fin del primer cuento" in text:
                continue
            
            # Verificar si hay una nueva imagen asociada a este texto
            for key_phrase, img_name in NEW_IMAGES_MAPPING.items():
                if key_phrase in text:
                    current_image = img_name
            
            timeline.append({
                "text": text,
                "image": current_image
            })
            
    return timeline

def zoom_in_effect(clip, zoom_ratio=0.04):
    """Aplica un ligero zoom Ken Burns usando resize"""
    def effect(get_frame, t):
        # Resize factor changes over time
        factor = 1 + zoom_ratio * (t / clip.duration)
        img = Image.fromarray(get_frame(t))
        w, h = img.size
        # Resize
        img = img.resize((int(w * factor), int(h * factor)), Image.Resampling.LANCZOS)
        # Crop center
        left = (img.width - w) / 2
        top = (img.height - h) / 2
        right = (img.width + w) / 2
        bottom = (img.height + h) / 2
        img = img.crop((left, top, right, bottom))
        return numpy.array(img)
    return clip.transform(effect)

async def main():
    print("Analizando HTML...")
    timeline = parse_html_to_timeline(HTML_FILE)
    
    video_clips = []
    
    print(f"Procesando {len(timeline)} fragmentos...")
    
    for i, item in enumerate(timeline):
        text = item["text"]
        img_name = item["image"]
        
        # 1. Generar Audio
        audio_file = os.path.join(TEMP_DIR, f"audio_{i:03d}.mp3")
        await generate_tts(text, audio_file)
        
        audio_clip = AudioFileClip(audio_file)
        duration = audio_clip.duration
        
        # 2. Generar o cargar Imagen
        if img_name:
            img_path = os.path.join(ASSETS_DIR, img_name)
            if os.path.exists(img_path):
                # Usar la imagen original
                image_clip = ImageClip(img_path).with_duration(duration)
                # Aplicar resize para que cubra la pantalla manteniendo aspect ratio
                # En Moviepy 2.x esto es más complejo, usaremos Pillow antes si queremos, o simplemente
                image_clip = image_clip.resized(height=RESOLUTION[1])
                # Centrar
                image_clip = image_clip.with_position("center")
                
                # Crear fondo oscuro
                bg = ColorClip(size=RESOLUTION, color=(15, 15, 20)).with_duration(duration)
                
                # Componer
                comp = CompositeVideoClip([bg, image_clip]).with_audio(audio_clip)
                # Para simplificar y no hacer el render lento con el ken burns customizado, 
                # pondremos el texto superpuesto abajo
                
                text_img = create_text_image(text, os.path.join(TEMP_DIR, f"sub_{i:03d}.png"), size=(RESOLUTION[0], 250))
                sub_clip = ImageClip(text_img).with_duration(duration).with_position(("center", "bottom"))
                
                comp = CompositeVideoClip([bg, image_clip, sub_clip]).with_audio(audio_clip)
                video_clips.append(comp)
            else:
                print(f"Warning: Imagen {img_path} no encontrada.")
                img_name = None # Fallback a texto
                
        if not img_name:
            # Crear pantalla de texto dinámica
            text_img = create_text_image(text, os.path.join(TEMP_DIR, f"text_{i:03d}.png"), size=RESOLUTION)
            image_clip = ImageClip(text_img).with_duration(duration).with_audio(audio_clip)
            video_clips.append(image_clip)
            
        print(f"Procesado fragmento {i+1}/{len(timeline)}")
        
    print("Concatenando clips...")
    # Add crossfades (Moviepy 2.x concatenate_videoclips with method='compose' and padding)
    # For safety and speed we will just use basic concatenation
    final_video = concatenate_videoclips(video_clips, method="compose")
    
    print("Renderizando video...")
    final_video.write_videofile(OUTPUT_VIDEO, fps=FPS, audio_codec="aac")
    print(f"Video guardado en {OUTPUT_VIDEO}")

if __name__ == "__main__":
    asyncio.run(main())
