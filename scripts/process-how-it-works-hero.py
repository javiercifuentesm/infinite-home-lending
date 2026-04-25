#!/usr/bin/env python3
"""Process How It Works hero: remove bottom-right watermark, color balance, export WebP."""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageEnhance

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "scripts" / "how-it-works-hero-source.png"
OUT_DIR = ROOT / "public"


def remove_right_edge_figure(
    im: Image.Image,
    strip_width: int = 400,
    gap_before_dest: int = 160,
) -> Image.Image:
    """Remove figure on far right: paste a clean strip from farther left (not adjacent—avoids copying the arm)."""
    w, h = im.size
    # Allow up to half the frame width so we can clear a figure that sits mid–right edge
    sw = min(strip_width, w // 2)
    if sw < 24:
        return im
    dest_x0 = w - sw
    # Source ends with a gap left of the destination so we never sample the figure
    src_x1 = dest_x0 - gap_before_dest
    src_x0 = src_x1 - sw
    if src_x0 < 0:
        # Narrow gap if needed so we still sample from the path, not the edge
        gap_before_dest = max(80, w // 8)
        src_x1 = dest_x0 - gap_before_dest
        src_x0 = max(0, src_x1 - sw)
        src_x1 = src_x0 + sw
    patch = im.crop((src_x0, 0, src_x1, h))
    if patch.width != sw:
        patch = patch.resize((sw, h), Image.Resampling.LANCZOS)
    out = im.copy()
    out.paste(patch, (dest_x0, 0))
    # Blend seam using column just left of patch (not im at dest_x0—may still be the arm)
    seam = 12
    if dest_x0 > 0:
        left_ref = im.crop((dest_x0 - 1, 0, dest_x0, h))
        for i in range(min(seam, w - dest_x0)):
            col_patch = out.crop((dest_x0 + i, 0, dest_x0 + i + 1, h))
            alpha = (i + 1) / (seam + 1)
            blended = Image.blend(left_ref, col_patch, alpha)
            out.paste(blended, (dest_x0 + i, 0))
    return out


def remove_corner_watermark(im: Image.Image) -> Image.Image:
    """Replace bottom-right watermark area by cloning the path texture from directly above."""
    w, h = im.size
    wr = min(128, w // 5)
    hr = min(68, h // 9)
    x0, y0 = w - wr, h - hr
    src_y1 = max(1, y0 - 12)
    src_y0 = src_y1 - hr
    if src_y0 < 0:
        src_y0 = 0
        src_y1 = hr
    patch = im.crop((x0, src_y0, w, src_y1))
    if patch.size != (wr, hr):
        patch = patch.resize((wr, hr), Image.Resampling.LANCZOS)
    out = im.copy()
    out.paste(patch, (x0, y0))
    return out


def adjust_tone(im: Image.Image) -> Image.Image:
    """Slightly cooler (-warmth), modest contrast bump."""
    r, g, b = im.split()
    r = r.point(lambda i: int(i * 0.94))
    b = b.point(lambda i: min(255, int(i * 1.04)))
    im = Image.merge("RGB", (r, g, b))
    im = ImageEnhance.Contrast(im).enhance(1.06)
    im = ImageEnhance.Color(im).enhance(0.94)
    return im


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"Missing source image: {SRC}")
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    im = Image.open(SRC).convert("RGB")
    # Only used for night shots with a figure clipped on the far right; breaks sunset/wide compositions.
    # im = remove_right_edge_figure(im)
    im = remove_corner_watermark(im)
    im = adjust_tone(im)
    webp_path = OUT_DIR / "how-it-works-hero.webp"
    im.save(webp_path, "WEBP", quality=88, method=6)
    im.save(OUT_DIR / "how-it-works-hero.png", "PNG", optimize=True, compress_level=9)
    print("Wrote", webp_path, im.size)


if __name__ == "__main__":
    main()
