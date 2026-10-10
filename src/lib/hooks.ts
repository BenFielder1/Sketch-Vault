"use client";
import { useEffect, useLayoutEffect, useRef } from "react";

/** Keeps a ref pointed at the latest value, so long-running loops never read stale props. */
export function useLatest<T>(value: T) {
    const ref = useRef(value);
    useLayoutEffect(() => {
        ref.current = value;
    });
    return ref;
}

/**
 * Runs `frame` on every animation frame while `playing` is true.
 * `dt` is seconds since the previous frame, clamped so a backgrounded tab doesn't jump.
 */
export function useFrameLoop(frame: (dt: number) => void, playing: boolean) {
    const frameRef = useLatest(frame);

    useEffect(() => {
        if (!playing) return;
        let id = 0;
        let last = performance.now();
        const loop = (now: number) => {
            const dt = Math.min((now - last) / 1000, 1 / 20);
            last = now;
            frameRef.current(dt);
            id = requestAnimationFrame(loop);
        };
        id = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(id);
    }, [playing, frameRef]);
}

export interface CanvasSize {
    width: number;
    height: number;
    dpr: number;
}

/** Calls `effect` whenever `signal` changes, skipping the initial mount. */
export function useSignal(signal: number, effect: () => void) {
    const effectRef = useLatest(effect);
    const previous = useRef(signal);
    useEffect(() => {
        if (previous.current === signal) return;
        previous.current = signal;
        effectRef.current();
    }, [signal, effectRef]);
}

/** True when the user has asked the OS for reduced motion. Read once; cheap enough to call in effects. */
export const prefersReducedMotion = () =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
