import Kbd from "./Kbd";

/** One row in a ruled list of actions, with its keyboard shortcut */
export default function ActionButton({ label, shortcut, onClick }: {
    label: string;
    shortcut?: string;
    onClick: () => void;
}) {
    return (
        <button onClick={onClick} className="flex items-center justify-between bg-paper px-3 py-2.5 text-left text-sm transition-colors hover:bg-surface">
            {label}
            {shortcut && <Kbd>{shortcut}</Kbd>}
        </button>
    );
}
