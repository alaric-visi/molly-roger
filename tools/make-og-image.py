#!/usr/bin/env python3
"""Draws the social preview card (public/og-image.png, 1200x630).

Uses fonts that ship with macOS; on another system, point FONTS at any
serif / monospace TrueType files. Needs Pillow (pip install pillow).
"""
import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 1200, 630
OUT = Path(__file__).resolve().parent.parent / "public" / "og-image.png"
FONTS = "/System/Library/Fonts/Supplemental/"
title_font = ImageFont.truetype(FONTS + "Baskerville.ttc", 92)
sub_font = ImageFont.truetype(FONTS + "Georgia Italic.ttf", 34)
eyebrow_font = ImageFont.truetype(FONTS + "Courier New.ttf", 22)

INK = (11, 10, 16)
CREAM = (244, 236, 218)
BRASS = (201, 162, 39)
VIOLET = (155, 130, 255)

img = Image.new("RGB", (W, H), INK)
d = ImageDraw.Draw(img)

# Night-sky gradient.
for y in range(H):
    t = y / H
    c = tuple(int(a + (b - a) * t) for a, b in zip((34, 26, 72), (7, 5, 20)))
    d.line([(0, y), (W, y)], fill=c)

# Glows: lamplight on the left, moonlight on the right.
glow = Image.new("RGB", (W, H), (0, 0, 0))
g = ImageDraw.Draw(glow)
g.ellipse((-200, 120, 520, 760), fill=(90, 60, 20))
g.ellipse((800, 40, 1080, 320), fill=(80, 70, 140))
img = Image.blend(img, Image.composite(glow, img, glow.convert("L").point(lambda v: 255 if v else 0)).filter(ImageFilter.GaussianBlur(120)), 0.55)
d = ImageDraw.Draw(img)

# Stars.
rnd = random.Random(1845)
for _ in range(120):
    x, y, r = rnd.randrange(W), rnd.randrange(int(H * 0.6)), rnd.choice([1, 1, 1, 2])
    a = rnd.randint(90, 230)
    d.ellipse((x - r, y - r, x + r, y + r), fill=(a, a, min(255, a + 20)))

# Moon.
d.ellipse((900, 90, 990, 180), fill=(236, 232, 255))
d.ellipse((885, 80, 970, 170), fill=(40, 32, 84))

# Sea: three wave bands.
for i, (y0, col) in enumerate([(500, (40, 30, 96)), (540, (28, 20, 70)), (585, (14, 10, 40))]):
    pts = [(x, y0 + 9 * math.sin(x / 55 + i)) for x in range(0, W + 10, 10)] + [(W, H), (0, H)]
    d.polygon(pts, fill=col)

# A small ship on the horizon, under sail.
sx, sy = 930, 500
d.polygon([(sx - 70, sy - 8), (sx + 70, sy - 8), (sx + 50, sy + 14), (sx - 52, sy + 14)], fill=INK)
d.line([(sx - 20, sy - 8), (sx - 20, sy - 120)], fill=INK, width=4)
d.line([(sx + 25, sy - 8), (sx + 25, sy - 100)], fill=INK, width=4)
d.polygon([(sx - 18, sy - 116), (sx + 18, sy - 84), (sx - 18, sy - 56)], fill=CREAM)
d.polygon([(sx - 18, sy - 52), (sx + 22, sy - 30), (sx - 18, sy - 12)], fill=(226, 216, 196))
d.polygon([(sx + 27, sy - 96), (sx + 58, sy - 68), (sx + 27, sy - 40)], fill=(226, 216, 196))
d.polygon([(sx - 20, sy - 124), (sx + 4, sy - 120), (sx - 20, sy - 114)], fill=INK)

# Theatre valance across the top.
d.rectangle((0, 0, W, 16), fill=(58, 12, 20))
for x in range(0, W + 40, 40):
    d.ellipse((x - 20, 2, x + 20, 30), fill=(90, 20, 32))
d.line([(0, 30), (W, 30)], fill=BRASS, width=2)

# Text.
x0 = 80
# Eyebrow, with small drawn dots between the parts (the font has no middle dot).
cx = x0
for i, part in enumerate(["RIDGEWELL EDUTAINMENT CENTRE", "LONDON", "1845"]):
    if i:
        d.ellipse((cx + 14, 160, cx + 20, 166), fill=BRASS)
        cx += 34
    d.text((cx, 150), part, font=eyebrow_font, fill=(190, 180, 160))
    cx += d.textlength(part, font=eyebrow_font)
for i, line in enumerate(["The Ghost of", "Molly Roger"]):
    y = 200 + i * 104
    d.text((x0 - 2, y), line, font=title_font, fill=(40, 150, 190))   # psychic interference
    d.text((x0 + 2, y), line, font=title_font, fill=(190, 40, 120))
    d.text((x0, y), line, font=title_font, fill=CREAM)
# A rule with a four-pointed ornament, drawn (the font has no such glyph).
ox, oy = x0 + 140, 430
d.line([(x0, oy), (ox - 20, oy)], fill=BRASS, width=2)
d.polygon([(ox, oy - 11), (ox + 3, oy - 3), (ox + 11, oy), (ox + 3, oy + 3), (ox, oy + 11), (ox - 3, oy + 3), (ox - 11, oy), (ox - 3, oy - 3)], fill=BRASS)
d.line([(ox + 20, oy), (ox + 140, oy)], fill=BRASS, width=2)
d.text((x0, 450), "A psychic adventure in Victorian England", font=sub_font, fill=(214, 204, 255))

img.save(OUT, optimize=True)
print(f"wrote {OUT} ({OUT.stat().st_size // 1024} KB)")
