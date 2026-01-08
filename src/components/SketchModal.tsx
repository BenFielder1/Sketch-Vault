"use client"
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { XMarkIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

import { ISketch } from "@/types/sketch";

export default function SketchModal({ sketch, onClose }: {
    sketch: ISketch;
    onClose: () => void;
}) {
    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const typeStyles: Record<string, { bg: string; text: string }> = {
        '3d': { bg: 'bg-[var(--color-primary)]/15', text: 'text-[var(--color-primary)]' },
        'generative': { bg: 'bg-[var(--color-accent)]/15', text: 'text-[var(--color-accent)]' },
        'interactive': { bg: 'bg-[var(--color-rose)]/15', text: 'text-[var(--color-rose)]' },
        '2d': { bg: 'bg-blue-500/15', text: 'text-blue-400' }
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--color-bg-primary)]/90 backdrop-blur-md animate-in-scale"
            onClick={onClose}
        >
            <div 
                className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 rounded-lg bg-[var(--color-bg-primary)]/80 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-primary)] backdrop-blur-sm transition-all duration-200"
                    aria-label="Close modal"
                >
                    <XMarkIcon className="w-5 h-5" />
                </button>

                <div className="flex flex-col md:flex-row max-h-[90vh] overflow-y-auto md:overflow-hidden">
                    {/* Image Section */}
                    <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto md:min-h-[500px] flex-shrink-0">
                        <Image
                            src={sketch.thumbnail}
                            alt={sketch.title}
                            fill
                            className="object-cover"
                        />
                        
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[var(--color-bg-secondary)] via-transparent to-transparent" />
                        
                        {/* Play indicator */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full bg-[var(--color-bg-primary)]/80 backdrop-blur-sm flex items-center justify-center border border-[var(--color-border)] group-hover:scale-110 transition-transform">
                                <svg 
                                    className="w-8 h-8 text-[var(--color-primary)] ml-1" 
                                    viewBox="0 0 24 24" 
                                    fill="currentColor"
                                >
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="w-full md:w-1/2 p-8 flex flex-col">
                        {/* Type badges */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {sketch.types.map((type) => {
                                const style = typeStyles[type] || { bg: 'bg-gray-500/15', text: 'text-gray-400' };
                                return (
                                    <span
                                        key={type}
                                        className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${style.bg} ${style.text}`}
                                    >
                                        {type}
                                    </span>
                                );
                            })}
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-4">
                            {sketch.title}
                        </h2>
                        
                        {/* Description */}
                        <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6">
                            {sketch.description}
                        </p>

                        {/* Tags */}
                        <div className="mb-8">
                            <h4 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
                                Technologies
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {sketch.tags.map((tag) => (
                                    <span 
                                        key={tag} 
                                        className="px-3 py-1.5 text-sm text-[var(--color-text-secondary)] bg-[var(--color-bg-elevated)] rounded-lg border border-[var(--color-border)]"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-[var(--color-border)]">
                            <Link
                                href={sketch.link}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-[var(--color-bg-primary)] rounded-xl font-semibold hover:bg-[var(--color-primary-light)] transition-colors duration-200"
                            >
                                Launch Sketch
                                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                            </Link>
                            <button
                                onClick={onClose}
                                className="flex-1 px-6 py-3 bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] rounded-xl font-medium border border-[var(--color-border)] hover:bg-[var(--color-bg-tertiary)] transition-colors duration-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
