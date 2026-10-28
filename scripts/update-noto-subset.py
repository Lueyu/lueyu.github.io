"""Refresh the two local Noto Sans SC subsets after visible site copy changes."""

from pathlib import Path
import re
from urllib.parse import urlencode
from urllib.request import Request, urlopen

root = Path(__file__).resolve().parents[1]
sources = [root / "src" / "App.tsx", *(root / "src" / "pages").glob("*.tsx")]
characters = "".join(sorted({char for path in sources for char in path.read_text(encoding="utf-8") if char.isprintable()}))

for weight in (400, 700):
    query = urlencode({"family": f"Noto Sans SC:wght@{weight}", "display": "swap", "text": characters})
    request = Request(
        f"https://fonts.googleapis.com/css2?{query}",
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36"},
    )
    with urlopen(request, timeout=30) as response:
        css = response.read().decode("utf-8")
    match = re.search(r"url\((https://[^)]+)\)\s*format\(['\"]woff2['\"]\)", css)
    if not match:
        raise RuntimeError(f"Google Fonts did not return a WOFF2 font URL for {weight}")
    with urlopen(match.group(1), timeout=30) as response:
        font = response.read()
    if not font.startswith(b"wOF2"):
        raise RuntimeError(f"Downloaded font for {weight} is not WOFF2")
    destination = root / "public" / "fonts" / f"noto-sans-sc-{weight}.woff2"
    destination.write_bytes(font)
    print(f"Wrote {destination.name}: {len(font)} bytes, {len(characters)} characters")
