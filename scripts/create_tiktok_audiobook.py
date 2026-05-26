import os
import re
import asyncio
import subprocess
import textwrap
import argparse
from bs4 import BeautifulSoup
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg

FFMPEG_CMD = imageio_ffmpeg.get_ffmpeg_exe()
TEMP_DIR = "temp_v4"
ASSETS_DIR = "../assets/img"
PARTICLES_VIDEO = "../assets/video/magical_particles_720p.mp4"
RESOLUTION = (1080, 1920)
FPS = 25

STORY_CONFIG = {
    1: {
        "html_file": "../cuentos/01-el-primer-movimiento.html",
        "output_video": "../assets/video/cuento_01_tiktok.mp4",
        "default_voice": "es-ES-AlvaroNeural",
        "default_image": "mundo_magico_1778904597376.png",
        "mapping": {
            "El puente era una columna": "puente_rio_central_1779239550750.png",
            "caballo que practicaba saltos": "caballo_l_equivocado_1779239565440.png",
            "sacrificó su alfil": "sacrificio_greco_1779239578282.png",
            "ACHÍS": "reina_estornudo_1779239591968.png"
        }
    },
    2: {
        "html_file": "../cuentos/02-tic-tac-jaque-mate.html",
        "output_video": "../assets/video/cuento_02_tiktok.mp4",
        "default_voice": "es-ES-ElviraNeural",
        "default_image": "tictac_reloj_1778905871501.png",
        "mapping": {
            "La noche antes del torneo": "martina_reloj_noche_1779250555984.png",
            "El gimnasio del colegio olía": "torneo_escolar_ajedrez_1779250574888.png",
            "El rival de la primera ronda se llamaba Tomás": "tomas_erizo_1778905884457.png",
            "En ese momento, Martina vio algo en la casilla e4": "peoncito_e4_1779250596021.png",
            "Y estrelló su alfil en a3": "mate_de_boden_1779250613804.png",
            "La señora que atendía llevaba un delantal": "kiosquera_torreta_1778905896331.png"
        }
    },
    3: {
        "html_file": "../cuentos/03-la-clavada-del-alfil-exiliado.html",
        "output_video": "../assets/video/cuento_03_tiktok.mp4",
        "default_voice": "es-US-AlonsoNeural",
        "default_image": "alfil_exiliado_1778944848314.png",
        "mapping": {
            "Si hay algo que Martina ama": "alfil_exiliado_1778944848314.png",
            "sacrificando la torre": "martina_torre_sacrificio_v2_1778945194932.png",
            "Club de la Clavada": "club_clavada_fiesta_1778945037841.png"
        }
    }
}

os.makedirs(TEMP_DIR, exist_ok=True)

