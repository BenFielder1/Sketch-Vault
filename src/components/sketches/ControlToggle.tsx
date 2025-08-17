export default function ControlToggle({ label, value, onChange }: {
    label: string;
    value: boolean;
    onChange: (value: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between">
            <label className="text-gray-300 text-sm font-medium">{label}</label>
            <button
                onClick={() => onChange(!value)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-gradient-to-r from-purple-500 to-cyan-500' : 'bg-white/20'}`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`}
                />
            </button>
        </div>
    );
}