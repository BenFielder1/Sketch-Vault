"use client";
import { ControlValues } from "@/types/sketch";
import CanvasSketch, { EngineFactory, localPoint } from "./CanvasSketch";
import { SketchProps, STAGE } from "./types";

const AGE_STEPS = 48;

// Young cells are signal orange; they cool towards paper white as they age
const AGE_PALETTE = Array.from({ length: AGE_STEPS }, (_, i) => {
    const e = 1 - (1 - i / (AGE_STEPS - 1)) ** 3;
    const r = Math.round(255 + (236 - 255) * e);
    const g = Math.round(90 + (226 - 90) * e);
    const b = Math.round(36 + (212 - 36) * e);
    return `rgb(${r}, ${g}, ${b})`;
});

const createLife: EngineFactory<ControlValues> = ({ canvas, ctx, size, values, report }) => {
    let cols = 0;
    let rows = 0;
    let cellSize = 0;
    let cells = new Uint8Array(0);
    let next = new Uint8Array(0);
    let ages = new Uint16Array(0);
    let generation = 0;
    let accumulator = 0;
    let painting: -1 | 0 | 1 = -1;
    let lastDisplay = "";

    const offset = () => ({
        ox: Math.floor((size.width - cols * cellSize) / 2),
        oy: Math.floor((size.height - rows * cellSize) / 2),
    });

    const draw = () => {
        const v = values();
        ctx.fillStyle = STAGE.bg;
        ctx.fillRect(0, 0, size.width, size.height);

        // Centre the board in any leftover space
        const { ox, oy } = offset();
        const gap = cellSize >= 6 ? 1 : 0;

        if (v.grid && cellSize >= 5) {
            ctx.strokeStyle = STAGE.faint;
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (let x = 0; x <= cols; x++) {
                ctx.moveTo(ox + x * cellSize + 0.5, oy);
                ctx.lineTo(ox + x * cellSize + 0.5, oy + rows * cellSize);
            }
            for (let y = 0; y <= rows; y++) {
                ctx.moveTo(ox, oy + y * cellSize + 0.5);
                ctx.lineTo(ox + cols * cellSize, oy + y * cellSize + 0.5);
            }
            ctx.stroke();
        }

        const byAge = v.age as boolean;
        ctx.fillStyle = STAGE.ink;
        let current = "";
        for (let i = 0; i < cells.length; i++) {
            if (!cells[i]) continue;
            if (byAge) {
                const color = AGE_PALETTE[Math.min(Math.max(ages[i], 1), AGE_STEPS) - 1];
                if (color !== current) {
                    ctx.fillStyle = color;
                    current = color;
                }
            }
            const x = i % cols;
            const y = (i - x) / cols;
            ctx.fillRect(ox + x * cellSize + gap, oy + y * cellSize + gap, cellSize - gap, cellSize - gap);
        }
    };

    const randomise = () => {
        const density = (values().density as number) / 100;
        for (let i = 0; i < cells.length; i++) {
            cells[i] = Math.random() < density ? 1 : 0;
            ages[i] = cells[i];
        }
        generation = 0;
        draw();
    };

    /** Resizes the board to the canvas, keeping overlapping cells unless the cell size changed */
    const rebuild = () => {
        const cell = values().cell as number;
        const newCols = Math.max(1, Math.floor(size.width / cell));
        const newRows = Math.max(1, Math.floor(size.height / cell));
        const keep = cell === cellSize && cols > 0;
        const fresh = new Uint8Array(newCols * newRows);
        const freshAges = new Uint16Array(newCols * newRows);
        if (keep) {
            for (let y = 0; y < Math.min(rows, newRows); y++) {
                for (let x = 0; x < Math.min(cols, newCols); x++) {
                    fresh[y * newCols + x] = cells[y * cols + x];
                    freshAges[y * newCols + x] = ages[y * cols + x];
                }
            }
        }
        [cols, rows, cellSize, cells, ages, next] = [newCols, newRows, cell, fresh, freshAges, new Uint8Array(newCols * newRows)];
        if (keep) draw();
        else randomise();
    };

    const step = () => {
        const wrap = values().wrap as boolean;
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                let n = 0;
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        if (dx === 0 && dy === 0) continue;
                        let nx = x + dx;
                        let ny = y + dy;
                        if (wrap) {
                            nx = (nx + cols) % cols;
                            ny = (ny + rows) % rows;
                        } else if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) {
                            continue;
                        }
                        n += cells[ny * cols + nx];
                    }
                }
                const i = y * cols + x;
                const alive = cells[i] === 1 ? n === 2 || n === 3 : n === 3;
                next[i] = alive ? 1 : 0;
                ages[i] = alive ? Math.min(ages[i] + 1, 65535) : 0;
            }
        }
        [cells, next] = [next, cells];
        generation++;
    };

    const paint = (e: PointerEvent, start: boolean) => {
        const { x: px, y: py } = localPoint(canvas, e);
        const { ox, oy } = offset();
        const x = Math.floor((px - ox) / cellSize);
        const y = Math.floor((py - oy) / cellSize);
        if (x < 0 || y < 0 || x >= cols || y >= rows) return;
        const i = y * cols + x;
        // The first cell touched decides whether this stroke draws or erases
        if (start) painting = cells[i] ? 0 : 1;
        if (painting < 0) return;
        cells[i] = painting;
        ages[i] = painting;
        draw();
    };

    const onDown = (e: PointerEvent) => {
        canvas.setPointerCapture(e.pointerId);
        paint(e, true);
    };
    const onMove = (e: PointerEvent) => paint(e, false);
    const onUp = () => (painting = -1);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    return {
        resize: rebuild,
        reset: randomise,
        action: (id) => {
            if (id !== "clear") return;
            cells.fill(0);
            ages.fill(0);
            generation = 0;
            draw();
        },
        refresh: () => {
            const v = values();
            if (v.cell !== cellSize) rebuild();
            // Show display changes immediately, even while paused
            const display = `${v.age}${v.grid}`;
            if (display !== lastDisplay) {
                lastDisplay = display;
                draw();
            }
        },
        frame: (dt) => {
            accumulator += dt;
            const interval = 1 / (values().rate as number);
            let steps = 0;
            while (accumulator >= interval && steps < 4) {
                step();
                accumulator -= interval;
                steps++;
            }
            if (steps === 4) accumulator = 0;
            draw();

            report(() => {
                let population = 0;
                for (let i = 0; i < cells.length; i++) population += cells[i];
                return { Generation: generation.toLocaleString(), Population: population.toLocaleString() };
            });
        },
        destroy: () => {
            canvas.removeEventListener("pointerdown", onDown);
            canvas.removeEventListener("pointermove", onMove);
            canvas.removeEventListener("pointerup", onUp);
            canvas.removeEventListener("pointercancel", onUp);
        },
    };
};

export default function Life(props: SketchProps) {
    return <CanvasSketch create={createLife} className="cursor-cell" {...props} />;
}
