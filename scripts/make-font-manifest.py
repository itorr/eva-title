"""Generate the static title-font manifest from the font served with the page."""

import argparse
import hashlib
import json
from pathlib import Path
import unicodedata
from urllib.parse import quote

from fontTools.pens.boundsPen import BoundsPen
from fontTools.ttLib import TTFont


def get_coverage(font):
    glyphs = font.getGlyphSet()
    coverage = []
    cmap = font.getBestCmap() or {}
    for codepoint, name in sorted(cmap.items()):
        category = unicodedata.category(chr(codepoint))
        if name == ".notdef" or category in {"Cc", "Cs"}:
            continue
        pen = BoundsPen(glyphs)
        glyphs[name].draw(pen)
        if pen.bounds is not None or category == "Zs":
            coverage.append(codepoint)
    return coverage


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("font", type=Path)
    parser.add_argument("manifest", type=Path)
    args = parser.parse_args()
    font_path = args.font.resolve()
    try:
        relative_path = font_path.relative_to(args.manifest.resolve().parent)
    except ValueError:
        parser.error("The font must be in or below the manifest directory.")

    with TTFont(font_path) as font:
        if font.flavor not in {"woff", "woff2"}:
            parser.error("Expected a WOFF or WOFF2 font.")
        coverage = get_coverage(font)
        if not coverage:
            parser.error("The font has no supported Unicode code points.")

    version = hashlib.sha256(font_path.read_bytes()).hexdigest()[:12]
    manifest = {
        "font": f"{quote(relative_path.as_posix())}?v={version}",
        "codepoints": coverage,
    }
    args.manifest.write_text(
        json.dumps(manifest, separators=(",", ":")) + "\n", encoding="utf-8"
    )


if __name__ == "__main__":
    main()
