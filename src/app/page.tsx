import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ArrowUpRightIcon } from "@heroicons/react/24/outline";

import { catalogueNumber, sketches, sketchHref, sketchTypeLabels } from "@/data/sketches";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IndexTable from "@/components/IndexTable";
import HeroCanvas from "@/components/home/HeroCanvas";

const latest = [...sketches].sort((a, b) => b.year - a.year || b.id - a.id)[0];
const media = new Set(sketches.map(s => s.medium));

const facts = [
    { value: String(sketches.length).padStart(2, "0"), label: "Works on file" },
    { value: String(media.size).padStart(2, "0"), label: "Media" },
    { value: "2025", label: "Collecting since" },
    { value: "100%", label: "Runs in your browser" },
];

export default function HomePage() {
    return (
        <>
            <Header />

            <main>
                {/* Frontispiece */}
                <section className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
                    <div className="grid gap-8 pt-10 pb-12 lg:grid-cols-12 lg:gap-10 lg:pt-16">
                        <div className="flex flex-col justify-between lg:col-span-6">
                            <div>
                                <p className="label animate-rise">An archive of interactive &amp; generative sketches</p>
                                <h1 className="display animate-rise mt-6 text-[clamp(3.6rem,9vw,8.5rem)] [animation-delay:80ms]">
                                    Small machines that <em className="text-signal">draw</em> themselves.
                                </h1>
                            </div>

                            <div className="animate-rise mt-10 [animation-delay:160ms]">
                                <p className="max-w-md text-lg leading-relaxed text-ink-soft">
                                    SketchVault keeps experiments in code: simulations, games that play themselves,
                                    fields of noise. Each one runs live in your browser, and every parameter is yours to change.
                                </p>
                                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                                    <Link
                                        href="/gallery"
                                        className="group inline-flex items-center gap-3 bg-ink px-5 py-3.5 text-paper transition-colors hover:bg-signal hover:text-on-signal"
                                    >
                                        Open the index
                                        <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                    <Link href="/live-sketch" className="group inline-flex items-center gap-2 text-ink underline decoration-rule-strong underline-offset-4 hover:decoration-signal">
                                        or make something in the Studio
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <figure className="animate-rise lg:col-span-6 [animation-delay:120ms]">
                            <div className="relative aspect-[4/5] overflow-hidden border border-rule-strong sm:aspect-[4/3] lg:aspect-auto lg:h-[min(68vh,640px)]">
                                <HeroCanvas />
                            </div>
                            <figcaption className="label mt-2 flex justify-between gap-4">
                                <span>Fig. 0 · This page, drawing itself</span>
                                <span className="hidden sm:inline">Move your pointer through it</span>
                            </figcaption>
                        </figure>
                    </div>

                    <dl className="grid grid-cols-2 border-y border-rule md:grid-cols-4">
                        {facts.map((fact, i) => (
                            <div key={fact.label} className={`py-5 ${i % 2 === 1 ? "border-l border-rule pl-4 md:pl-6" : ""} ${i === 2 ? "md:border-l md:border-rule md:pl-6" : ""} ${i >= 2 ? "border-t border-rule md:border-t-0" : ""}`}>
                                <dt className="label">{fact.label}</dt>
                                <dd className="mt-1 font-serif text-4xl tabular-nums">{fact.value}</dd>
                            </div>
                        ))}
                    </dl>
                </section>

                {/* Latest acquisition */}
                <section className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-10">
                    <div className="mb-6 flex items-baseline justify-between">
                        <h2 className="label">§1 · Latest acquisition</h2>
                        <span className="label">{catalogueNumber(latest.id)}</span>
                    </div>
                    <Link href={sketchHref(latest)} className="group grid gap-6 lg:grid-cols-12 lg:gap-10">
                        <div className="relative aspect-[16/10] overflow-hidden border border-rule bg-stage lg:col-span-8">
                            <Image
                                src={latest.thumbnail}
                                alt={latest.title}
                                fill
                                sizes="(min-width: 1024px) 66vw, 100vw"
                                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
                            />
                        </div>
                        <div className="flex flex-col lg:col-span-4">
                            <h3 className="display text-6xl sm:text-7xl">{latest.title}</h3>
                            <p className="mt-6 leading-relaxed text-ink-soft">{latest.description}</p>
                            <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-t border-rule pt-4 text-sm">
                                <dt className="label leading-5">Medium</dt>
                                <dd>{latest.medium}</dd>
                                <dt className="label leading-5">Type</dt>
                                <dd>{latest.types.map(t => sketchTypeLabels[t]).join(", ")}</dd>
                                <dt className="label leading-5">Year</dt>
                                <dd className="font-mono tabular-nums">{latest.year}</dd>
                            </dl>
                            <span className="mt-8 inline-flex items-center gap-2 self-start border-b border-ink pb-1 transition-colors group-hover:border-signal group-hover:text-signal lg:mt-auto">
                                Run it <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </span>
                        </div>
                    </Link>
                </section>

                {/* The index */}
                <section className="mx-auto max-w-[1440px] px-4 pb-24 sm:px-6 lg:px-10">
                    <div className="mb-8 flex items-baseline justify-between">
                        <h2 className="label">§2 · The index</h2>
                        <Link href="/gallery" className="label inline-flex items-center gap-1 hover:text-ink">
                            Browse &amp; filter <ArrowRightIcon className="h-3 w-3" />
                        </Link>
                    </div>
                    <IndexTable items={sketches} />
                </section>

                {/* Studio band */}
                <section data-theme="dark" className="bg-paper text-ink">
                    <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:px-10 lg:py-28">
                        <div className="lg:col-span-7">
                            <h2 className="label">§3 · The studio</h2>
                            <p className="display mt-6 text-[clamp(3rem,6.5vw,6rem)]">
                                Make something that <em className="text-signal">isn&rsquo;t</em> in the vault yet.
                            </p>
                        </div>
                        <div className="flex flex-col justify-end lg:col-span-5">
                            <p className="leading-relaxed text-ink-soft">
                                Pick a generator, choose a palette, fold it into a kaleidoscope and keep the frame you like.
                                Nothing to install and no account. It all runs on the canvas in front of you.
                            </p>
                            <Link
                                href="/live-sketch"
                                className="group mt-8 inline-flex items-center gap-3 self-start bg-signal px-5 py-3.5 text-on-signal transition-opacity hover:opacity-90"
                            >
                                Enter the studio
                                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* About & colophon */}
                <section id="about" className="mx-auto max-w-[1440px] scroll-mt-14 px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
                    <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
                        <div className="lg:col-span-7">
                            <h2 className="label">§4 · About the vault</h2>
                            <div className="mt-6 max-w-2xl space-y-5 text-lg leading-relaxed text-ink-soft">
                                <p>
                                    <span className="text-ink">SketchVault is a working notebook, catalogued.</span> Each entry
                                    started as a question: how does a flock hold together, what does A* look like when it
                                    has to live with its own tail? Each was built until it answered back.
                                </p>
                                <p>
                                    Entries are numbered in the order they were made and are never retired. They run entirely
                                    client-side, so what you see is the code itself running on your machine, not a recording.
                                </p>
                            </div>
                        </div>

                        <div className="lg:col-span-5">
                            <h2 className="label">Colophon</h2>
                            <dl className="mt-6 divide-y divide-rule border-y border-rule text-sm">
                                {[
                                    ["Display", "Instrument Serif"],
                                    ["Text", "Geist & Geist Mono"],
                                    ["Framework", "Next.js 16, React 19"],
                                    ["Rendering", "Three.js, p5.js, Canvas 2D"],
                                    ["Styling", "Tailwind CSS 4"],
                                ].map(([term, detail]) => (
                                    <div key={term} className="flex justify-between gap-4 py-3">
                                        <dt className="label leading-5">{term}</dt>
                                        <dd className="text-right">{detail}</dd>
                                    </div>
                                ))}
                                <div className="flex justify-between gap-4 py-3">
                                    <dt className="label leading-5">Source</dt>
                                    <dd>
                                        <Link
                                            href="https://github.com/BenFielder1/Sketch-Vault"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 hover:text-signal"
                                        >
                                            GitHub <ArrowUpRightIcon className="h-3 w-3" />
                                        </Link>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
