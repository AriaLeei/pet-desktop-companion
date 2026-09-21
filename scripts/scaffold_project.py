#!/usr/bin/env python3
"""Copy the bundled Electron starter into a new project directory."""

import argparse
import shutil
from pathlib import Path


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("destination", type=Path)
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()
    source = Path(__file__).resolve().parent.parent / "assets" / "electron-template"
    if args.destination.exists():
        if not args.force:
            raise SystemExit(f"Destination already exists: {args.destination}")
        shutil.rmtree(args.destination)
    shutil.copytree(source, args.destination)
    (args.destination / "assets" / "walk").mkdir(parents=True)
    (args.destination / "assets" / "sit").mkdir(parents=True)
    print(args.destination.resolve())


if __name__ == "__main__":
    main()
