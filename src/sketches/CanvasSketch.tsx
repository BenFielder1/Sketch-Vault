"use client";
import { useEffect, useRef } from "react";

import { CanvasSize, useFrameLoop, useLatest, useSignal } from "@/lib/hooks";
import { createReadoutThrottle, Readouts } from "./types";

export interface EngineContext<V> {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    /** Live CSS-pixel size of the canvas; updated in place on resize */
    size: CanvasSize;
    values: () => V;
    /** Report HUD figures. The builder is only called a few times a second. */
    report: (build: () => Readouts) => void;
}

/**
 * A sketch's imperative core. Engines are plain closures with no React inside,
 * so simulation state can be mutated freely every frame.
 */
export interface Engine {
    frame: (dt: number) => void;
    resize?: () => void;
    reset?: () => void;
    action?: (id: string) => void;
    /** Values changed: redraw if the result should be visible while paused */
    refresh?: () => void;
    destroy?: () => void;
}

export type EngineFactory<V> = (context: EngineContext<V>) => Engine;

/**
 * Hosts a 2D canvas engine: sizes the canvas to its parent at device pixel ratio,
 * runs the frame loop while playing, and forwards resets, actions and value changes.
 */
export default function CanvasSketch<V>({ create, values, playing, resetSignal = 0, action = null, onReadouts, className = "" }: {
    create: EngineFactory<V>;
    values: V;
    playing: boolean;
    resetSignal?: number;
    action?: { id: string; n: number } | null;
    onReadouts?: (readouts: Readouts) => void;
    className?: string;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<Engine | null>(null);
    const valuesRef = useLatest(values);
    const onReadoutsRef = useLatest(onReadouts);

    useEffect(() => {
        const canvas = canvasRef.current;
        const parent = canvas?.parentElement;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !parent || !ctx) return;

        const size: CanvasSize = { width: 0, height: 0, dpr: 1 };
        const throttle = createReadoutThrottle();
        const fit = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const width = parent.clientWidth;
            const height = parent.clientHeight;
            if (width === 0 || height === 0) return false;
            if (width === size.width && height === size.height && dpr === size.dpr) return false;
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            Object.assign(size, { width, height, dpr });
            return true;
        };
        fit();

        const engine = create({
            canvas,
            ctx,
            size,
            values: () => valuesRef.current,
            report: build => throttle(() => onReadoutsRef.current?.(build())),
        });
        engineRef.current = engine;
        engine.resize?.();

        const observer = new ResizeObserver(() => {
            if (fit()) engine.resize?.();
        });
        observer.observe(parent);

        return () => {
            observer.disconnect();
            engine.destroy?.();
            engineRef.current = null;
        };
    }, [create, valuesRef, onReadoutsRef]);

    useFrameLoop(dt => engineRef.current?.frame(dt), playing);
    useSignal(resetSignal, () => engineRef.current?.reset?.());
    useSignal(action?.n ?? 0, () => action && engineRef.current?.action?.(action.id));
    useEffect(() => {
        engineRef.current?.refresh?.();
    }, [values]);

    return <canvas ref={canvasRef} className={`block touch-none ${className}`} />;
}

/** Converts a pointer event to canvas-local CSS pixels */
export const localPoint = (canvas: HTMLCanvasElement, e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
};
