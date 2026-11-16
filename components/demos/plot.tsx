'use client';
import { useEffect, useRef } from 'react';

export type Painter = (ctx: CanvasRenderingContext2D) => void;
export const W = 440,
  H = 216;

export function Plot({ draw, label }: { draw: Painter; label: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const paint = () => {
      const width = el.clientWidth;
      if (!width) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      el.width = Math.round(width * ratio);
      el.height = Math.round((el.width * H) / W);
      const ctx = el.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(el.width / W, 0, 0, el.height / H, 0, 0);
      draw(ctx);
    };
    const observer = new ResizeObserver(paint);
    observer.observe(el);
    paint();
    return () => observer.disconnect();
  }, [draw]);
  return (
    <canvas
      ref={canvas}
      width={W}
      height={H}
      className="plot"
      role="img"
      aria-label={label}
    />
  );
}

export function grid(
  c: CanvasRenderingContext2D,
  background: string,
  dots: string,
) {
  c.fillStyle = background;
  c.fillRect(0, 0, W, H);
  c.fillStyle = dots;
  for (let x = 10; x < W; x += 14)
    for (let y = 10; y < H; y += 14) c.fillRect(x, y, 1, 1);
}

export function line(
  c: CanvasRenderingContext2D,
  points: number[][],
  stroke: string,
  width = 1,
) {
  c.beginPath();
  points.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
  c.strokeStyle = stroke;
  c.lineWidth = width;
  c.stroke();
}
export function label(
  c: CanvasRenderingContext2D,
  words: string,
  x: number,
  y: number,
  color: string,
  size = 10,
) {
  c.fillStyle = color;
  c.font = size + 'px ui-monospace, monospace';
  c.fillText(words, x, y);
}
