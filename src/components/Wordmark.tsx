import Link from "next/link";

/** The vault-door mark: a ring, four bolts and a signal-coloured centre */
export function VaultMark({ className = "h-7 w-7" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect width="32" height="32" className="fill-ink" />
            <circle cx="16" cy="16" r="9" className="stroke-paper" strokeWidth="2" />
            <circle cx="16" cy="16" r="3" className="fill-signal" />
            <path d="M16 7v4M16 21v4M7 16h4M21 16h4" className="stroke-paper" strokeWidth="2" />
        </svg>
    );
}

export default function Wordmark() {
    return (
        <Link href="/" className="group inline-flex items-center gap-2.5" aria-label="SketchVault home">
            <VaultMark className="h-7 w-7 transition-transform duration-500 group-hover:rotate-90" />
            <span className="font-serif text-[1.45rem] leading-none tracking-tight">
                Sketch<span className="italic">Vault</span>
            </span>
        </Link>
    );
}
