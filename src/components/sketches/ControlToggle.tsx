export default function ControlToggle({ label, value, onChange }: {
    label: string;
    value: boolean;
    onChange: (value: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between">
            <label className="text-sm text-[var(--color-text-secondary)]">{label}</label>
            <button
                onClick={() => onChange(!value)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors border ${
                    value 
                        ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] border-transparent' 
                        : 'bg-[var(--color-bg-elevated)] border-[var(--color-border)]'
                }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
            </button>
        </div>
    );
}
