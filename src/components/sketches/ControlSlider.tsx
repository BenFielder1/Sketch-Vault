export default function ControlSlider({ label, value, min, max, step, onChange }: {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (value: number) => void;
}) {
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-[var(--color-text-secondary)]">
                    {label}
                </label>
                <span className="text-sm font-mono text-[var(--color-text-muted)] bg-[var(--color-bg-elevated)] px-2 py-0.5 rounded">
                    {value.toFixed(1)}
                </span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-[var(--color-bg-elevated)] rounded-lg appearance-none cursor-pointer slider"
            />
        </div>
    );
}
