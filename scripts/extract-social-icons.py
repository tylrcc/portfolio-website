#!/usr/bin/env python3
"""Crop icons from public/social-icons-strip.png into public/social-icons/*.png."""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
STRIP = ROOT / 'public' / 'social-icons-strip.png'
OUT_DIR = ROOT / 'public' / 'social-icons'
NAMES = ['email', 'github', 'linkedin', 'twitter', 'telegram', 'wechat']
OUT_SIZE = 64
PADDING = 12
INK_THRESHOLD = 240
GAP = 10


def find_icon_groups(strip: Image.Image) -> list[tuple[int, int]]:
    arr = np.array(strip.convert('RGBA'))
    ink = (arr[:, :, :3].min(axis=2) < INK_THRESHOLD) & (arr[:, :, 3] > 128)
    cols = np.where(ink.sum(axis=0) > 0)[0]
    if cols.size == 0:
        raise RuntimeError('No icons detected in strip image')

    groups: list[tuple[int, int]] = []
    start = int(cols[0])
    prev = int(cols[0])
    for col in cols[1:]:
        col = int(col)
        if col - prev > GAP:
            groups.append((start, prev))
            start = col
        prev = col
    groups.append((start, prev))
    return groups


def export_icon(strip: Image.Image, box: tuple[int, int, int, int], dest: Path) -> None:
    crop = strip.crop(box)
    cw, ch = crop.size
    side = max(cw, ch)
    square = Image.new('RGBA', (side, side), (255, 255, 255, 0))
    square.paste(crop, ((side - cw) // 2, (side - ch) // 2))
    square = square.resize((OUT_SIZE, OUT_SIZE), Image.Resampling.LANCZOS)
    bg = Image.new('RGBA', (OUT_SIZE, OUT_SIZE), (255, 255, 255, 255))
    bg.paste(square, mask=square.split()[3])
    dest.parent.mkdir(parents=True, exist_ok=True)
    bg.save(dest)


def main() -> None:
    strip = Image.open(STRIP)
    arr = np.array(strip.convert('RGBA'))
    h, w = arr.shape[:2]
    ink = (arr[:, :, :3].min(axis=2) < INK_THRESHOLD) & (arr[:, :, 3] > 128)
    groups = find_icon_groups(strip)

    if len(groups) != len(NAMES):
        raise RuntimeError(f'Expected {len(NAMES)} icons, found {len(groups)}')

    for name, (x0, x1) in zip(NAMES, groups, strict=True):
        region = ink[:, x0 : x1 + 1]
        ys, _ = np.where(region)
        y0, y1 = int(ys.min()), int(ys.max())
        box = (
            max(0, x0 - PADDING),
            max(0, y0 - PADDING),
            min(w, x1 + PADDING + 1),
            min(h, y1 + PADDING + 1),
        )
        export_icon(strip, box, OUT_DIR / f'{name}.png')
        print(f'wrote {name}.png from {box}')


if __name__ == '__main__':
    main()
