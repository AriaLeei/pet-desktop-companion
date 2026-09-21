#!/usr/bin/env python3
"""Validate required desktop-pet sprites and common alpha defects."""

import argparse
from pathlib import Path
from PIL import Image


def edge_alpha(alpha: Image.Image) -> int:
    width, height = alpha.size
    edges = (
        list(alpha.crop((0, 0, width, 1)).getdata())
        + list(alpha.crop((0, height - 1, width, height)).getdata())
        + list(alpha.crop((0, 0, 1, height)).getdata())
        + list(alpha.crop((width - 1, 0, width, height)).getdata())
    )
    return max(edges)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("assets", type=Path)
    args = parser.parse_args()
    required = [
        *(args.assets / "walk" / f"walk-{index:02d}.png" for index in range(1, 5)),
        *(args.assets / "sit" / f"{name}.png" for name in ("center", "left", "right")),
    ]
    errors = []
    for path in required:
        if not path.exists():
            errors.append(f"missing: {path}")
            continue
        image = Image.open(path)
        if image.mode != "RGBA":
            errors.append(f"not RGBA: {path}")
            continue
        alpha = image.getchannel("A")
        low, high = alpha.getextrema()
        if low != 0 or high == 0:
            errors.append(f"invalid transparency range {low}..{high}: {path}")
        if edge_alpha(alpha) > 12:
            errors.append(f"visible pixels touch canvas edge: {path}")
    if errors:
        raise SystemExit("\n".join(errors))
    print(f"Validated {len(required)} required sprite assets.")


if __name__ == "__main__":
    main()
