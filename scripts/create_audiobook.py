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
RESOLUTION = (1280, 720)
FPS = 25

STORY_CONFIG = {
    1: {
        "html_file": "../cuentos/01-el-primer-movimiento.html",
        "output_video": "../assets/video/cuento_01_audiolibro.mp4",
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
        "output_video": "../assets/video/cuento_02_audiolibro.mp4",
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
        "output_video": "../assets/video/cuento_03_audiolibro.mp4",
        "default_voice": "es-US-AlonsoNeural",
        "default_image": "alfil_exiliado_1778944848314.png",
        "mapping": {}
    },
    4: {
        "html_file": "../cuentos/04-el-caballo-salvaje.html",
        "output_video": "../assets/video/cuento_04_audiolibro.mp4",
        "default_voice": "es-MX-DaliaNeural",
        "default_image": "martina_vs_equis_1778968666455.png",
        "mapping": {
            "Martina jugó Cd5": "caballo_invencible_1778968679199.png",
            "Después de la partida": "martina_vs_equis_1778968666455.png"
        }
    },
    5: {
        "html_file": "../cuentos/05-la-coronacion-de-peoncito.html",
        "output_video": "../assets/video/cuento_05_audiolibro.mp4",
        "default_voice": "es-MX-JorgeNeural",
        "default_image": "peoncito_octava_fila_1779034473779.png",
        "mapping": {}
    },
    6: {
        "html_file": "../cuentos/06-la-jugada-invisible.html",
        "output_video": "../assets/video/cuento_06_audiolibro.mp4",
        "default_voice": "es-CO-SalomeNeural",
        "default_image": "martina_full_body_1778904544807.png",
        "mapping": {}
    },
    7: {
        "html_file": "../cuentos/07-el-pescador-y-el-elegante.html",
        "output_video": "../assets/video/cuento_07_audiolibro.mp4",
        "default_voice": "es-AR-TomasNeural",
        "default_image": "mundo_magico_1778904597376.png",
        "mapping": {}
    },
    8: {
        "html_file": "../cuentos/08-el-relampago-y-el-vikingo.html",
        "output_video": "../assets/video/cuento_08_audiolibro.mp4",
        "default_voice": "es-CL-CatalinaNeural",
        "default_image": "martina_full_body_1778904544807.png",
        "mapping": {}
    },
    9: {
        "html_file": "../cuentos/09-la-sombra-que-jugaba.html",
        "output_video": "../assets/video/cuento_09_audiolibro.mp4",
        "default_voice": "es-PE-AlexNeural",
        "default_image": "mundo_magico_1778904597376.png",
        "mapping": {}
    },
    10: {
        "html_file": "../cuentos/10-lo-que-no-se-ve-en-el-tablero.html",
        "output_video": "../assets/video/cuento_10_audiolibro.mp4",
        "default_voice": "es-VE-PaolaNeural",
        "default_image": "martina_full_body_1778904544807.png",
        "mapping": {}
    },
    11: {
        "html_file": "../cuentos/11-la-ultima-grieta.html",
        "output_video": "../assets/video/cuento_11_audiolibro.mp4",
        "default_voice": "es-CO-GonzaloNeural",
        "default_image": "mundo_magico_1778904597376.png",
        "mapping": {}
    },
    12: {
        "html_file": "../cuentos/12-el-peon-que-bailaba.html",
        "output_video": "../assets/video/cuento_12_audiolibro.mp4",
        "default_voice": "es-EC-AndreaNeural",
        "default_image": "martina_full_body_1778904544807.png",
        "mapping": {}
    },
    13: {
        "html_file": "../cuentos/13-lo-que-estaba-escrito.html",
        "output_video": "../assets/video/cuento_13_audiolibro.mp4",
        "default_voice": "es-ES-AlvaroNeural",
        "default_image": "martina_sombra_1779972341205.png",
        "mapping": {}
    },
    14: {
        "html_file": "../cuentos/14-hielo-que-quema.html",
        "output_video": "../assets/video/cuento_14_audiolibro.mp4",
        "default_voice": "es-ES-ElviraNeural",
        "default_image": "martina_vs_leon_1780000000000.png",
        "mapping": {}
    }
}

os.makedirs(TEMP_DIR, exist_ok=True)


def create_transparent_text(text, filename):
    img = Image.new('RGBA', RESOLUTION, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype("arialbd.ttf", 36)
    except IOError:
        font = ImageFont.load_default()
        
    lines = textwrap.wrap(text, width=50)
    line_height = 45
    total_height = len(lines) * line_height
    padding = 20
    y_start = RESOLUTION[1] - total_height - padding * 2 - 40
    
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

async def generate_tts(text, output_file, voice):
    import edge_tts
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(output_file)

def render_clip(audio_file, bg_image, text_image, output_clip):
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

    print(f"Analizando HTML de Cuento {args.story}...")
    with open(html_file, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f.read(), "html.parser")
        
    article = soup.find("article", class_="story-body")
    timeline = []
    
    current_image = default_image
    
    for element in article.children:
        if element.name == "div" and "story-image-wrapper" in element.get("class", []):
            img_tag = element.find("img")
            if img_tag and img_tag.has_attr("src"):
                current_image = os.path.basename(img_tag["src"])
        elif element.name == "p":
            text = element.get_text(strip=True)
            if not text or "Fin del " in text or "Continuará" in text:
                continue
            
            for key_phrase, img_name in mapping.items():
                if key_phrase in text:
                    current_image = img_name
            
            timeline.append({"text": text, "image": current_image})
            
    clips_list = []
    print(f"Generando {len(timeline)} mini-clips con voz {voice}...")
    
    for i, item in enumerate(timeline):
        text = item["text"]
        bg_name = item["image"]
        
        audio_file = os.path.join(TEMP_DIR, f"s{args.story}_audio_{i:03d}.mp3")
        text_img_file = os.path.join(TEMP_DIR, f"s{args.story}_text_{i:03d}.png")
        bg_file = os.path.join(ASSETS_DIR, bg_name)
        clip_file = os.path.join(TEMP_DIR, f"s{args.story}_clip_{i:03d}.mp4")
        
        if not os.path.exists(audio_file) or os.path.getsize(audio_file) == 0:
            await generate_tts(text, audio_file, voice)
            
        create_transparent_text(text, text_img_file)
        
        if not os.path.exists(clip_file) or os.path.getsize(clip_file) == 0:
            render_clip(audio_file, bg_file, text_img_file, clip_file)
            print(f"Renderizado clip {i+1}/{len(timeline)}")
            
        clips_list.append(clip_file)

    print("Concatenando todo...")
    concat_txt = os.path.join(TEMP_DIR, f"s{args.story}_concat.txt")
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
    print(f"¡Audiobook completado! Guardado en: {output_video}")

if __name__ == "__main__":
    asyncio.run(main())
