"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

import { ISketch } from "@/types/sketch";
import { catalogueNumber, sketchHref, sketchTypeLabels } from "@/data/sketches";

/**
 * The catalogue as a ruled table. On devices with a fine pointer, hovering a row
 * floats a preview plate next to the cursor.
 */
export default function IndexTable({ items }: { items: ISketch[] }) {
    const [hovered, setHovered] = useState<ISketch | null>(null);
    const previewRef = useRef<HTMLDivElement>(null);

    const movePreview = (e: React.PointerEvent) => {
        if (e.pointerType !== "mouse" || !previewRef.current) return;
        previewRef.current.style.transform = `translate(${e.clientX + 24}px, ${e.clientY - 90}px)`;
    };

    return (
        <div onPointerMove={movePreview} onPointerLeave={() => setHovered(null)}>
            <div className="label hidden grid-cols-12 gap-4 border-b border-rule-strong pb-2 md:grid">
                <span className="col-span-1">No.</span>
                <span className="col-span-4">Title</span>
                <span className="col-span-4">Description</span>
                <span className="col-span-2">Medium</span>
                <span className="col-span-1 text-right">Year</span>
            </div>
            <ul>
                {items.map(sketch => (
                    <li key={sketch.slug} className="border-b border-rule">
                        <Link
                            href={sketchHref(sketch)}
                            onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(sketch)}
                            className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-4 gap-y-1 py-5 transition-colors hover:bg-surface md:grid-cols-12 md:gap-4 md:px-2 md:-mx-2"
                        >
                            <span className="label tabular-nums group-hover:text-signal md:col-span-1">
                                {catalogueNumber(sketch.id).replace("No. ", "")}
                            </span>
                            <span className="font-serif text-3xl leading-none transition-transform duration-300 group-hover:translate-x-1 md:col-span-4 md:text-4xl">
                                {sketch.title}
                            </span>
                            <ArrowRightIcon className="h-4 w-4 self-center text-muted transition-all group-hover:translate-x-1 group-hover:text-signal md:hidden" />
                            <span className="col-span-2 col-start-2 text-sm text-ink-soft md:col-span-4 md:col-start-auto">
                                {sketch.summary}
                            </span>
                            <span className="col-span-2 col-start-2 text-sm md:col-span-2 md:col-start-auto">
                                {sketch.medium}
                                <span className="text-muted"> · {sketch.types.map(t => sketchTypeLabels[t]).join(", ")}</span>
                            </span>
                            <span className="hidden text-right font-mono text-sm tabular-nums md:col-span-1 md:block">{sketch.year}</span>
                        </Link>
                    </li>
                ))}
            </ul>

            <div
                ref={previewRef}
                className={`pointer-events-none fixed top-0 left-0 z-50 hidden w-72 transition-opacity duration-200 lg:block ${hovered ? "opacity-100" : "opacity-0"}`}
                aria-hidden="true"
            >
                {hovered && (
                    <div className="border border-ink bg-paper p-1.5 shadow-[6px_6px_0_0_var(--signal)]">
                        <div className="relative aspect-[4/3] bg-stage">
                            <Image src={hovered.thumbnail} alt="" fill sizes="288px" className="object-cover" />
                        </div>
                        <div className="label flex justify-between px-1 pt-1.5">
                            <span>{catalogueNumber(hovered.id)}</span>
                            <span>{hovered.medium}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
