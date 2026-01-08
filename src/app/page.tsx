"use client"
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

import Footer from '@/components/Footer';
import Header from '@/components/Header';

const HomePage = () => {
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Animate elements on mount
        const elements = document.querySelectorAll('.animate-in');
        elements.forEach((el) => {
            el.classList.add('opacity-100');
        });
    }, []);

    return (
        <>
            <div className="min-h-screen bg-[var(--color-bg-primary)] relative">
                <Header />
                
                {/* Background decorations */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    {/* Gradient orbs */}
                    <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[var(--color-primary)]/10 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 -right-32 w-80 h-80 bg-[var(--color-accent)]/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-[var(--color-rose)]/5 rounded-full blur-3xl" />
                    
                    {/* Grid pattern */}
                    <div className="absolute inset-0 grid-pattern opacity-30" />
                </div>

                {/* Hero Section */}
                <main ref={heroRef} className="relative z-10 pt-32 pb-20 px-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Hero Content */}
                        <div className="max-w-4xl">
                            {/* Badge */}
                            <div className="animate-in delay-1 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] mb-8">
                                <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
                                <span className="text-sm text-[var(--color-text-secondary)]">
                                    Interactive Art Gallery
                                </span>
                            </div>
                            
                            {/* Main Headline */}
                            <h1 className="animate-in delay-2 text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6">
                                <span className="text-[var(--color-text-primary)]">Where Code</span>
                                <br />
                                <span className="text-[var(--color-text-primary)]">Meets </span>
                                <span className="gradient-text">Canvas</span>
                            </h1>
                            
                            {/* Subtitle */}
                            <p className="animate-in delay-3 text-lg sm:text-xl text-[var(--color-text-secondary)] max-w-2xl mb-10 leading-relaxed">
                                Explore a curated collection of interactive digital art and generative sketches. 
                                Each piece is crafted with Three.js and p5.js, bringing algorithms to life.
                            </p>
                            
                            {/* CTAs */}
                            <div className="animate-in delay-4 flex flex-wrap gap-4">
                                <Link
                                    href="/gallery"
                                    className="group inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-[var(--color-bg-primary)] rounded-xl font-semibold hover:bg-[var(--color-primary-light)] transition-all duration-200 glow-amber"
                                >
                                    View Gallery
                                    <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    href="/live-sketch"
                                    className="group inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-xl font-semibold border border-[var(--color-border)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-elevated)] transition-all duration-200"
                                >
                                    Try Live Sketch
                                    <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
                                    </svg>
                                </Link>
                            </div>
                        </div>

                        {/* Bento Grid Features */}
                        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Feature 1 - Large */}
                            <div className="animate-in delay-4 lg:col-span-2 group relative p-8 rounded-3xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 transition-all duration-300 card-lift overflow-hidden">
                                {/* Background pattern */}
                                <div className="absolute inset-0 dot-pattern opacity-30" />
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-3xl" />
                                
                                <div className="relative">
                                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] mb-6">
                                        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                            <line x1="12" y1="22.08" x2="12" y2="12" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">
                                        3D Experiences
                                    </h3>
                                    <p className="text-[var(--color-text-secondary)] leading-relaxed max-w-lg">
                                        Immersive three-dimensional artworks powered by Three.js. Orbit, zoom, and interact 
                                        with geometric sculptures and animated scenes in real-time.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 2 */}
                            <div className="animate-in delay-5 group relative p-8 rounded-3xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-all duration-300 card-lift overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-accent)]/5 rounded-full blur-2xl" />
                                
                                <div className="relative">
                                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--color-accent)]/10 text-[var(--color-accent)] mb-6">
                                        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                                            <path d="M2 12h20" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">
                                        Generative Art
                                    </h3>
                                    <p className="text-[var(--color-text-secondary)] leading-relaxed text-sm">
                                        Algorithm-driven compositions that create unique patterns and forms through code.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 3 */}
                            <div className="animate-in delay-5 group relative p-8 rounded-3xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:border-[var(--color-rose)]/30 transition-all duration-300 card-lift overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-rose)]/5 rounded-full blur-2xl" />
                                
                                <div className="relative">
                                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--color-rose)]/10 text-[var(--color-rose)] mb-6">
                                        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 19l7-7 3 3-7 7-3-3z" />
                                            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                                            <path d="M2 2l7.586 7.586" />
                                            <circle cx="11" cy="11" r="2" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">
                                        Live Canvas
                                    </h3>
                                    <p className="text-[var(--color-text-secondary)] leading-relaxed text-sm">
                                        Create your own sketches in real-time with an interactive p5.js playground.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 4 - Stats/CTA Card */}
                            <div className="animate-in delay-6 lg:col-span-2 group relative p-8 rounded-3xl bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-accent)]/10 border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 transition-all duration-300 overflow-hidden">
                                <div className="absolute inset-0 grid-pattern opacity-20" />
                                
                                <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
                                            Ready to explore?
                                        </h3>
                                        <p className="text-[var(--color-text-secondary)]">
                                            Dive into the collection and discover interactive digital art.
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-center gap-4">
                                        <div className="text-center px-6 py-3 rounded-xl bg-[var(--color-bg-primary)]/50 border border-[var(--color-border)]">
                                            <div className="text-2xl font-bold text-[var(--color-primary)]">∞</div>
                                            <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">Possibilities</div>
                                        </div>
                                        <Link
                                            href="/gallery"
                                            className="inline-flex items-center gap-2 px-6 py-4 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] rounded-xl font-semibold border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-bg-secondary)] transition-all duration-200"
                                        >
                                            Enter Gallery
                                            <ArrowRightIcon className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
};

export default HomePage;
