"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    // Track scroll position
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/gallery", label: "Gallery" },
        { href: "/live-sketch", label: "Live Sketch" },
    ];

    return (
        <header 
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled 
                    ? 'bg-[var(--color-bg-primary)]/90 backdrop-blur-md border-b border-[var(--color-border)]' 
                    : 'bg-transparent'
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-10 h-10 flex items-center justify-center">
                            {/* Logo mark */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-xl opacity-90 group-hover:opacity-100 transition-opacity" />
                            <svg 
                                className="relative w-5 h-5 text-[var(--color-bg-primary)]" 
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
                        <span className="text-[var(--color-text-primary)] font-bold text-xl tracking-tight">
                            Sketch<span className="text-[var(--color-primary)]">Vault</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.href}
                                href={link.href} 
                                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    pathname === link.href 
                                        ? 'text-[var(--color-primary)]' 
                                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                                }`}
                            >
                                {link.label}
                                {pathname === link.href && (
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--color-primary)]" />
                                )}
                            </Link>
                        ))}
                        
                        {/* CTA Button */}
                        <Link 
                            href="/gallery"
                            className="ml-4 px-5 py-2 bg-[var(--color-primary)] text-[var(--color-bg-primary)] rounded-lg text-sm font-semibold hover:bg-[var(--color-primary-light)] transition-colors duration-200"
                        >
                            Explore Art
                        </Link>
                    </nav>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[var(--color-bg-elevated)] transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <div className="flex flex-col gap-1.5 w-5">
                            <span 
                                className={`block h-0.5 bg-[var(--color-text-primary)] rounded-full transition-all duration-300 ${
                                    isMenuOpen ? 'rotate-45 translate-y-2' : ''
                                }`} 
                            />
                            <span 
                                className={`block h-0.5 bg-[var(--color-text-primary)] rounded-full transition-all duration-300 ${
                                    isMenuOpen ? 'opacity-0' : ''
                                }`} 
                            />
                            <span 
                                className={`block h-0.5 bg-[var(--color-text-primary)] rounded-full transition-all duration-300 ${
                                    isMenuOpen ? '-rotate-45 -translate-y-2' : ''
                                }`} 
                            />
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div 
                className={`md:hidden absolute top-full left-0 right-0 bg-[var(--color-bg-primary)]/95 backdrop-blur-md border-b border-[var(--color-border)] transition-all duration-300 ${
                    isMenuOpen 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 -translate-y-4 pointer-events-none'
                }`}
            >
                <nav className="px-6 py-4 flex flex-col gap-1">
                    {navLinks.map((link, index) => (
                        <Link 
                            key={link.href}
                            href={link.href} 
                            className={`px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                                pathname === link.href 
                                    ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/10' 
                                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]'
                            }`}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link 
                        href="/gallery"
                        className="mt-2 px-4 py-3 bg-[var(--color-primary)] text-[var(--color-bg-primary)] rounded-lg text-base font-semibold text-center hover:bg-[var(--color-primary-light)] transition-colors duration-200"
                    >
                        Explore Art
                    </Link>
                </nav>
            </div>
        </header>
    );
}
