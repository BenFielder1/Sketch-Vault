"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Bars2Icon, XMarkIcon } from "@heroicons/react/24/outline";

import { sketches } from "@/data/sketches";
import ThemeToggle from "./ThemeToggle";
import Wordmark from "./Wordmark";

const navLinks = [
    { href: "/gallery", label: "Index" },
    { href: "/live-sketch", label: "Studio" },
    { href: "/#about", label: "About" },
];

export default function Header() {
    const pathname = usePathname();
    const [openFor, setOpenFor] = useState<string | null>(null);
    // The menu belongs to the page it was opened on, so navigating closes it
    const isMenuOpen = openFor === pathname;

    return (
        <header className="sticky top-0 z-40 border-b border-rule bg-paper/85 backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-6 px-4 sm:px-6 lg:px-10">
                <Wordmark />

                <span className="label hidden md:inline">
                    {String(sketches.length).padStart(2, "0")} works on file
                </span>

                <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Main">
                    {navLinks.map(link => {
                        const active = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                aria-current={active ? "page" : undefined}
                                className={`relative px-3 py-1.5 text-sm transition-colors ${active ? "text-ink" : "text-ink-soft hover:text-ink"}`}
                            >
                                {link.label}
                                {active && <span className="absolute inset-x-3 -bottom-[15px] h-[2px] bg-signal" />}
                            </Link>
                        );
                    })}
                    <span className="mx-2 h-4 w-px bg-rule" />
                    <ThemeToggle />
                </nav>

                <div className="ml-auto flex items-center md:hidden">
                    <ThemeToggle />
                    <button
                        className="inline-flex h-8 w-8 items-center justify-center text-ink"
                        onClick={() => setOpenFor(isMenuOpen ? null : pathname)}
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isMenuOpen}
                    >
                        {isMenuOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars2Icon className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <nav className="border-t border-rule bg-paper px-4 pb-6 md:hidden" aria-label="Main">
                    {navLinks.map((link, i) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setOpenFor(null)}
                            className="flex items-baseline gap-4 border-b border-rule py-4"
                        >
                            <span className="label w-6">{String(i + 1).padStart(2, "0")}</span>
                            <span className="font-serif text-3xl">{link.label}</span>
                        </Link>
                    ))}
                </nav>
            )}
        </header>
    );
}
