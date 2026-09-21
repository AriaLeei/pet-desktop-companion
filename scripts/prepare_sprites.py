#!/usr/bin/env python3
"""Split a sprite sheet, keep the largest alpha component, and align frames."""

import argparse
from collections import deque
from pathlib import Path
from PIL import Image


def largest_component(alpha: Image.Image, threshold: int) -> Image.Image:
    width, height = alpha.size
    source = alpha.load()
    visited = bytearray(width * height)
    winner = []
    for y in range(height):
        for x in range(width):
            offset = y * width + x
            if visited[offset] or source[x, y] <= threshold:
                continue
            queue = deque([(x, y)])
            visited[offset] = 1
            component = []
            while queue:
                px, py = queue.popleft()
                component.append((px, py))
                for nx, ny in ((px - 1, py), (px + 1, py), (px, py - 1), (px, py + 1)):
                    if not (0 <= nx < width and 0 <= ny < height):
                        continue
                    no = ny * width + nx
                    if visited[no] or source[nx, ny] <= threshold:
                        continue
                    visited[no] = 1
                    queue.append((nx, ny))
            if len(component) > len(winner):
                winner = component
    result = Image.new("L", alpha.size, 0)
    target = result.load()
    for x, y in winner:
        target[x, y] = source[x, y]
    return result


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("sheet", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--cols", type=int, required=True)
    parser.add_argument("--rows", type=int, required=True)
    parser.add_argument("--names", nargs="+")
    parser.add_argument("--canvas", type=int, default=512)
    parser.add_argument("--alpha-threshold", type=int, default=12)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    sheet = Image.open(args.sheet).convert("RGBA")
    count = args.cols * args.rows
    names = args.names or [f"frame-{index + 1:02d}" for index in range(count)]
    if len(names) != count:
        raise SystemExit(f"Expected {count} names, received {len(names)}")
    frames = []
    for row in range(args.rows):
        top = round(row * sheet.height / args.rows)
        bottom = round((row + 1) * sheet.height / args.rows)
        for col in range(args.cols):
            left = round(col * sheet.width / args.cols)
            right = round((col + 1) * sheet.width / args.cols)
            frame = sheet.crop((left, top, right, bottom))
            frame.putalpha(largest_component(frame.getchannel("A"), args.alpha_threshold))
            bbox = frame.getchannel("A").getbbox()
            if bbox is None:
                raise SystemExit(f"No visible subject found in cell {len(frames) + 1}")
            frames.append(frame.crop(bbox))
    max_width = max(frame.width for frame in frames)
    max_height = max(frame.height for frame in frames)
    limit = args.canvas - 24
    scale = min(limit / max_width, limit / max_height)
    args.output.mkdir(parents=True, exist_ok=True)
    for name, frame in zip(names, frames):
        size = (round(frame.width * scale), round(frame.height * scale))
        frame = frame.resize(size, Image.Resampling.LANCZOS)
        canvas = Image.new("RGBA", (args.canvas, args.canvas), (0, 0, 0, 0))
        canvas.alpha_composite(frame, ((args.canvas - frame.width) // 2, args.canvas - frame.height - 10))
        canvas.save(args.output / f"{name}.png")


if __name__ == "__main__":
    main()
