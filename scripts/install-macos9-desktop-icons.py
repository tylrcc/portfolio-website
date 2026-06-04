#!/usr/bin/env python3
"""Install classic Mac OS 9 desktop icons from bearz314/MacOS9-icons (MIT).

Source: https://github.com/bearz314/MacOS9-icons
"""

from __future__ import annotations

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
REF_DIR = ROOT / 'public' / 'desktop-icons' / '_ref'
OUT_DIR = ROOT / 'public' / 'desktop-icons'
REF_BASE = 'https://raw.githubusercontent.com/bearz314/MacOS9-icons/master/png%2064px'
SIZE = 48

# Icon index in the MacOS9-icons pack -> desktop filename
MAPPING: dict[str, int] = {
    'readme': 28,    # SimpleText (pencil on paper)
    'spotify': 4,    # CD
    'about': 33,     # folder + info badge
    'hd': 2,         # Macintosh drive
    'linkedin': 39,  # alias-style folder badge
    'contact': 43,   # folder + document
    'work': 34,      # classic lavender folder
    'cv': 11,        # text / font document stack
}


def flood_transparent(im: Image.Image) -> Image.Image:
    arr = np.array(im.convert('RGBA'))
    h, w = arr.shape[:2]
    visited = np.zeros((h, w), bool)
    q: deque[tuple[int, int]] = deque()
    for x in range(w):
        q.append((0, x))
        q.append((h - 1, x))
    for y in range(h):
        q.append((y, 0))
        q.append((y, w - 1))
    while q:
        y, x = q.popleft()
        if y < 0 or y >= h or x < 0 or x >= w or visited[y, x]:
            continue
        if arr[y, x, :3].max() > 32:
            continue
        visited[y, x] = True
        arr[y, x, 3] = 0
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            q.append((y + dy, x + dx))
    return Image.fromarray(arr)


def export_icon(name: str, index: int) -> None:
    src = REF_DIR / f'{index}.png'
    if not src.exists():
        raise FileNotFoundError(
            f'Missing {src}. Download {REF_BASE}/{index}.png into public/desktop-icons/_ref/'
        )
    im = flood_transparent(Image.open(src))
    im.thumbnail((SIZE, SIZE), Image.Resampling.LANCZOS)
    canvas = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    canvas.paste(im, ((SIZE - im.width) // 2, (SIZE - im.height) // 2), im)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    canvas.save(OUT_DIR / f'{name}.png')
    print(f'wrote {name}.png <- {index}.png')


def export_doom() -> None:
    src = ROOT / 'public' / 'doom-icon.png'
    im = flood_transparent(Image.open(src))
    im.thumbnail((SIZE, SIZE), Image.Resampling.LANCZOS)
    canvas = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    canvas.paste(im, ((SIZE - im.width) // 2, (SIZE - im.height) // 2), im)
    canvas.save(OUT_DIR / 'doom.png')
    print('wrote doom.png')


def main() -> None:
    for name, index in MAPPING.items():
        export_icon(name, index)
    export_doom()


if __name__ == '__main__':
    main()
