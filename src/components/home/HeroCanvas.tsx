"use client";
import { useEffect, useRef } from "react";

import { createNoise3D } from "@/lib/noise";
import { prefersReducedMotion } from "@/lib/hooks";

interface Pen {
    x: number;
    y: number;
    life: number;
    signal: boolean;
}

const PENS = 70;
const STEPS_PER_FRAME = 3;

/**
 * The home page's frontispiece: a pen plotter tracing a noise field in ink on paper.
 * Lines accumulate, then the sheet is slowly washed back so the drawing never saturates.
 */
export default function HeroCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const parent = canvas?.parentElement;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !parent || !ctx) return;

        const noise = createNoise3D(Math.floor(Math.random() * 1e6));
        const pointer = { x: -9999, y: -9999 };
        let width = 0;
        let height = 0;
        let colors = { paper: "#edebe4", ink: "#151514", signal: "#ff4f1a" };
        let z = 0;
        let frame = 0;
        let tick = 0;

        const readColors = () => {
            const style = getComputedStyle(canvas);
            colors = {
                paper: style.getPropertyValue("--paper").trim() || colors.paper,
                ink: style.getPropertyValue("--ink").trim() || colors.ink,
                signal: style.getPropertyValue("--signal").trim() || colors.signal,
            };
        };

        const spawn = (pen: Pen) => {
            pen.x = Math.random() * width;
            pen.y = Math.random() * height;
            pen.life = 80 + Math.random() * 220;
            return pen;
        };

        const pens: Pen[] = Array.from({ length: PENS }, (_, i) => ({ x: 0, y: 0, life: 0, signal: i % 14 === 0 }));

        const clear = () => {
            ctx.fillStyle = colors.paper;
            ctx.fillRect(0, 0, width, height);
        };

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = parent.clientWidth;
            height = parent.clientHeight;
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            readColors();
            clear();
            pens.forEach(spawn);
        };

        const step = () => {
            const scale = 0.0032;
            ctx.lineWidth = 0.9;
            ctx.lineCap = "round";

            for (const signal of [false, true]) {
                ctx.strokeStyle = signal ? colors.signal : colors.ink;
                ctx.globalAlpha = signal ? 0.7 : 0.32;
                ctx.beginPath();
                for (const pen of pens) {
                    if (pen.signal !== signal) continue;
                    let angle = noise(pen.x * scale, pen.y * scale, z) * Math.PI * 3;

                    // Lines bend away from the pointer
                    const dx = pen.x - pointer.x;
                    const dy = pen.y - pointer.y;
                    const d = Math.hypot(dx, dy);
                    if (d < 120) {
                        const away = Math.atan2(dy, dx);
                        const t = 1 - d / 120;
                        angle = angle * (1 - t) + away * t;
                    }

                    const nx = pen.x + Math.cos(angle) * 1.6;
                    const ny = pen.y + Math.sin(angle) * 1.6;
                    ctx.moveTo(pen.x, pen.y);
                    ctx.lineTo(nx, ny);
                    pen.x = nx;
                    pen.y = ny;
                    pen.life--;
                    if (pen.life <= 0 || nx < -10 || ny < -10 || nx > width + 10 || ny > height + 10) spawn(pen);
                }
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
            z += 0.0009;
        };

        const loop = () => {
            frame = requestAnimationFrame(loop);
            for (let i = 0; i < STEPS_PER_FRAME; i++) step();
            // Every so often, wash the sheet back a little
            if (++tick % 4 === 0) {
                ctx.globalAlpha = 0.018;
                clear();
                ctx.globalAlpha = 1;
            }
        };

        resize();
        const observer = new ResizeObserver(() => {
            if (parent.clientWidth !== width || parent.clientHeight !== height) resize();
        });
        observer.observe(parent);

        // Repaint in the new palette when the theme changes
        const themeObserver = new MutationObserver(() => {
            readColors();
            clear();
        });
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const onScheme = () => {
            readColors();
            clear();
        };
        media.addEventListener("change", onScheme);

        const onMove = (e: PointerEvent) => {
            const rect = canvas.getBoundingClientRect();
            pointer.x = e.clientX - rect.left;
            pointer.y = e.clientY - rect.top;
        };
        const onLeave = () => {
            pointer.x = pointer.y = -9999;
        };
        canvas.addEventListener("pointermove", onMove);
        canvas.addEventListener("pointerleave", onLeave);

        if (prefersReducedMotion()) {
            // A finished drawing instead of a moving one
            for (let i = 0; i < 900; i++) step();
        } else {
            // Start with a drawing already under way rather than a blank sheet
            for (let i = 0; i < 160; i++) step();
            loop();
        }

        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
            themeObserver.disconnect();
            media.removeEventListener("change", onScheme);
            canvas.removeEventListener("pointermove", onMove);
            canvas.removeEventListener("pointerleave", onLeave);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 block" aria-hidden="true" />;
}
