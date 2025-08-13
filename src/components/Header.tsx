"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    return (

        <header className="relative z-20 px-6 py-6">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link href="/" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg"></div>
                    <span className="text-white font-bold text-xl">SketchVault</span>
                </Link>

                {/* Mobile menu button */}
                <button
                    className="md:hidden"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"} />
                    </svg>
                </button>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-8">
                    <Link href="/" className={`${pathname === "/" ? "text-white font-semibold" : "text-gray-300 hover:text-white transition-colors"}`}>Home</Link>
                    <Link href="/gallery" className={`${pathname === "/gallery" ? "text-white font-semibold" : "text-gray-300 hover:text-white transition-colors"}`}>Gallery</Link>
                    <Link href="/live-sketch" className={`${pathname === "/live-sketch" ? "text-white font-semibold" : "text-gray-300 hover:text-white transition-colors"}`}>Live Sketch</Link>
                </nav>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <nav className="md:hidden w-full py-4 px-4 shadow-lg">
                    <div className="flex flex-col space-y-4">
                        <Link href="/" className={`${pathname === "/" ? "text-white font-semibold" : "text-gray-300 hover:text-white transition-colors"}`}>Home</Link>
                        <Link href="/gallery" className={`${pathname === "/gallery" ? "text-white font-semibold" : "text-gray-300 hover:text-white transition-colors"}`}>Gallery</Link>
                        <Link href="/live-sketch" className={`${pathname === "/live-sketch" ? "text-white font-semibold" : "text-gray-300 hover:text-white transition-colors"}`}>Live Sketch</Link>
                    </div>
                </nav>
            )}
        </header>
    );
}
