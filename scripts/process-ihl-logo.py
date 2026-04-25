#!/usr/bin/env python3
"""
Remove baked-in checkerboard from IHL raster export; write true RGBA PNG.
Conservative: only strips neutral light squares (white/gray), preserves gold/navy.
Run: .venv/bin/python scripts/process-ihl-logo.py
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "scripts/assets/ihl-source.png"
OUT = ROOT / "public/ihl-logo.png"


def classify_background(r: int, g: int, b: int) -> bool:
    """True -> transparent (checker tile only; keep logo pixels)."""
    mn, mx = min(r, g, b), max(r, g, b)
    sp = mx - mn
    avg = (r + g + b) / 3.0

    # Dark / saturated: never strip
    if mn < 88:
        return False
    if sp > 16:
        return False

    # Warm metallic / champagne highlights on gold (not neutral gray)
    if r >= 228 and g >= 218 and b <= 255 and (r - b) >= 6:
        return False
    if r >= 215 and g >= 195 and b <= 248 and (r - b) >= 12:
        return False

    # Light neutral backdrop only
    if sp <= 14 and avg >= 198 and mn >= 175:
        return True
    return False


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"Missing source: {SRC}")
    img = Image.open(SRC).convert("RGBA")
    px = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            if classify_background(r, g, b):
                px[x, y] = (0, 0, 0, 0)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    img.save(OUT, "PNG", optimize=True)
    print(f"Wrote {OUT} ({w}x{h})")


if __name__ == "__main__":
    main()
