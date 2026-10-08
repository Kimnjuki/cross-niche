#!/usr/bin/env python
"""Convert overweight PNG/JPG images in public/images to WebP.

One-time optimization (run via: uv run --with pillow python scripts/optimize-images.py).
The .webp files are committed alongside the originals; the build's copy-assets step
carries them into dist/ with no runtime conversion needed.

Usage:
  uv run --with pillow python scripts/optimize-images.py            # all images > 150KB
  uv run --with pillow python scripts/optimize-images.py --all       # every image
"""
import os
import sys

from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), "..", "public", "images")
MIN_BYTES = 150 * 1024


def walk_images():
    for dirpath, _dirs, files in os.walk(ROOT):
        for name in files:
            if name.lower().endswith((".png", ".jpg", ".jpeg")):
                yield os.path.join(dirpath, name)


def main():
    all_images = "--all" in sys.argv
    converted, skipped, saved_total = 0, 0, 0
    for path in walk_images():
        size = os.path.getsize(path)
        if not all_images and size < MIN_BYTES:
            continue
        out = os.path.splitext(path)[0] + ".webp"
        try:
            img = Image.open(path).convert("RGB")
            img.save(out, "WEBP", quality=82, method=6)
        except Exception as e:  # noqa: BLE001
            print(f"  FAIL {path}: {e}")
            skipped += 1
            continue
        new_size = os.path.getsize(out)
        saved = size - new_size
        saved_total += saved
        converted += 1
        print(f"  {size/1024:6.0f} KB -> {new_size/1024:6.0f} KB  "
              f"({100*saved/size:4.0f}% smaller)  {os.path.relpath(out, ROOT)}")
    print(f"\nConverted {converted}, skipped {skipped}, saved {saved_total/1024:.0f} KB total.")


if __name__ == "__main__":
    main()
