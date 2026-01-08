import Image from "next/image";
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

import { ISketch } from "@/types/sketch";

export default function SketchCard({ sketch, onView, delay }: {
    sketch: ISketch;
    onView: () => void;
    delay: number;
}) {
    const typeStyles: Record<string, { bg: string; text: string }> = {
        '3d': { bg: 'bg-[var(--color-primary)]/15', text: 'text-[var(--color-primary)]' },
        'generative': { bg: 'bg-[var(--color-accent)]/15', text: 'text-[var(--color-accent)]' },
        'interactive': { bg: 'bg-[var(--color-rose)]/15', text: 'text-[var(--color-rose)]' },
        '2d': { bg: 'bg-blue-500/15', text: 'text-blue-400' }
    };

    return (
        <div
            className="animate-in group relative rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] overflow-hidden hover:border-[var(--color-border-hover)] transition-all duration-300 card-lift"
            style={{ animationDelay: `${delay}ms` }}
        >
            {/* Thumbnail */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                    src={sketch.thumbnail}
                    alt={sketch.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-secondary)] via-transparent to-transparent opacity-60" />
                
                {/* Type badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {sketch.types.map((type) => {
                        const style = typeStyles[type] || { bg: 'bg-gray-500/15', text: 'text-gray-400' };
                        return (
                            <span
                                key={type}
                                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${style.bg} ${style.text} backdrop-blur-sm`}
                            >
                                {type}
                            </span>
                        );
                    })}
                </div>

                {/* Quick view button */}
                <button 
                    onClick={onView}
                    className="absolute top-4 right-4 p-2 rounded-lg bg-[var(--color-bg-primary)]/80 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-primary)] backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200"
                    aria-label="Quick view"
                >
                    <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                </button>
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                    {sketch.title}
                </h3>
                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed line-clamp-2 mb-4">
                    {sketch.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                    {sketch.tags.slice(0, 3).map((tag) => (
                        <span 
                            key={tag} 
                            className="px-2 py-0.5 text-xs text-[var(--color-text-muted)] bg-[var(--color-bg-elevated)] rounded"
                        >
                            {tag}
                        </span>
                    ))}
                    {sketch.tags.length > 3 && (
                        <span className="px-2 py-0.5 text-xs text-[var(--color-text-muted)]">
                            +{sketch.tags.length - 3}
                        </span>
                    )}
                </div>

                {/* Action button */}
                <button
                    onClick={onView}
                    className="w-full py-3 rounded-xl bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] font-medium border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] transition-all duration-200"
                >
                    View Sketch
                </button>
            </div>
        </div>
    );
}
