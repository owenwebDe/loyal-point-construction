"""Cut a product (door, window frame, gate) out of its background.

    python scripts/cutout.py <input image or folder> <output folder>

Writes <name>.webp with a transparent background, trimmed to the product.
Uses rembg's BiRefNet model, which keeps thin frames and see-through openings
intact (the lighter isnet model broke the top beam of the double door).

Setup, once:  python3 -m venv .venv && .venv/bin/pip install "rembg[cpu]" pillow
The model (~1 GB) downloads to $U2NET_HOME (default ~/.u2net) on first run.

Only for free-standing products. Site work (columns, beams, decking,
containers) stays as a normal photo.
"""

import sys
from pathlib import Path

from PIL import Image
from rembg import new_session, remove

IMAGE_EXT = {".jpg", ".jpeg", ".png", ".webp"}


def main() -> None:
    src, out = Path(sys.argv[1]), Path(sys.argv[2])
    out.mkdir(parents=True, exist_ok=True)
    files = [src] if src.is_file() else sorted(p for p in src.iterdir() if p.suffix.lower() in IMAGE_EXT)
    session = new_session("birefnet-general")
    for file in files:
        image = Image.open(file).convert("RGB")
        cut = remove(image, session=session, post_process_mask=True)
        box = cut.getbbox()
        if box:
            cut = cut.crop(box)
        target = out / f"{file.stem}.webp"
        cut.save(target, "WEBP", quality=90, method=6)
        print(f"{file.name} -> {target} {cut.size}")


if __name__ == "__main__":
    main()
