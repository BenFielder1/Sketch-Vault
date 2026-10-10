"use client";
import { ComponentType, useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeftIcon,
    ArrowsPointingInIcon,
    ArrowsPointingOutIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    PauseIcon,
    PlayIcon,
    AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";

import { ControlValues, ISketch } from "@/types/sketch";
import { catalogueNumber, defaultValues, getSketch, neighbours, sketchHref, sketchTypeLabels } from "@/data/sketches";
import { Readouts, SketchProps } from "@/sketches/types";
import Slider from "@/components/controls/Slider";
import Toggle from "@/components/controls/Toggle";
import Kbd from "@/components/controls/Kbd";
import ActionButton from "@/components/controls/ActionButton";

function StageLoading() {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <span className="label">
                Loading<span className="animate-blink">_</span>
            </span>
        </div>
    );
}

const pieces: Record<string, ComponentType<SketchProps>> = {
    planets: dynamic(() => import("@/sketches/Planets"), { ssr: false, loading: StageLoading }),
    snake: dynamic(() => import("@/sketches/Snake"), { ssr: false, loading: StageLoading }),
    "flow-field": dynamic(() => import("@/sketches/FlowField"), { ssr: false, loading: StageLoading }),
    life: dynamic(() => import("@/sketches/Life"), { ssr: false, loading: StageLoading }),
    boids: dynamic(() => import("@/sketches/Boids"), { ssr: false, loading: StageLoading }),
};

const noopSubscribe = () => () => {};
const subscribeFullscreen = (callback: () => void) => {
    document.addEventListener("fullscreenchange", callback);
    return () => document.removeEventListener("fullscreenchange", callback);
};

const isTyping = (target: EventTarget | null) =>
    target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

