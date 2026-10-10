"use client";
import { ControlValues } from "@/types/sketch";
import CanvasSketch, { EngineFactory, localPoint } from "./CanvasSketch";
import { SketchProps, STAGE } from "./types";

interface Boid {
    x: number;
    y: number;
    vx: number;
    vy: number;
}

const MAX_FORCE = 0.06;

const createBoids: EngineFactory<ControlValues> = ({ canvas, ctx, size, values, report }) => {
    let boids: Boid[] = [];
    const pointer = { x: 0, y: 0, active: false, down: false };

    const makeBoid = (): Boid => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 2;
        return {
            x: Math.random() * size.width,
            y: Math.random() * size.height,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
        };
    };

    const release = () => {
        boids = Array.from({ length: values().count as number }, makeBoid);
        ctx.fillStyle = STAGE.bg;
        ctx.fillRect(0, 0, size.width, size.height);
    };

    const track = (e: PointerEvent) => Object.assign(pointer, localPoint(canvas, e), { active: true });
    const onDown = (e: PointerEvent) => {
        track(e);
        pointer.down = true;
    };
    const onUp = () => (pointer.down = false);
    const onLeave = () => Object.assign(pointer, { active: false, down: false });
    canvas.addEventListener("pointermove", track);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointerleave", onLeave);

    return {
        resize: () => {
            if (boids.length === 0) release();
        },
        reset: release,
        frame: (dt) => {
            const { width, height } = size;
            const v = values();
            const target = v.count as number;
            while (boids.length < target) boids.push(makeBoid());
            if (boids.length > target) boids.length = target;

            const vision = v.vision as number;
            const vision2 = vision * vision;
            const separationDist2 = (vision * 0.45) ** 2;
            const maxSpeed = v.maxSpeed as number;
            const step = dt * 60;

            // Spatial hash: bucket boids into cells one vision-radius wide
            const cols = Math.max(1, Math.ceil(width / vision));
            const rows = Math.max(1, Math.ceil(height / vision));
            const grid: number[][] = Array.from({ length: cols * rows }, () => []);
            boids.forEach((b, i) => {
                const cx = Math.min(cols - 1, Math.max(0, Math.floor(b.x / vision)));
                const cy = Math.min(rows - 1, Math.max(0, Math.floor(b.y / vision)));
                grid[cy * cols + cx].push(i);
            });

            const limit = (x: number, y: number, max: number): [number, number] => {
                const m = Math.hypot(x, y);
                return m > max ? [(x / m) * max, (y / m) * max] : [x, y];
            };
            const steer = (x: number, y: number, b: Boid): [number, number] => {
                const m = Math.hypot(x, y) || 1;
                return limit((x / m) * maxSpeed - b.vx, (y / m) * maxSpeed - b.vy, MAX_FORCE);
            };

            const p = pointer;
            const accel: [number, number][] = [];

            for (const b of boids) {
                let ax = 0, ay = 0, sx = 0, sy = 0, cx = 0, cy = 0, n = 0, ns = 0;
                const gx = Math.floor(b.x / vision);
                const gy = Math.floor(b.y / vision);

                // Wrap neighbour cells so the flock is continuous across edges
                const cells: number[] = [];
                for (let oy = -1; oy <= 1; oy++) {
                    for (let ox = -1; ox <= 1; ox++) {
                        const cell = ((gy + oy + rows) % rows) * cols + ((gx + ox + cols) % cols);
                        if (!cells.includes(cell)) cells.push(cell);
                    }
                }

                for (const cell of cells) {
                    for (const j of grid[cell]) {
                        const o = boids[j];
                        if (o === b) continue;
                        let dx = o.x - b.x;
                        let dy = o.y - b.y;
                        if (dx > width / 2) dx -= width;
                        else if (dx < -width / 2) dx += width;
                        if (dy > height / 2) dy -= height;
                        else if (dy < -height / 2) dy += height;
                        const d2 = dx * dx + dy * dy;
                        if (d2 > vision2) continue;
                        ax += o.vx;
                        ay += o.vy;
                        cx += dx;
                        cy += dy;
                        n++;
                        if (d2 < separationDist2 && d2 > 0) {
                            sx -= dx / d2;
                            sy -= dy / d2;
                            ns++;
                        }
                    }
                }

                let fx = 0, fy = 0;
                if (n > 0) {
                    const [alx, aly] = steer(ax, ay, b);
                    const [cox, coy] = steer(cx, cy, b);
                    fx += alx * (v.alignment as number) + cox * (v.cohesion as number);
                    fy += aly * (v.alignment as number) + coy * (v.cohesion as number);
                }
                if (ns > 0) {
                    const [sex, sey] = steer(sx, sy, b);
                    fx += sex * (v.separation as number) * 1.4;
                    fy += sey * (v.separation as number) * 1.4;
                }

                if (v.pointer && p.active) {
                    const dx = p.x - b.x;
                    const dy = p.y - b.y;
                    const d = Math.hypot(dx, dy);
                    if (d < 160 && d > 0) {
                        const strength = (1 - d / 160) * 0.35 * (p.down ? 0.5 : -1);
                        fx += (dx / d) * strength;
                        fy += (dy / d) * strength;
                    }
                }
                accel.push([fx, fy]);
            }

            if (v.trails) {
                ctx.fillStyle = `rgba(${STAGE.bgRgb}, 0.16)`;
            } else {
                ctx.fillStyle = STAGE.bg;
            }
            ctx.fillRect(0, 0, width, height);

            const plain = new Path2D();
            const hot = new Path2D();

            boids.forEach((b, i) => {
                b.vx += accel[i][0] * step;
                b.vy += accel[i][1] * step;
                [b.vx, b.vy] = limit(b.vx, b.vy, maxSpeed);
                b.x = (b.x + b.vx * step + width) % width;
                b.y = (b.y + b.vy * step + height) % height;

                const angle = Math.atan2(b.vy, b.vx);
                const cos = Math.cos(angle);
                const sin = Math.sin(angle);
                const len = 7;
                const wing = 3;
                // Fast birds are drawn in signal orange
                const path = Math.hypot(b.vx, b.vy) > maxSpeed * 0.92 ? hot : plain;
                path.moveTo(b.x + cos * len, b.y + sin * len);
                path.lineTo(b.x - cos * len * 0.6 - sin * wing, b.y - sin * len * 0.6 + cos * wing);
                path.lineTo(b.x - cos * len * 0.3, b.y - sin * len * 0.3);
                path.lineTo(b.x - cos * len * 0.6 + sin * wing, b.y - sin * len * 0.6 - cos * wing);
                path.closePath();
            });

            ctx.fillStyle = STAGE.ink;
            ctx.fill(plain);
            ctx.fillStyle = STAGE.signal;
            ctx.fill(hot);

            if (v.pointer && p.active) {
                ctx.strokeStyle = p.down ? "rgba(255, 90, 36, 0.5)" : "rgba(236, 235, 228, 0.18)";
                ctx.setLineDash([3, 5]);
                ctx.beginPath();
                ctx.arc(p.x, p.y, 160, 0, Math.PI * 2);
                ctx.stroke();
                ctx.setLineDash([]);
            }

            report(() => {
                const avg = boids.reduce((sum, b) => sum + Math.hypot(b.vx, b.vy), 0) / Math.max(1, boids.length);
                return { Boids: boids.length, "Avg speed": avg.toFixed(2) };
            });
        },
        destroy: () => {
            canvas.removeEventListener("pointermove", track);
            canvas.removeEventListener("pointerdown", onDown);
            canvas.removeEventListener("pointerup", onUp);
            canvas.removeEventListener("pointerleave", onLeave);
        },
    };
};

export default function Boids(props: SketchProps) {
    return <CanvasSketch create={createBoids} className="cursor-crosshair" {...props} />;
}
