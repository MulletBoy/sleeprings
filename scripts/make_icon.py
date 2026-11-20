"""Draws the brand icon (three gradient rings) without any image library.

Usage: python scripts/make_icon.py
Writes custom_components/sleep_rings/brand/icon.png (256) and icon@2x.png (512).
"""

from __future__ import annotations

import math
import struct
import zlib
from pathlib import Path

# (radius, start colour, end colour, filled fraction) on a 256-unit canvas
RINGS = (
    (104, (0xFF, 0xB2, 0x24), (0xFF, 0x7A, 0x3D), 0.90),
    (76, (0xFF, 0x2F, 0xD6), (0xA4, 0x6B, 0xFF), 0.78),
    (48, (0x5D, 0xF0, 0xA8), (0x4D, 0xF3, 0xFF), 0.66),
)
STROKE = 20
TRACK_ALPHA = 0.18
SAMPLES = 3  # per axis, for smooth edges


def _coverage(distance: float, half_width: float) -> bool:
    return distance <= half_width


def _sample(x: float, y: float) -> tuple[float, float, float, float]:
    """Return premultiplied RGBA at a point of the 256-unit canvas."""
    dx, dy = x - 128, y - 128
    radius = math.hypot(dx, dy)
    for ring_radius, start, end, fraction in RINGS:
        if abs(radius - ring_radius) > STROKE / 2:
            continue
        # Angle clockwise from 12 o'clock, as a fraction of the circle.
        turn = (math.atan2(dx, -dy) / (2 * math.pi)) % 1
        mix = y / 256
        colour = tuple(a + (b - a) * mix for a, b in zip(start, end, strict=True))
        inside = turn <= fraction
        if not inside:
            # Round caps at both ends of the arc.
            for cap_turn in (0.0, fraction):
                angle = cap_turn * 2 * math.pi
                cx = 128 + ring_radius * math.sin(angle)
                cy = 128 - ring_radius * math.cos(angle)
                if math.hypot(x - cx, y - cy) <= STROKE / 2:
                    inside = True
        alpha = 1.0 if inside else TRACK_ALPHA
        return (colour[0] * alpha, colour[1] * alpha, colour[2] * alpha, alpha)
    return (0.0, 0.0, 0.0, 0.0)


def render(size: int) -> bytes:
    scale = 256 / size
    rows = bytearray()
    for py in range(size):
        rows.append(0)  # PNG filter: none
        for px in range(size):
            r = g = b = a = 0.0
            for sy in range(SAMPLES):
                for sx in range(SAMPLES):
                    sample = _sample(
                        (px + (sx + 0.5) / SAMPLES) * scale,
                        (py + (sy + 0.5) / SAMPLES) * scale,
                    )
                    r, g, b, a = r + sample[0], g + sample[1], b + sample[2], a + sample[3]
            if a > 0:
                rows += bytes((round(r / a), round(g / a), round(b / a)))
            else:
                rows += b"\x00\x00\x00"
            rows.append(round(255 * a / SAMPLES**2))

    def chunk(kind: bytes, data: bytes) -> bytes:
        body = kind + data
        return struct.pack(">I", len(data)) + body + struct.pack(">I", zlib.crc32(body))

    header = struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0)
    return (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", header)
        + chunk(b"IDAT", zlib.compress(bytes(rows), 9))
        + chunk(b"IEND", b"")
    )


def main() -> None:
    target = Path(__file__).resolve().parent.parent / "custom_components/sleep_rings/brand"
    target.mkdir(parents=True, exist_ok=True)
    for name, size in (("icon.png", 256), ("icon@2x.png", 512)):
        (target / name).write_bytes(render(size))
        print("wrote", target / name)


if __name__ == "__main__":
    main()
