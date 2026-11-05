"use client";

import { useEffect, useRef } from "react";
import { useRichMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * (01) Partikel dot-grid di canvas. Titik menjauh dari kursor lalu kembali
 * seperti pegas. Loop berhenti saat semua titik diam, tab tidak terlihat,
 * atau hero keluar viewport. Di perangkat sentuh / reduced motion: grid statis
 * dengan jarak lebih renggang (lebih sedikit titik).
 */

type Dot = { x: number; y: number; dx: number; dy: number; vx: number; vy: number; a: number };

const RADIUS = 120;
const PUSH = 26;

export function DotGrid({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const interactive = useRichMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const spacing = interactive ? 24 : 34;
    const root = document.documentElement;
    let dots: Dot[] = [];
    let width = 0;
    let height = 0;
    let color = "161,161,170";
    let raf = 0;
    let running = false;
    let visible = true;
    const mouse = { x: -9999, y: -9999 };

    function readColor() {
      color = root.classList.contains("dark") ? "82,82,91" : "161,161,170";
    }

    function build() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Kepadatan memusat di kanan-tengah, memudar ke tepi (seperti desain)
      const cx = width * 0.62;
      const cy = height * 0.45;
      const maxR = Math.max(width * 0.55, 420);
      dots = [];
      for (let y = spacing / 2; y < height; y += spacing) {
        for (let x = spacing / 2; x < width; x += spacing) {
          const d = Math.hypot((x - cx) / 1.25, y - cy) / maxR;
          const a = Math.max(0, 1 - d) ** 1.4 * 0.9;
          if (a > 0.03) dots.push({ x, y, dx: 0, dy: 0, vx: 0, vy: 0, a });
        }
      }
      draw();
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);
      for (const d of dots) {
        ctx!.fillStyle = `rgba(${color},${d.a})`;
        ctx!.beginPath();
        ctx!.arc(d.x + d.dx, d.y + d.dy, 1.25, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function step() {
      let moving = false;
      for (const d of dots) {
        let tx = 0;
        let ty = 0;
        const ex = d.x - mouse.x;
        const ey = d.y - mouse.y;
        const dist = Math.hypot(ex, ey);
        if (dist < RADIUS && dist > 0.01) {
          const f = (1 - dist / RADIUS) ** 2 * PUSH;
          tx = (ex / dist) * f;
          ty = (ey / dist) * f;
        }
        d.vx = (d.vx + (tx - d.dx) * 0.14) * 0.76;
        d.vy = (d.vy + (ty - d.dy) * 0.14) * 0.76;
        d.dx += d.vx;
        d.dy += d.vy;
        if (Math.abs(d.vx) > 0.02 || Math.abs(d.vy) > 0.02 || Math.abs(d.dx - tx) > 0.1)
          moving = true;
      }
      draw();
      if (moving && visible && !document.hidden) {
        raf = requestAnimationFrame(step);
      } else {
        running = false;
      }
    }

    function start() {
      if (running || !visible || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(step);
    }

    function onMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      start();
    }
    function onLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
      start();
    }

    readColor();
    build();

    const resizeObserver = new ResizeObserver(build);
    resizeObserver.observe(canvas);
    const themeObserver = new MutationObserver(() => {
      readColor();
      draw();
    });
    themeObserver.observe(root, { attributes: true, attributeFilter: ["class"] });

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(canvas);

    const host = canvas.parentElement;
    if (interactive && host) {
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerleave", onLeave);
    }
    const onVisibility = () => !document.hidden && start();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      io.disconnect();
      host?.removeEventListener("pointermove", onMove);
      host?.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [interactive]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  );
}