export default function SketchViewer({ slug }: { slug: string }) {
    const sketch = getSketch(slug) as ISketch;
    const Piece = pieces[slug];
    const { prev, next } = neighbours(sketch);
    const router = useRouter();

    const rootRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);

    const [values, setValues] = useState<ControlValues>(() => defaultValues(sketch));
    const [playing, setPlaying] = useState(true);
    const [resetSignal, setResetSignal] = useState(0);
    const [action, setAction] = useState<SketchProps["action"]>(null);
    const [readouts, setReadouts] = useState<Readouts>({});
    const [panelCollapsed, setPanelCollapsed] = useState(false);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [flash, setFlash] = useState<string | null>(null);

    // ?embed renders the bare stage, for thumbnails and iframes
    const embed = useSyncExternalStore(noopSubscribe, () => new URLSearchParams(window.location.search).has("embed"), () => false);
    const fullscreen = useSyncExternalStore(subscribeFullscreen, () => document.fullscreenElement !== null, () => false);

    const notify = useCallback((message: string) => {
        setFlash(message);
        window.setTimeout(() => setFlash(current => (current === message ? null : current)), 1400);
    }, []);

    const reset = useCallback(() => {
        setResetSignal(n => n + 1);
        notify(sketch.resetLabel);
    }, [notify, sketch.resetLabel]);

    const runAction = useCallback((id: string, label: string) => {
        setAction(a => ({ id, n: (a?.n ?? 0) + 1 }));
        notify(label);
    }, [notify]);

    const togglePanel = useCallback(() => {
        if (window.matchMedia("(min-width: 1024px)").matches) setPanelCollapsed(c => !c);
        else setSheetOpen(o => !o);
    }, []);

    const toggleFullscreen = useCallback(() => {
        if (document.fullscreenElement) document.exitFullscreen();
        else rootRef.current?.requestFullscreen?.();
    }, []);

    const savePng = useCallback(() => {
        const canvas = stageRef.current?.querySelector("canvas");
        if (!canvas) return;
        canvas.toBlob(blob => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.download = `sketchvault-${String(sketch.id).padStart(3, "0")}-${sketch.slug}-${Date.now()}.png`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
        });
        notify("Saved PNG");
    }, [notify, sketch.id, sketch.slug]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return;
            const key = e.key.toLowerCase();

            if (key === " ") {
                // Let focused buttons and switches handle their own space press
                if (e.target instanceof HTMLButtonElement) return;
                e.preventDefault();
                setPlaying(p => !p);
            } else if (key === "r") reset();
            else if (key === "s") savePng();
            else if (key === "p") togglePanel();
            else if (key === "f") toggleFullscreen();
            else if (key === "arrowleft" && !(e.target instanceof HTMLInputElement)) router.push(sketchHref(prev));
            else if (key === "arrowright" && !(e.target instanceof HTMLInputElement)) router.push(sketchHref(next));
            else {
                const match = sketch.actions?.find(a => a.shortcut?.toLowerCase() === key);
                if (match) runAction(match.id, match.label);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [reset, savePng, togglePanel, toggleFullscreen, runAction, router, prev, next, sketch.actions]);

    const stage = (
        <div ref={stageRef} className="absolute inset-0 overflow-hidden">
            <Piece values={values} playing={playing} resetSignal={resetSignal} action={action} onReadouts={setReadouts} />
        </div>
    );

    if (embed) {
        return (
            <div data-theme="dark" className="fixed inset-0 bg-stage">
                {stage}
            </div>
        );
    }

    const iconButton = "inline-flex h-8 w-8 items-center justify-center text-ink-soft transition-colors hover:bg-surface hover:text-ink";

    return (
        <div ref={rootRef} data-theme="dark" className="fixed inset-0 flex flex-col bg-paper text-ink">
            {/* Top bar */}
            <header className="rule-b flex h-12 shrink-0 items-center gap-3 px-3 sm:px-4">
                <Link href="/gallery" className="group label inline-flex items-center gap-1.5 hover:text-ink">
                    <ArrowLeftIcon className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                    <span className="hidden sm:inline">Index</span>
                </Link>
                <span className="h-4 w-px bg-rule" />
                <div className="flex min-w-0 items-baseline gap-3">
                    <span className="label hidden text-signal sm:inline">{catalogueNumber(sketch.id)}</span>
                    <h1 className="truncate font-serif text-xl leading-none">{sketch.title}</h1>
                </div>

                <nav className="ml-auto flex items-center" aria-label="Sketch controls">
                    <Link href={sketchHref(prev)} className={iconButton} aria-label={`Previous: ${prev.title}`} title={`Previous: ${prev.title}  ←`}>
                        <ChevronLeftIcon className="h-4 w-4" />
                    </Link>
                    <Link href={sketchHref(next)} className={iconButton} aria-label={`Next: ${next.title}`} title={`Next: ${next.title}  →`}>
                        <ChevronRightIcon className="h-4 w-4" />
                    </Link>
                    <span className="mx-1 h-4 w-px bg-rule" />
                    <button onClick={toggleFullscreen} className={`${iconButton.replace("inline-flex", "hidden sm:inline-flex")}`} aria-label="Toggle fullscreen" title="Fullscreen  F">
                        {fullscreen ? <ArrowsPointingInIcon className="h-4 w-4" /> : <ArrowsPointingOutIcon className="h-4 w-4" />}
                    </button>
                    <button
                        onClick={togglePanel}
                        className={`${iconButton} ${!panelCollapsed ? "lg:text-signal" : ""} ${sheetOpen ? "text-signal" : ""}`}
                        aria-label="Toggle controls panel"
                        title="Controls  P"
                    >
                        <AdjustmentsHorizontalIcon className="h-4 w-4" />
                    </button>
                </nav>
            </header>

            <div className="flex min-h-0 flex-1">
                {/* Stage */}
                <main className="relative min-w-0 flex-1 bg-stage">
                    {stage}

                    {/* HUD: live readouts */}
                    <div className="pointer-events-none absolute bottom-3 left-3 flex flex-wrap gap-px sm:bottom-4 sm:left-4">
                        {Object.entries(readouts).map(([label, value]) => (
                            <div key={label} className="bg-paper/85 px-2.5 py-1.5 backdrop-blur-sm">
                                <div className="label text-[10px]! leading-3!">{label}</div>
                                <div className="font-mono text-sm tabular-nums text-ink">{value}</div>
                            </div>
                        ))}
                    </div>

                    {!playing && (
                        <div className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 bg-signal px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-on-signal">
                            Paused
                        </div>
                    )}

                    {flash && (
                        <div className="pointer-events-none absolute top-3 right-3 bg-paper/90 px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-ink backdrop-blur-sm">
                            {flash}
                        </div>
                    )}

                    <button
                        onClick={() => setPlaying(p => !p)}
                        className="absolute right-3 bottom-3 inline-flex h-11 w-11 items-center justify-center bg-ink text-paper transition-colors hover:bg-signal hover:text-on-signal sm:right-4 sm:bottom-4"
                        aria-label={playing ? "Pause" : "Play"}
                        title={`${playing ? "Pause" : "Play"}  Space`}
                    >
                        {playing ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
                    </button>
                </main>

                {/* Mobile scrim */}
                {sheetOpen && <button className="fixed inset-0 z-20 bg-black/40 lg:hidden" aria-label="Close controls" onClick={() => setSheetOpen(false)} />}

                {/* Panel: right column on desktop, bottom sheet on mobile */}
                <aside
                    className={`${sheetOpen ? "flex" : "hidden"} ${panelCollapsed ? "lg:hidden" : "lg:flex"} scrollbar-thin fixed inset-x-0 bottom-0 z-30 max-h-[72dvh] flex-col overflow-y-auto border-t border-rule bg-paper lg:static lg:z-auto lg:max-h-none lg:w-[340px] lg:shrink-0 lg:border-t-0 lg:border-l`}
                    aria-label="Sketch details and controls"
                >
                    <div className="mx-auto mt-2 h-1 w-10 bg-rule-strong lg:hidden" />

                    <section className="rule-b p-5">
                        <div className="label mb-3 flex items-center justify-between">
                            <span>About</span>
                            <span>{catalogueNumber(sketch.id)}</span>
                        </div>
                        <p className="text-sm leading-relaxed text-ink-soft">{sketch.description}</p>
                        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-sm">
                            <dt className="label leading-5">Medium</dt>
                            <dd>{sketch.medium}</dd>
                            <dt className="label leading-5">Year</dt>
                            <dd className="font-mono tabular-nums">{sketch.year}</dd>
                            <dt className="label leading-5">Type</dt>
                            <dd>{sketch.types.map(t => sketchTypeLabels[t]).join(", ")}</dd>
                        </dl>
                        <ul className="mt-4 space-y-1">
                            {sketch.interactions.map(line => (
                                <li key={line} className="flex gap-2 text-sm text-ink-soft">
                                    <span className="text-signal">→</span>
                                    {line}
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="rule-b p-5">
                        <div className="label mb-4 flex items-center justify-between">
                            <span>Parameters</span>
                            <button onClick={() => setValues(defaultValues(sketch))} className="label underline-offset-2 hover:text-ink hover:underline">
                                Defaults
                            </button>
                        </div>
                        <div className="space-y-4">
                            {sketch.controls.filter(c => c.kind === "slider").map(c => (
                                <Slider
                                    key={c.key}
                                    label={c.label}
                                    min={c.min}
                                    max={c.max}
                                    step={c.step}
                                    unit={c.unit}
                                    value={values[c.key] as number}
                                    onChange={value => setValues(v => ({ ...v, [c.key]: value }))}
                                />
                            ))}
                        </div>
                        <div className="mt-5 space-y-1.5">
                            {sketch.controls.filter(c => c.kind === "toggle").map(c => (
                                <Toggle
                                    key={c.key}
                                    label={c.label}
                                    value={values[c.key] as boolean}
                                    onChange={value => setValues(v => ({ ...v, [c.key]: value }))}
                                />
                            ))}
                        </div>
                    </section>

                    <section className="p-5">
                        <div className="label mb-3">Actions</div>
                        <div className="grid gap-px border border-rule bg-rule">
                            <ActionButton label={playing ? "Pause" : "Play"} shortcut="Space" onClick={() => setPlaying(p => !p)} />
                            <ActionButton label={sketch.resetLabel} shortcut="R" onClick={reset} />
                            {sketch.actions?.map(a => (
                                <ActionButton key={a.id} label={a.label} shortcut={a.shortcut} onClick={() => runAction(a.id, a.label)} />
                            ))}
                            <ActionButton label="Save PNG" shortcut="S" onClick={savePng} />
                        </div>
                        <div className="mt-5 hidden flex-wrap gap-x-4 gap-y-2 text-xs text-muted lg:flex">
                            <span className="flex items-center gap-1.5"><Kbd>P</Kbd> Panel</span>
                            <span className="flex items-center gap-1.5"><Kbd>F</Kbd> Fullscreen</span>
                            <span className="flex items-center gap-1.5"><Kbd>←</Kbd><Kbd>→</Kbd> Browse</span>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
}