def create_tiktok_text_frame(text, filename, story_num, story_title):
    # Base image 1080x1920, fully transparent
    img = Image.new('RGBA', RESOLUTION, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Try loading clean fonts
    try:
        font_title = ImageFont.truetype("arialbd.ttf", 44)
        font_sub = ImageFont.truetype("arial.ttf", 32)
        font_body = ImageFont.truetype("arialbd.ttf", 40)
        font_cta = ImageFont.truetype("arialbd.ttf", 36)
    except IOError:
        font_title = font_sub = font_body = font_cta = ImageFont.load_default()
        
    # 1. Draw Header Box
    draw.rounded_rectangle(
        [(60, 90), (1020, 270)],
        radius=25,
        fill=(22, 25, 28, 225),
        outline=(212, 175, 55, 120),  # Gold accent border
        width=3
    )
    
    title_text = "♕ MARTINA: Cuentos de Ajedrez"
    sub_text = f"Cuento {story_num}: {story_title}"
    
    # Center title text
    try:
        bbox = draw.textbbox((0, 0), title_text, font=font_title)
        w_title = bbox[2] - bbox[0]
    except:
        w_title = 600
    draw.text(((1080 - w_title) / 2, 115), title_text, font=font_title, fill=(212, 175, 55, 255))
    
    # Center subtitle text
    try:
        bbox = draw.textbbox((0, 0), sub_text, font=font_sub)
        w_sub = bbox[2] - bbox[0]
    except:
        w_sub = 400
    draw.text(((1080 - w_sub) / 2, 195), sub_text, font=font_sub, fill=(224, 224, 224, 255))
    
    # 2. Draw Body Text Container
    lines = textwrap.wrap(text, width=38)
    line_height = 55
    total_height = len(lines) * line_height
    padding_y = 40
    
    box_y_start = 1060
    box_y_end = box_y_start + total_height + padding_y * 2
    
    draw.rounded_rectangle(
        [(60, box_y_start), (1020, box_y_end + 110)],  # Extra room for CTA at the bottom
        radius=25,
        fill=(22, 25, 28, 235),
        outline=(224, 224, 224, 60),  # Soft silver border
        width=2
    )
    
    # Draw body lines
    y_text = box_y_start + padding_y
    for line in lines:
        try:
            bbox = draw.textbbox((0, 0), line, font=font_body)
            width = bbox[2] - bbox[0]
        except:
            width = 500
        draw.text(((1080 - width) / 2, y_text), line, font=font_body, fill=(255, 255, 255, 255))
        y_text += line_height
        
    # Draw CTA
    cta_text = "Lee gratis en martinachess.com"
    try:
        bbox = draw.textbbox((0, 0), cta_text, font=font_cta)
        w_cta = bbox[2] - bbox[0]
    except:
        w_cta = 500
    draw.text(((1080 - w_cta) / 2, box_y_end + 30), cta_text, font=font_cta, fill=(212, 175, 55, 255))
    
    img.save(filename)

async def generate_tts(text, output_file, voice):
    import edge_tts
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(output_file)

def render_clip(audio_file, bg_image, text_image, output_clip):
    # Spectacular vertical 9:16 stacking filter graph:
    # 1. Base dark background color
    # 2. Zoompan landscape 16:9 illustration to 1080x608
    # 3. Overlay zoomed illustration in vertical center (y=400)
    # 4. Stretch particles to 1080x1920 and blend screen-wise
    # 5. Overlay transparent 1080x1920 text frame (header, paragraph, and CTA)
    filter_complex = (
        "color=c=0x16191c:s=1080x1920[canvas];"
        "[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,"
        "zoompan=z='min(zoom+0.001,1.5)':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)',"
        "scale=1080:608[ill_zoomed];"
        "[3:v]scale=1080:1920[particles];"
        "[canvas][ill_zoomed]overlay=x=0:y=400[canvas_with_ill];"
        "[canvas_with_ill][particles]blend=all_mode='screen':all_opacity=0.6[blended];"
        "[blended][1:v]overlay=0:0:shortest=1[v]"
    )
    
    cmd = [
        FFMPEG_CMD, "-y", "-hide_banner", "-loglevel", "error",
        "-loop", "1", "-framerate", str(FPS), "-i", bg_image,
        "-loop", "1", "-framerate", str(FPS), "-i", text_image,
        "-i", audio_file,
        "-stream_loop", "-1", "-i", PARTICLES_VIDEO,
        "-filter_complex", filter_complex,
        "-map", "[v]", "-map", "2:a",
        "-c:v", "h264_nvenc", "-preset", "p4", "-cq", "34", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "128k",
        "-shortest", output_clip
    ]
    subprocess.run(cmd, check=True)

async def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--story", type=int, required=True, help="Number of the story to generate")
    parser.add_argument("--voice", type=str, help="TTS voice to use")
    args = parser.parse_args()

    if args.story not in STORY_CONFIG:
        print(f"Error: Config for story {args.story} not found.")
        return

    config = STORY_CONFIG[args.story]
    html_file = config["html_file"]
    output_video = config["output_video"]
    voice = args.voice if args.voice else config["default_voice"]
    mapping = config["mapping"]
    default_image = config["default_image"]

    os.makedirs(os.path.dirname(output_video), exist_ok=True)

    print(f"Analizando HTML de Cuento {args.story} para TikTok...")
    with open(html_file, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f.read(), "html.parser")
        
    article = soup.find("article", class_="story-body")
    
    # Get story title
    h1_tag = article.find("h1")
    story_title = h1_tag.get_text(strip=True) if h1_tag else "El Primer Movimiento"
    
    timeline = []
    current_image = default_image
    
    for element in article.children:
        if element.name == "div" and "story-image-wrapper" in element.get("class", []):
            img_tag = element.find("img")
            if img_tag and img_tag.has_attr("src"):
                current_image = os.path.basename(img_tag["src"])
        elif element.name == "p":
            text = element.get_text(strip=True)
            if not text or "Fin del " in text or "Continuará" in text or "¿Prefieres escuchar" in text or "Tu navegador no soporta" in text or "Descargar Video" in text:
                continue
            
            for key_phrase, img_name in mapping.items():
                if key_phrase in text:
                    current_image = img_name
            
            timeline.append({"text": text, "image": current_image})
            
    clips_list = []
    print(f"Generando {len(timeline)} mini-clips verticales con voz {voice}...")
    
    for i, item in enumerate(timeline):
        text = item["text"]
        bg_name = item["image"]
        
        audio_file = os.path.join(TEMP_DIR, f"s{args.story}_tk_audio_{i:03d}.mp3")
        text_img_file = os.path.join(TEMP_DIR, f"s{args.story}_tk_text_{i:03d}.png")
        bg_file = os.path.join(ASSETS_DIR, bg_name)
        clip_file = os.path.join(TEMP_DIR, f"s{args.story}_tk_clip_{i:03d}.mp4")
        
        if not os.path.exists(audio_file) or os.path.getsize(audio_file) == 0:
            await generate_tts(text, audio_file, voice)
            
        create_tiktok_text_frame(text, text_img_file, args.story, story_title)
        
        if not os.path.exists(clip_file) or os.path.getsize(clip_file) == 0:
            render_clip(audio_file, bg_file, text_img_file, clip_file)
            print(f"Renderizado clip vertical {i+1}/{len(timeline)}")
            
        clips_list.append(clip_file)

    print("Concatenando todo...")
    concat_txt = os.path.join(TEMP_DIR, f"s{args.story}_tk_concat.txt")
    with open(concat_txt, "w", encoding="utf-8") as f:
        for clip in clips_list:
            abs_path = os.path.abspath(clip)
            safe_path = abs_path.replace('\\', '/')
            f.write(f"file '{safe_path}'\n")
            
    concat_cmd = [
        FFMPEG_CMD, "-y", "-hide_banner", "-loglevel", "error",
        "-f", "concat", "-safe", "0",
        "-i", concat_txt,
        "-c", "copy",
        output_video
    ]
    subprocess.run(concat_cmd, check=True)
    print(f"¡TikTok Video completado! Guardado en: {output_video}")

if __name__ == "__main__":
    asyncio.run(main())
