"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, PauseIcon, PlayIcon } from "@heroicons/react/24/outline";

import { ControlValues, ISliderControl, IToggleControl } from "@/types/sketch";
import { STAGE } from "@/sketches/types";
import CanvasSketch, { EngineFactory, localPoint } from "@/sketches/CanvasSketch";
import Slider from "@/components/controls/Slider";
import Toggle from "@/components/controls/Toggle";
import ActionButton from "@/components/controls/ActionButton";

type GeneratorId = "particles" | "waves" | "tree" | "pen";

interface Generator {
    id: GeneratorId;
    name: string;
    blurb: string;
    controls: (ISliderControl | IToggleControl)[];
}

const slider = (key: string, label: string, min: number, max: number, step: number, value: number, unit?: string): ISliderControl =>
    ({ kind: "slider", key, label, min, max, step, default: value, unit });

const generators: Generator[] = [
    {
        id: "particles",
        name: "Orbits",
        blurb: "Particles on interlocking Lissajous paths",
        controls: [slider("count", "Particles", 20, 600, 10, 220), slider("speed", "Speed", 0.1, 4, 0.1, 1, "×"), slider("size", "Size", 0.5, 8, 0.5, 2, "px"), slider("trail", "Trail", 0, 100, 1, 90, "%")],
    },
    {
        id: "waves",
        name: "Harmonics",
        blurb: "Stacked sine waves and their overtones",
        controls: [slider("frequency", "Frequency", 0.2, 5, 0.1, 1.2), slider("amplitude", "Amplitude", 10, 240, 1, 90, "px"), slider("harmonics", "Harmonics", 1, 10, 1, 4), slider("lines", "Lines", 1, 24, 1, 9), slider("trail", "Trail", 0, 100, 1, 70, "%")],
    },
    {
        id: "tree",
        name: "Branches",
        blurb: "A recursive tree swaying in a slow wind",
        controls: [slider("depth", "Depth", 3, 11, 1, 8), slider("angle", "Spread", 0.1, 1.4, 0.01, 0.42), slider("ratio", "Length ratio", 0.55, 0.85, 0.01, 0.74), slider("branches", "Branches", 2, 4, 1, 2), slider("trail", "Trail", 0, 100, 1, 40, "%")],
    },
    {
        id: "pen",
        name: "Mirror pen",
        blurb: "Draw with the pointer and let symmetry do the rest",
        controls: [slider("width", "Brush", 0.5, 12, 0.5, 2, "px"), slider("trail", "Fade", 0, 100, 1, 100, "%"), { kind: "toggle", key: "pressure", label: "Taper with speed", default: true }],
    },
];

interface Palette {
    id: string;
    name: string;
    swatch: string[];
    color: (t: number, time: number) => string;
}

const palettes: Palette[] = [
    { id: "signal", name: "Signal", swatch: ["#ff5a24", "#ff8a5c"], color: (t) => `hsl(${14 + t * 14}, 100%, ${57 + t * 10}%)` },
    { id: "paper", name: "Paper", swatch: ["#ecebe4", "#8d8b84"], color: (t) => `hsl(45, 12%, ${92 - t * 40}%)` },
    { id: "spectrum", name: "Spectrum", swatch: ["#ff5a24", "#7c5cff", "#24d4ff"], color: (t, time) => `hsl(${(time * 30 + t * 300) % 360}, 85%, 62%)` },
    { id: "tide", name: "Tide", swatch: ["#24d4c4", "#2459ff"], color: (t) => `hsl(${172 + t * 55}, 80%, ${58 - t * 8}%)` },
    { id: "ember", name: "Ember", swatch: ["#ffd24a", "#d4202c"], color: (t) => `hsl(${48 - t * 46}, 95%, ${60 - t * 10}%)` },
];

const defaultsFor = (g: Generator): ControlValues => Object.fromEntries(g.controls.map(c => [c.key, c.default]));

interface StudioState {
    generatorId: GeneratorId;
    values: ControlValues;
    palette: Palette;
    symmetry: number;
    mirror: boolean;
}

