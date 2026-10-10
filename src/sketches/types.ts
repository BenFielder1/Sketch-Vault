import { ControlValues } from "@/types/sketch";

export type Readouts = Record<string, string | number>;

export interface SketchProps {
    values: ControlValues;
    playing: boolean;
    /** Increments each time the viewer asks the sketch to reset */
    resetSignal: number;
    /** The most recent one-off action requested by the viewer */
    action: { id: string; n: number } | null;
    /** Live figures shown in the stage HUD. Call sparingly (a few times a second). */
    onReadouts: (readouts: Readouts) => void;
}

/** Throttles readout updates so sketches can report every frame without re-rendering the viewer every frame. */
export function createReadoutThrottle(intervalMs = 250) {
    let last = 0;
    return (report: () => void) => {
        const now = performance.now();
        if (now - last < intervalMs) return;
        last = now;
        report();
    };
}

/** Shared stage palette — the viewer is always a dark room */
export const STAGE = {
    bg: "#0b0b0a",
    bgRgb: "11, 11, 10",
    ink: "#ecebe4",
    dim: "#3a3935",
    faint: "#1c1c1a",
    signal: "#ff5a24",
};
