import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
    return (
        <>
            <Header />
            <main className="mx-auto flex min-h-[70vh] max-w-[1440px] flex-col justify-center px-4 py-24 sm:px-6 lg:px-10">
                <p className="label">Error 404 · Not on file</p>
                <h1 className="display mt-6 text-[clamp(3.6rem,10vw,9rem)]">
                    This drawer is <em className="text-signal">empty</em>.
                </h1>
                <p className="mt-8 max-w-md text-lg text-ink-soft">
                    The page you were looking for isn&rsquo;t in the vault. It may have been renumbered, or it never existed.
                </p>
                <Link href="/gallery" className="group mt-10 inline-flex items-center gap-3 self-start bg-ink px-5 py-3.5 text-paper hover:bg-signal hover:text-on-signal">
                    Back to the index
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </main>
            <Footer />
        </>
    );
}
