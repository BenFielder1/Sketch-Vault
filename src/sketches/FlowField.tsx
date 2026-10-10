"use client";
import { ControlValues } from "@/types/sketch";
import { createNoise3D } from "@/lib/noise";
import CanvasSketch, { EngineFactory, localPoint } from "./CanvasSketch";
import { SketchProps, STAGE } from "./types";

interface Particle {
    x: number;
    y: number;
    px: number;
    py: number;
    life: number;
}

const HUE_BUCKETS = 18;
const STIR_RADIUS = 140;

const createFlowField: EngineFactory<ControlValues> = ({ canvas, ctx, size, values, report }) => {
    let seed = Math.floor(Math.random() * 1e6);
    let noise = createNoise3D(seed);
    let z = 0;
    const particles: Particle[] = [];
    const pointer = { x: 0, y: 0, active: false };

    const clear = () => {
        ctx.fillStyle = STAGE.bg;
        ctx.fillRect(0, 0, size.width, size.height);
    };

    const spawn = (p: Particle) => {
        p.x = p.px = Math.random() * size.width;
        p.y = p.py = Math.random() * size.height;
        p.life = 60 + Math.random() * 240;
        return p;
    };

    const reseed = () => {
        seed = Math.floor(Math.random() * 1e6);
        noise = createNoise3D(seed);
        particles.forEach(spawn);
        clear();
    };

    const onMove = (e: PointerEvent) => Object.assign(pointer, localPoint(canvas, e), { active: true });
    const onLeave = () => (pointer.active = false);
    canvas.addEventListener("click", reseed);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    return {
        resize: () => {
            particles.forEach(spawn);
            clear();
        },
        reset: reseed,
        frame: (dt) => {
            const v = values();
            const { width, height } = size;

            const target = v.particles as number;
            while (particles.length < target) particles.push(spawn({ x: 0, y: 0, px: 0, py: 0, life: 0 }));
            if (particles.length > target) particles.length = target;

            // Fade the previous frame; a longer trail means a fainter wash
            const trail = (v.trail as number) / 100;
            ctx.fillStyle = `rgba(${STAGE.bgRgb}, ${0.005 + (1 - trail) ** 2 * 0.6})`;
            ctx.fillRect(0, 0, width, height);

            const scale = (v.scale as number) / 1000;
            const speed = (v.speed as number) * 60 * dt;
            if (v.evolve) z += dt * 0.08;

            const spectral = v.spectral as boolean;
            const buckets = Array.from({ length: spectral ? HUE_BUCKETS : 1 }, () => new Path2D());

            for (const p of particles) {
                const n = noise(p.x * scale, p.y * scale, z);
                let angle = n * Math.PI * 4;

                if (pointer.active) {
                    const dx = p.x - pointer.x;
                    const dy = p.y - pointer.y;
                    const d2 = dx * dx + dy * dy;
                    if (d2 < STIR_RADIUS * STIR_RADIUS) {
                        // Swirl around the pointer
                        angle = Math.atan2(dy, dx) + Math.PI / 2 + (1 - Math.sqrt(d2) / STIR_RADIUS) * 0.6;
                    }
                }

                p.px = p.x;
                p.py = p.y;
                p.x += Math.cos(angle) * speed;
                p.y += Math.sin(angle) * speed;
                p.life -= 1;

                if (p.life <= 0 || p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
                    spawn(p);
                    continue;
                }

                const bucket = spectral ? Math.min(HUE_BUCKETS - 1, Math.max(0, Math.floor(((n + 1) / 2) * HUE_BUCKETS))) : 0;
                buckets[bucket].moveTo(p.px, p.py);
                buckets[bucket].lineTo(p.x, p.y);
            }

            ctx.lineWidth = 1;
            ctx.lineCap = "round";
            buckets.forEach((path, i) => {
                // Spectral sweeps from signal orange round to violet
                ctx.strokeStyle = spectral ? `hsla(${(14 + i * (300 / HUE_BUCKETS)) % 360}, 85%, 62%, 0.55)` : "rgba(236, 235, 228, 0.42)";
                ctx.stroke(path);
            });

            report(() => ({ Particles: particles.length.toLocaleString(), Seed: seed }));
        },
        destroy: () => {
            canvas.removeEventListener("click", reseed);
            canvas.removeEventListener("pointermove", onMove);
            canvas.removeEventListener("pointerleave", onLeave);
        },
    };
};

export default function FlowField(props: SketchProps) {
    return <CanvasSketch create={createFlowField} className="cursor-crosshair" {...props} />;
}
