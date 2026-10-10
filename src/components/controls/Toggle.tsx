export default function Toggle({ label, value, onChange }: {
    label: string;
    value: boolean;
    onChange: (value: boolean) => void;
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={value}
            onClick={() => onChange(!value)}
            className="group flex w-full items-center justify-between gap-4 py-1 text-left"
        >
            <span className="text-sm text-ink-soft group-hover:text-ink">{label}</span>
            <span className="flex items-center gap-2">
                <span className="w-6 text-right font-mono text-[10px] uppercase tracking-wider text-muted">{value ? "On" : "Off"}</span>
                <span className={`relative h-3.5 w-7 border transition-colors ${value ? "border-signal bg-signal-soft" : "border-rule-strong"}`}>
                    <span
                        className={`absolute top-[2px] h-2 w-2 transition-all ${value ? "left-[15px] bg-signal" : "left-[2px] bg-muted"}`}
                    />
                </span>
            </span>
        </button>
    );
}
