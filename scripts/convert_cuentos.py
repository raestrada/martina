#!/usr/bin/env python3
"""Convert HTML story files to Eleventy Nunjucks templates."""

import re
import os

CUENTOS_DIR = "cuentos"
OUTPUT_DIR = "cuentos"  # same dir, different extension

def extract_meta(html):
    """Extract SEO meta tags from HTML head."""
    meta = {}
    
    title_m = re.search(r"<title>(.*?)</title>", html)
    if title_m:
        meta["title"] = title_m.group(1)
    
    desc_m = re.search(r'<meta name="description" content="(.*?)"', html)
    if desc_m:
        meta["description"] = desc_m.group(1)
    
    kw_m = re.search(r'<meta name="keywords" content="(.*?)"', html)
    if kw_m:
        meta["keywords"] = kw_m.group(1)
    
    og_img_m = re.search(r'<meta property="og:image" content="\.\./(assets/img/.*?)"', html)
    if og_img_m:
        meta["ogImage"] = "/" + og_img_m.group(1)
    
    og_title_m = re.search(r'<meta property="og:title" content="(.*?)"', html)
    if og_title_m:
        meta["ogTitle"] = og_title_m.group(1)
    
    og_desc_m = re.search(r'<meta property="og:description" content="(.*?)"', html)
    if og_desc_m:
        meta["ogDescription"] = og_desc_m.group(1)
    
    return meta


def extract_article(html):
    """Extract content between <article class="story-body"> and </article>."""
    match = re.search(
        r'<article class="story-body">(.*?)</article>', html, re.DOTALL
    )
    if not match:
        return None
    return match.group(1)


def fix_paths(content):
    """Replace relative paths with absolute paths."""
    # ../assets/... -> /assets/...
    content = content.replace('../assets/', '/assets/')
    # ../css/... -> /css/...
    content = content.replace('../css/', '/css/')
    # ../js/... -> /js/...
    content = content.replace('../js/', '/js/')
    # ../index.html -> /
    content = content.replace('../index.html', '/')
    # ../juegos.html -> /juegos.html etc
    content = content.replace('../juegos.html', '/juegos.html')
    content = content.replace('../album.html', '/album.html')
    content = content.replace('../acerca-de.html', '/acerca-de.html')
    content = content.replace('../galeria.html', '/galeria.html')
    content = content.replace('../difundir.html', '/difundir.html')
    return content


def replace_footer(content):
    """Replace share+volver+disqus footer with include directive."""
    match = re.search(r'\n\s*<div class="story-share"', content)
    if match:
        before = content[:match.start()]
        return before.rstrip() + '\n\n  {% include "story-footer.njk" %}\n'
    return content


def convert_file(html_path):
    """Convert a single HTML file to Nunjucks template."""
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    meta = extract_meta(html)
    article = extract_article(html)
    
    if not article:
        print(f"WARNING: Could not extract article from {html_path}")
        return None
    
    # Fix paths in article
    article = fix_paths(article)
    
    # Replace the footer portion with include
    article = replace_footer(article)
    
    # Build front matter
    def yaml_val(v):
        """Quote YAML value if it contains special characters."""
        if not v:
            return '""'
        if any(c in v for c in [':', '#', '&', '*', '!', '|', '>', '%', '@', '`', '[', ']', '{', '}']):
            return f'"{v}"'
        return v

    fm = "---\n"
    fm += "layout: base.njk\n"
    fm += f"title: {yaml_val(meta.get('title', ''))}\n"
    fm += f"description: {yaml_val(meta.get('description', ''))}\n"
    fm += f"keywords: {yaml_val(meta.get('keywords', ''))}\n"
    fm += 'ogType: article\n'
    fm += f"ogImage: {yaml_val(meta.get('ogImage', ''))}\n"
    if meta.get('ogTitle'):
        fm += f"ogTitle: {yaml_val(meta.get('ogTitle', ''))}\n"
    if meta.get('ogDescription'):
        fm += f"ogDescription: {yaml_val(meta.get('ogDescription', ''))}\n"
    fm += "activeNav: cuentos\n"
    fm += "---\n\n"
    
    # Build output
    output = fm
    output += '<article class="story-body">\n'
    output += article.rstrip()
    output += '\n</article>\n'
    
    return output


def main():
    files = sorted(f for f in os.listdir(CUENTOS_DIR) if f.endswith('.html'))
    
    for fname in files:
        html_path = os.path.join(CUENTOS_DIR, fname)
        njk_name = fname.replace('.html', '.njk')
        njk_path = os.path.join(OUTPUT_DIR, njk_name)
        
        print(f"Converting {fname} -> {njk_name}...")
        result = convert_file(html_path)
        
        if result:
            with open(njk_path, 'w', encoding='utf-8') as f:
                f.write(result)
            print(f"  OK: {njk_path}")
        else:
            print(f"  FAILED: {fname}")


if __name__ == '__main__':
    main()