const createStudio: EngineFactory<StudioState> = ({ canvas, ctx, size, values: state }) => {
    let time = 0;
    let pen: { x: number; y: number; w: number } | null = null;
    let lastGenerator = state().generatorId;

    const clear = () => {
        ctx.fillStyle = STAGE.bg;
        ctx.fillRect(0, 0, size.width, size.height);
    };

    /** Draws `paint` once per symmetry segment (and mirrored, if enabled) around the canvas centre */
    const withSymmetry = (paint: () => void) => {
        const { symmetry: n, mirror } = state();
        const cx = size.width / 2;
        const cy = size.height / 2;
        for (let k = 0; k < n; k++) {
            for (const flip of mirror ? [1, -1] : [1]) {
                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate((k / n) * Math.PI * 2);
                ctx.scale(flip, 1);
                ctx.translate(-cx, -cy);
                paint();
                ctx.restore();
            }
        }
    };

    const onDown = (e: PointerEvent) => {
        const { generatorId, values } = state();
        if (generatorId !== "pen") return;
        canvas.setPointerCapture(e.pointerId);
        pen = { ...localPoint(canvas, e), w: values.width as number };
    };

    const onMove = (e: PointerEvent) => {
        const { generatorId, values: v, palette } = state();
        if (generatorId !== "pen" || !pen) return;
        const { x, y } = localPoint(canvas, e);
        const last = pen;
        const base = v.width as number;
        // Faster strokes draw thinner, like a nib
        const w = v.pressure ? last.w * 0.7 + Math.max(base * 0.25, base * (1.6 - Math.hypot(x - last.x, y - last.y) / 30)) * 0.3 : base;
        const colorT = (Math.sin(time * 0.7) + 1) / 2;

        withSymmetry(() => {
            ctx.strokeStyle = palette.color(colorT, time);
            ctx.lineWidth = w;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(last.x, last.y);
            ctx.lineTo(x, y);
            ctx.stroke();
        });
        pen = { x, y, w };
    };

    const onUp = () => (pen = null);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    return {
        resize: clear,
        reset: clear,
        refresh: () => {
            // Each generator starts on a clean sheet
            if (state().generatorId === lastGenerator) return;
            lastGenerator = state().generatorId;
            clear();
        },
        frame: (dt) => {
            const { generatorId: id, values: v, palette: p, symmetry: n } = state();
            time += dt;
            const t = time;

            const trail = (v.trail as number) / 100;
            if (trail < 1) {
                ctx.fillStyle = `rgba(${STAGE.bgRgb}, ${0.01 + (1 - trail) ** 1.6 * 0.5})`;
                ctx.fillRect(0, 0, size.width, size.height);
            }
            if (id === "pen") return;
            const s = size;

            withSymmetry(() => {
                if (id === "particles") {
                    const count = v.count as number;
                    const speed = v.speed as number;
                    const r = v.size as number;
                    for (let i = 0; i < count; i++) {
                        const f = i / count;
                        const x = s.width / 2 + Math.sin(t * speed * 0.9 + i * 0.37) * (s.width * 0.18 + f * s.width * 0.14);
                        const y = s.height / 2 + Math.cos(t * speed * 0.63 + i * 0.21) * (s.height * 0.16 + f * s.height * 0.16);
                        ctx.fillStyle = p.color(f, t);
                        ctx.fillRect(x - r / 2, y - r / 2, r, r);
                    }
                } else if (id === "waves") {
                    const lines = v.lines as number;
                    ctx.lineWidth = 1.25;
                    for (let l = 0; l < lines; l++) {
                        const f = lines === 1 ? 0.5 : l / (lines - 1);
                        const baseline = n > 1 ? s.height / 2 : s.height * (0.2 + f * 0.6);
                        ctx.strokeStyle = p.color(f, t);
                        ctx.beginPath();
                        for (let x = 0; x <= s.width; x += 3) {
                            let y = baseline;
                            for (let h = 1; h <= (v.harmonics as number); h++) {
                                y += Math.sin((x * (v.frequency as number) * h) / 90 + t * (1 + l * 0.08) + l * 0.6) * ((v.amplitude as number) / h) * (0.4 + f * 0.6);
                            }
                            if (x === 0) ctx.moveTo(x, y);
                            else ctx.lineTo(x, y);
                        }
                        ctx.stroke();
                    }
                } else if (id === "tree") {
                    const depth = v.depth as number;
                    const spread = v.angle as number;
                    const ratio = v.ratio as number;
                    const branches = v.branches as number;
                    const fromCentre = n > 1;
                    const trunk = Math.min(s.width, s.height) * (fromCentre ? 0.11 : 0.2);
                    const grow = (x: number, y: number, angle: number, length: number, level: number) => {
                        const x2 = x + Math.cos(angle) * length;
                        const y2 = y + Math.sin(angle) * length;
                        ctx.strokeStyle = p.color(level / depth, t);
                        ctx.lineWidth = Math.max(0.6, (depth - level) * 0.7);
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        ctx.lineTo(x2, y2);
                        ctx.stroke();
                        if (level >= depth || length < 2) return;
                        for (let b = 0; b < branches; b++) {
                            const sway = Math.sin(t * 0.8 + level * 0.5 + b) * 0.08;
                            grow(x2, y2, angle + (b - (branches - 1) / 2) * spread + sway, length * ratio, level + 1);
                        }
                    };
                    grow(s.width / 2, fromCentre ? s.height / 2 : s.height - 24, -Math.PI / 2, trunk, 0);
                }
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

export default function Studio() {
    const stageRef = useRef<HTMLDivElement>(null);
    const [generatorId, setGeneratorId] = useState<GeneratorId>("particles");
    const generator = generators.find(g => g.id === generatorId)!;
    const [settings, setSettings] = useState<Record<GeneratorId, ControlValues>>(
        () => Object.fromEntries(generators.map(g => [g.id, defaultsFor(g)])) as Record<GeneratorId, ControlValues>,
    );
    const [paletteId, setPaletteId] = useState("signal");
    const [symmetry, setSymmetry] = useState(1);
    const [mirror, setMirror] = useState(false);
    const [playing, setPlaying] = useState(true);
    const [clearSignal, setClearSignal] = useState(0);

    const values = settings[generatorId];
    const palette = palettes.find(p => p.id === paletteId)!;
    const studioState = useMemo<StudioState>(
        () => ({ generatorId, values, palette, symmetry, mirror }),
        [generatorId, values, palette, symmetry, mirror],
    );

    const clear = useCallback(() => setClearSignal(n => n + 1), []);

    const savePng = useCallback(() => {
        stageRef.current?.querySelector("canvas")?.toBlob(blob => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.download = `sketchvault-studio-${Date.now()}.png`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
        });
    }, []);

    const setValue = (key: string, value: number | boolean) =>
        setSettings(all => ({ ...all, [generatorId]: { ...all[generatorId], [key]: value } }));

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            if (e.metaKey || e.ctrlKey || e.altKey || ["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName)) return;
            const key = e.key.toLowerCase();
            if (key === " " && !(target instanceof HTMLButtonElement)) {
                e.preventDefault();
                setPlaying(p => !p);
            } else if (key === "c") clear();
            else if (key === "s") savePng();
            else if (["1", "2", "3", "4"].includes(key)) setGeneratorId(generators[Number(key) - 1].id);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [clear, savePng]);

    return (
        <div data-theme="dark" className="fixed inset-0 flex flex-col bg-paper text-ink">
            <header className="rule-b flex h-12 shrink-0 items-center gap-3 px-3 sm:px-4">
                <Link href="/" className="group label inline-flex items-center gap-1.5 hover:text-ink">
                    <ArrowLeftIcon className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                    <span className="hidden sm:inline">SketchVault</span>
                </Link>
                <span className="h-4 w-px bg-rule" />
                <h1 className="font-serif text-xl leading-none">
                    The <em>Studio</em>
                </h1>
                <span className="label ml-auto hidden sm:inline">{generator.blurb}</span>
            </header>

            <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
                <main className="relative min-h-0 min-w-0 flex-1 bg-stage">
                    <div ref={stageRef} className="absolute inset-0">
                        <CanvasSketch
                            create={createStudio}
                            values={studioState}
                            playing={playing}
                            resetSignal={clearSignal}
                            className={generatorId === "pen" ? "cursor-crosshair" : ""}
                        />
                    </div>

                    {generatorId === "pen" && (
                        <p className="label pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 text-center">
                            Draw anywhere · raise symmetry for a kaleidoscope
                        </p>
                    )}

                    <button
                        onClick={() => setPlaying(p => !p)}
                        className="absolute right-3 bottom-3 inline-flex h-11 w-11 items-center justify-center bg-ink text-paper transition-colors hover:bg-signal hover:text-on-signal"
                        aria-label={playing ? "Pause" : "Play"}
                    >
                        {playing ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
                    </button>
                </main>

                <aside className="scrollbar-thin max-h-[46dvh] shrink-0 overflow-y-auto border-t border-rule lg:max-h-none lg:w-[340px] lg:border-t-0 lg:border-l" aria-label="Studio controls">
                    <section className="rule-b p-5">
                        <div className="label mb-3">Generator</div>
                        <div className="grid grid-cols-2 gap-px border border-rule bg-rule">
                            {generators.map((g, i) => (
                                <button
                                    key={g.id}
                                    onClick={() => setGeneratorId(g.id)}
                                    aria-pressed={g.id === generatorId}
                                    className={`flex items-baseline justify-between px-3 py-2.5 text-left text-sm transition-colors ${g.id === generatorId ? "bg-ink text-paper" : "bg-paper hover:bg-surface"}`}
                                >
                                    {g.name}
                                    <span className={`font-mono text-[10px] ${g.id === generatorId ? "text-signal" : "text-muted"}`}>{i + 1}</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="rule-b p-5">
                        <div className="label mb-3">Palette</div>
                        <div className="flex flex-wrap gap-2">
                            {palettes.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => setPaletteId(p.id)}
                                    aria-pressed={p.id === paletteId}
                                    title={p.name}
                                    className={`flex items-center gap-2 border px-2 py-1.5 text-xs transition-colors ${p.id === paletteId ? "border-ink" : "border-rule hover:border-rule-strong"}`}
                                >
                                    <span className="flex">
                                        {p.swatch.map(c => <span key={c} className="h-3 w-3" style={{ background: c }} />)}
                                    </span>
                                    {p.name}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="rule-b space-y-4 p-5">
                        <div className="label">Symmetry</div>
                        <Slider label="Segments" min={1} max={12} step={1} value={symmetry} onChange={setSymmetry} />
                        <Toggle label="Mirror each segment" value={mirror} onChange={setMirror} />
                    </section>

                    <section className="rule-b p-5">
                        <div className="label mb-4 flex justify-between">
                            <span>{generator.name}</span>
                            <button
                                onClick={() => setSettings(all => ({ ...all, [generatorId]: defaultsFor(generator) }))}
                                className="label hover:text-ink hover:underline"
                            >
                                Defaults
                            </button>
                        </div>
                        <div className="space-y-4">
                            {generator.controls.map(c =>
                                c.kind === "slider" ? (
                                    <Slider
                                        key={c.key}
                                        label={c.label}
                                        min={c.min}
                                        max={c.max}
                                        step={c.step}
                                        unit={c.unit}
                                        value={values[c.key] as number}
                                        onChange={value => setValue(c.key, value)}
                                    />
                                ) : (
                                    <Toggle
                                        key={c.key}
                                        label={c.label}
                                        value={values[c.key] as boolean}
                                        onChange={value => setValue(c.key, value)}
                                    />
                                ),
                            )}
                        </div>
                    </section>

                    <section className="p-5">
                        <div className="grid gap-px border border-rule bg-rule">
                            <ActionButton label={playing ? "Pause" : "Play"} shortcut="Space" onClick={() => setPlaying(p => !p)} />
                            <ActionButton label="Clear canvas" shortcut="C" onClick={clear} />
                            <ActionButton label="Save PNG" shortcut="S" onClick={savePng} />
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
}
