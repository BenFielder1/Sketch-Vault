import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

import { ISketch } from "@/types/sketch";
import { catalogueNumber, sketchHref, sketchTypeLabels } from "@/data/sketches";

export default function SketchCard({ sketch, priority = false }: { sketch: ISketch; priority?: boolean }) {
    return (
        <Link href={sketchHref(sketch)} className="group block">
            <div className="relative aspect-[4/3] overflow-hidden border border-rule bg-stage">
                <Image
                    src={sketch.thumbnail}
                    alt={`${sketch.title}, ${sketch.summary.toLowerCase()}`}
                    fill
                    priority={priority}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <span className="absolute top-0 left-0 bg-paper px-2 py-1 font-mono text-[11px] tabular-nums text-ink">
                    {catalogueNumber(sketch.id)}
                </span>
                <span className="absolute right-0 bottom-0 inline-flex translate-y-full items-center gap-1.5 bg-signal px-3 py-2 text-sm text-on-signal transition-transform duration-300 group-hover:translate-y-0">
                    Open <ArrowRightIcon className="h-3.5 w-3.5" />
                </span>
            </div>

            <div className="mt-3 flex items-baseline justify-between gap-4">
                <h3 className="font-serif text-[1.75rem] leading-tight decoration-signal decoration-1 underline-offset-4 group-hover:underline">
                    {sketch.title}
                </h3>
                <span className="font-mono text-xs tabular-nums text-muted">{sketch.year}</span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{sketch.summary}</p>
            <p className="label mt-3">
                {sketch.medium} · {sketch.types.map(t => sketchTypeLabels[t]).join(" / ")}
            </p>
        </Link>
    );
}
