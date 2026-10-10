const decimalsFor = (step: number) => (Number.isInteger(step) ? 0 : (String(step).split(".")[1]?.length ?? 1));

export default function Slider({ label, value, min, max, step, unit, onChange }: {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    unit?: string;
    onChange: (value: number) => void;
}) {
    const fill = ((value - min) / (max - min)) * 100;

    return (
        <label className="block">
            <span className="flex items-baseline justify-between gap-4">
                <span className="text-sm text-ink-soft">{label}</span>
                <output className="font-mono text-xs tabular-nums text-ink">
                    {value.toFixed(decimalsFor(step))}
                    {unit && <span className="text-muted">{unit === "%" || unit === "×" ? unit : ` ${unit}`}</span>}
                </output>
            </span>
            <input
                type="range"
                className="range mt-1.5"
                min={min}
                max={max}
                step={step}
                value={value}
                style={{ "--fill": `${fill}%` } as React.CSSProperties}
                onChange={(e) => onChange(parseFloat(e.target.value))}
            />
        </label>
    );
}
