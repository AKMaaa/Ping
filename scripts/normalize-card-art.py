#!/usr/bin/env python3
"""カードイラストを同じキャンバスサイズ・同じ縦横比に揃える。

元画像は src/assets/card-art/ に置く。透過部分を除いた絵の高さを揃え、
共通の余白つきキャンバスへ下端を合わせて載せる。出力は public/cards/。
寸法は src/lib/data/card-art.ts に書き、表示側はこの値を使う。

必要: Python 3 と Pillow（pip install pillow）
"""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src/assets/card-art"
OUTPUT = ROOT / "public/cards"
META = ROOT / "src/lib/data/card-art.ts"

CONTENT_HEIGHT = 320
PAD_X = 28
PAD_TOP = 24
PAD_BOTTOM = 16
ALPHA_THRESHOLD = 16


def content_box(image: Image.Image) -> tuple[int, int, int, int]:
    alpha = image.getchannel("A")
    mask = alpha.point(lambda value: 255 if value > ALPHA_THRESHOLD else 0)
    box = mask.getbbox()
    if box is None:
        raise SystemExit("透過以外のピクセルがありません")
    return box


def main() -> None:
    files = sorted(SOURCE.glob("*.png"), key=lambda path: int(path.stem))
    if not files:
        raise SystemExit(f"元画像がありません: {SOURCE}")

    fitted: list[tuple[str, Image.Image]] = []
    for path in files:
        image = Image.open(path).convert("RGBA")
        cropped = image.crop(content_box(image))
        scale = CONTENT_HEIGHT / cropped.height
        resized = cropped.resize(
            (max(1, round(cropped.width * scale)), CONTENT_HEIGHT),
            Image.Resampling.LANCZOS,
        )
        fitted.append((path.stem, resized))

    width = max(image.width for _, image in fitted) + PAD_X * 2
    height = CONTENT_HEIGHT + PAD_TOP + PAD_BOTTOM

    OUTPUT.mkdir(parents=True, exist_ok=True)
    for stem, image in fitted:
        canvas = Image.new("RGBA", (width, height), (0, 0, 0, 0))
        x = (width - image.width) // 2
        y = PAD_TOP
        canvas.paste(image, (x, y), image)
        canvas.save(OUTPUT / f"{stem}.png", optimize=True)
        print(f"{stem}.png  content {image.width}x{image.height}  canvas {width}x{height}")

    META.write_text(
        "\n".join(
            [
                "/** scripts/normalize-card-art.py が書き出す。手で変えない。 */",
                f"export const cardArtSize = {{ width: {width}, height: {height} }} as const",
                "",
            ]
        ),
        encoding="utf-8",
    )
    print(json.dumps({"width": width, "height": height}))


if __name__ == "__main__":
    main()
