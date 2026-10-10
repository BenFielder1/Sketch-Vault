export default function Kbd({ children }: { children: React.ReactNode }) {
    return (
        <kbd className="inline-flex h-5 min-w-5 items-center justify-center border border-rule-strong px-1 font-mono text-[10px] uppercase leading-none text-ink-soft">
            {children}
        </kbd>
    );
}
