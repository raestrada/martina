#!/usr/bin/env python3
"""Add breadcrumbs, reading time, audiobook CSS classes, and prev/next to cuento .njk files."""

import os
import re
import glob

CUENTOS = sorted(glob.glob("cuentos/*.njk"))

SLUGS = {
    1: 'el-primer-movimiento', 2: 'tic-tac-jaque-mate',
    3: 'la-clavada-del-alfil-exiliado', 4: 'el-caballo-salvaje',
    5: 'la-coronacion-de-peoncito', 6: 'la-jugada-invisible',
    7: 'el-pescador-y-el-elegante', 8: 'el-relampago-y-el-vikingo',
    9: 'la-sombra-que-jugaba', 10: 'lo-que-no-se-ve-en-el-tablero',
    11: 'la-ultima-grieta', 12: 'el-peon-que-bailaba',
    13: 'lo-que-estaba-escrito', 14: 'hielo-que-quema',
    15: 'el-ultimo-capitulo', 16: 'fuego-contra-todos'
}
TITLES = {
    1: 'El Primer Movimiento', 2: 'Tic, Tac, Jaque Mate',
    3: 'La Clavada del Alfil Exiliado', 4: 'El Caballo Salvaje',
    5: 'La Coronación de Peoncito', 6: 'La Jugada Invisible',
    7: 'El Pescador y el Elegante', 8: 'El Relámpago y el Vikingo',
    9: 'La Sombra que Jugaba', 10: 'Lo Que No Se Ve en el Tablero',
    11: 'La Última Grieta', 12: 'El Peón que Bailaba',
    13: 'Lo Que Estaba Escrito', 14: 'Hielo que Quema',
    15: 'El Último Capítulo', 16: 'Fuego Contra Todos'
}

def get_num(filename):
    m = re.search(r'(\d+)', os.path.basename(filename))
    return int(m.group(1)) if m else 0

def add_prev_next(front_matter, num):
    prev_num = num - 1
    next_num = num + 1
    
    lines = []
    for line in front_matter.split('\n'):
        lines.append(line)
        if line.strip().startswith('activeNav:'):
            if prev_num >= 1:
                lines.append(f'prevCuento:')
                lines.append(f'  url: /cuentos/{prev_num:02d}-{SLUGS[prev_num]}.html')
                lines.append(f'  title: "{TITLES[prev_num]}"')
            if next_num <= 16:
                lines.append(f'nextCuento:')
                lines.append(f'  url: /cuentos/{next_num:02d}-{SLUGS[next_num]}.html')
                lines.append(f'  title: "{TITLES[next_num]}"')
    return '\n'.join(lines)

def replace_audiobook(content):
    c = content
    if '<details class="audiobook-container"' not in c:
        c = c.replace(
            '<details style="margin: 2rem 0; padding: 1rem; background-color: var(--board-dark); border-radius: var(--radius); cursor: pointer;">',
            '<details class="audiobook-container">'
        )
    if 'class="audiobook-body"' not in c:
        c = c.replace(
            '<summary style="color: var(--board-light); font-weight: bold; font-size: 1.1rem; text-align: center; outline: none;">',
            '<summary>'
        )
        c = c.replace(
            '<div style="text-align: center; margin-top: 1.5rem; cursor: default;">',
            '<div class="audiobook-body">'
        )
        c = re.sub(
            r'<video controls style="width: 100%; max-width: 800px; border-radius: var\(--radius\); box-shadow: var\(--shadow-hover\);">',
            '<video controls>',
            c
        )
        c = re.sub(
            r'<a href="([^"]+)" download[^>]*class="btn" style="display: inline-block;">',
            r'<a href="\1" download class="btn audiobook-download">',
            c
        )
    return c

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    num = get_num(filepath)

    parts = content.split('---', 2)
    if len(parts) < 3:
        print(f"  SKIP {filepath}: no valid front matter")
        return

    fm = parts[1]
    body = parts[2]
    new_fm = add_prev_next(fm, num)
    body = replace_audiobook(body)

    new_content = '---' + new_fm + '---' + body

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"  OK cuento {num}")


for fp in CUENTOS:
    process_file(fp)
