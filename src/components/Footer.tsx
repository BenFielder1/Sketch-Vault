import Link from "next/link";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";

import { VaultMark } from "./Wordmark";

const elsewhere = [
    { href: "https://benfielder.com", label: "Portfolio" },
    { href: "https://github.com/BenFielder1", label: "GitHub" },
    { href: "https://www.linkedin.com/in/ben-fielder-38a9ba276/", label: "LinkedIn" },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-rule">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
                <div className="grid gap-10 py-14 md:grid-cols-12">
                    <div className="md:col-span-6">
                        <p className="display text-5xl sm:text-6xl">
                            Made in code by{" "}
                            <Link href="https://benfielder.com" target="_blank" rel="noopener noreferrer" className="italic decoration-signal decoration-2 underline-offset-[6px] hover:underline">
                                Ben Fielder
                            </Link>
                            .
                        </p>
                    </div>

                    <div className="md:col-span-3">
                        <h2 className="label mb-4">Visit</h2>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/gallery" className="text-ink-soft hover:text-ink">Index</Link></li>
                            <li><Link href="/live-sketch" className="text-ink-soft hover:text-ink">Studio</Link></li>
                            <li><Link href="/#about" className="text-ink-soft hover:text-ink">About</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-3">
                        <h2 className="label mb-4">Elsewhere</h2>
                        <ul className="space-y-2 text-sm">
                            {elsewhere.map(link => (
                                <li key={link.href}>
                                    <Link href={link.href} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1 text-ink-soft hover:text-ink">
                                        {link.label}
                                        <ArrowUpRightIcon className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-rule py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <VaultMark className="h-5 w-5" />
                        <span className="label">© {currentYear} SketchVault</span>
                    </div>
                    <span className="label">Next.js · Three.js · p5.js · Canvas 2D</span>
                </div>
            </div>
        </footer>
    );
}
