import Link from "next/link";
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function SketchHeader({ title }: { title: string }) {
    return (
        <header className="relative z-20 px-6 py-4 bg-[var(--color-bg-secondary)]/90 backdrop-blur-md border-b border-[var(--color-border)]">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link 
                    href="/gallery" 
                    className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors group"
                >
                    <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Back to Gallery</span>
                </Link>

                <h1 className="text-lg font-bold text-[var(--color-text-primary)]">{title}</h1>
                
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="relative w-8 h-8 flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-lg opacity-90" />
                        <svg 
                            className="relative w-4 h-4 text-[var(--color-bg-primary)]" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2.5"
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        >
                            <polygon points="12 2 2 7 12 12 22 7 12 2" />
                            <polyline points="2 17 12 22 22 17" />
                            <polyline points="2 12 12 17 22 12" />
                        </svg>
                    </div>
                </Link>
            </div>
        </header>
    );
}
