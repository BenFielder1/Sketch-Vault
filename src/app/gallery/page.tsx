import type { Metadata } from "next";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GalleryBrowser from "@/components/GalleryBrowser";
import { sketches } from "@/data/sketches";

export const metadata: Metadata = {
    title: "Index",
    description: "Browse, search and filter every interactive and generative sketch in SketchVault.",
};

export default function GalleryPage() {
    return (
        <>
            <Header />
            <main className="mx-auto max-w-[1440px] px-4 pt-12 pb-24 sm:px-6 lg:px-10 lg:pt-16">
                <div className="grid gap-6 border-b border-rule-strong pb-10 lg:grid-cols-12">
                    <div className="lg:col-span-8">
                        <p className="label animate-rise">The index · {String(sketches.length).padStart(2, "0")} entries</p>
                        <h1 className="display animate-rise mt-5 text-[clamp(3.4rem,8vw,7.5rem)] [animation-delay:80ms]">
                            Every work <em>on file</em>.
                        </h1>
                    </div>
                    <p className="animate-rise self-end leading-relaxed text-ink-soft lg:col-span-4 [animation-delay:140ms]">
                        Numbered in the order they were made. Filter by type, search by technique, or switch to the
                        ledger view to compare them side by side.
                    </p>
                </div>

                <GalleryBrowser />
            </main>
            <Footer />
        </>
    );
}
