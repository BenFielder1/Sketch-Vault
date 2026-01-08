import Link from "next/link";

export default function Footer() {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="relative bg-[var(--color-bg-secondary)] border-t border-[var(--color-border)]">
            {/* Decorative gradient line at top */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-50" />
            
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid md:grid-cols-12 gap-12">
                    {/* Brand Column */}
                    <div className="md:col-span-5">
                        <Link href="/" className="inline-flex items-center gap-3 mb-4">
                            <div className="relative w-10 h-10 flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-xl opacity-90" />
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
                        <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed max-w-sm mt-4">
                            A curated collection of interactive digital art and generative sketches, 
                            exploring the intersection of code and creativity.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="md:col-span-3">
                        <h4 className="text-[var(--color-text-primary)] font-semibold text-sm uppercase tracking-wider mb-4">
                            Explore
                        </h4>
                        <nav className="flex flex-col gap-2">
                            <Link href="/" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors text-sm py-1">
                                Home
                            </Link>
                            <Link href="/gallery" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors text-sm py-1">
                                Gallery
                            </Link>
                            <Link href="/live-sketch" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors text-sm py-1">
                                Live Sketch
                            </Link>
                        </nav>
                    </div>

                    {/* Connect */}
                    <div className="md:col-span-4">
                        <h4 className="text-[var(--color-text-primary)] font-semibold text-sm uppercase tracking-wider mb-4">
                            Connect
                        </h4>
                        <div className="flex items-center gap-3">
                            <Link
                                href="https://benfielder.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 flex items-center justify-center rounded-lg bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg-tertiary)] transition-all duration-200"
                                aria-label="Portfolio"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1-4h2v-4h-2v4zm0-6h2V8h-2v2z" />
                                    <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
                                    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </Link>
                            <Link
                                href="https://github.com/BenFielder1"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 flex items-center justify-center rounded-lg bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg-tertiary)] transition-all duration-200"
                                aria-label="GitHub"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                            </Link>
                            <Link
                                href="https://www.linkedin.com/in/ben-fielder-38a9ba276/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 flex items-center justify-center rounded-lg bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg-tertiary)] transition-all duration-200"
                                aria-label="LinkedIn"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </Link>
                        </div>
                        
                        {/* Credit */}
                        <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
                            <p className="text-[var(--color-text-secondary)] text-sm">
                                Created by{" "}
                                <Link 
                                    href="https://benfielder.com" 
                                    target="_blank" 
                                    className="text-[var(--color-primary)] hover:underline font-medium"
                                >
                                    Ben Fielder
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-[var(--color-border)] flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[var(--color-text-muted)] text-sm">
                        © {currentYear} SketchVault. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-sm">
                        <span>Built with</span>
                        <span className="text-[var(--color-primary)] font-medium">Next.js</span>
                        <span className="text-[var(--color-text-muted)]">•</span>
                        <span className="text-[var(--color-accent)] font-medium">Three.js</span>
                        <span className="text-[var(--color-text-muted)]">•</span>
                        <span className="text-[var(--color-rose)] font-medium">p5.js</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}