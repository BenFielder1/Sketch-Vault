"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { MagnifyingGlassIcon, Squares2X2Icon, ListBulletIcon, XMarkIcon } from "@heroicons/react/24/outline";

import { SketchType } from "@/types/sketch";
import { sketches, sketchTypeLabels } from "@/data/sketches";
import SketchCard from "./SketchCard";
import IndexTable from "./IndexTable";
import Kbd from "./controls/Kbd";

type Filter = "all" | SketchType;
type Sort = "catalogue" | "newest" | "title";
type View = "grid" | "list";

const filters: Filter[] = ["all", "3d", "2d", "generative", "interactive"];

const sorters: Record<Sort, { label: string; compare: (a: typeof sketches[number], b: typeof sketches[number]) => number }> = {
    catalogue: { label: "Catalogue", compare: (a, b) => a.id - b.id },
    newest: { label: "Newest", compare: (a, b) => b.year - a.year || b.id - a.id },
    title: { label: "A–Z", compare: (a, b) => a.title.localeCompare(b.title) },
};

export default function GalleryBrowser() {
    const [filter, setFilter] = useState<Filter>("all");
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState<Sort>("catalogue");
    const [view, setView] = useState<View>("grid");
    const searchRef = useRef<HTMLInputElement>(null);

    // "/" jumps to search, as on most catalogues and docs sites
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== "/" || document.activeElement === searchRef.current) return;
            e.preventDefault();
            searchRef.current?.focus();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    const counts = useMemo(() => {
        const result: Record<Filter, number> = { all: sketches.length, "3d": 0, "2d": 0, generative: 0, interactive: 0 };
        sketches.forEach(s => s.types.forEach(t => result[t]++));
        return result;
    }, []);

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        return sketches
            .filter(s => filter === "all" || s.types.includes(filter))
            .filter(s => !q || [s.title, s.summary, s.description, s.medium, ...s.tags].some(field => field.toLowerCase().includes(q)))
            .sort(sorters[sort].compare);
    }, [filter, query, sort]);

    const clear = () => {
        setFilter("all");
        setQuery("");
    };

    return (
        <>
            {/* Toolbar */}
            <div className="sticky top-14 z-30 -mx-4 border-b border-rule bg-paper/90 px-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
                <div className="flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="scrollbar-thin -mx-1 flex gap-1 overflow-x-auto px-1" role="radiogroup" aria-label="Filter by type">
                        {filters.map(f => {
                            const active = filter === f;
                            return (
                                <button
                                    key={f}
                                    role="radio"
                                    aria-checked={active}
                                    onClick={() => setFilter(f)}
                                    disabled={counts[f] === 0}
                                    className={`inline-flex shrink-0 items-center gap-2 border px-3 py-1.5 text-sm transition-colors disabled:opacity-40 ${
                                        active ? "border-ink bg-ink text-paper" : "border-rule text-ink-soft hover:border-rule-strong hover:text-ink"
                                    }`}
                                >
                                    {f === "all" ? "All" : sketchTypeLabels[f]}
                                    <span className={`font-mono text-[11px] tabular-nums ${active ? "text-signal" : "text-muted"}`}>
                                        {String(counts[f]).padStart(2, "0")}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="relative flex-1 lg:w-72 lg:flex-none">
                            <span className="sr-only">Search sketches</span>
                            <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
                            <input
                                ref={searchRef}
                                type="search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Escape" && (setQuery(""), e.currentTarget.blur())}
                                placeholder="Search title, tag, technique"
                                className="h-9 w-full border border-rule bg-surface pr-9 pl-9 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none [&::-webkit-search-cancel-button]:hidden"
                            />
                            {query ? (
                                <button onClick={() => setQuery("")} className="absolute top-1/2 right-2 -translate-y-1/2 p-1 text-muted hover:text-ink" aria-label="Clear search">
                                    <XMarkIcon className="h-3.5 w-3.5" />
                                </button>
                            ) : (
                                <span className="pointer-events-none absolute top-1/2 right-2 hidden -translate-y-1/2 sm:block">
                                    <Kbd>/</Kbd>
                                </span>
                            )}
                        </label>

                        <label className="relative">
                            <span className="sr-only">Sort</span>
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value as Sort)}
                                className="h-9 appearance-none border border-rule bg-surface pr-7 pl-3 text-sm text-ink focus:border-ink focus:outline-none"
                            >
                                {Object.entries(sorters).map(([key, { label }]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                            <span className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-[10px] text-muted">▾</span>
                        </label>

                        <div className="flex border border-rule" role="radiogroup" aria-label="View">
                            {([["grid", Squares2X2Icon, "Plates"], ["list", ListBulletIcon, "Ledger"]] as const).map(([key, Icon, label]) => (
                                <button
                                    key={key}
                                    role="radio"
                                    aria-checked={view === key}
                                    aria-label={`${label} view`}
                                    title={`${label} view`}
                                    onClick={() => setView(key)}
                                    className={`inline-flex h-[34px] w-9 items-center justify-center transition-colors ${view === key ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"}`}
                                >
                                    <Icon className="h-4 w-4" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <p className="label mt-6 mb-8" aria-live="polite">
                Showing {String(results.length).padStart(2, "0")} of {String(sketches.length).padStart(2, "0")}
                {query && <> · matching “{query}”</>}
            </p>

            {results.length === 0 ? (
                <div className="border border-dashed border-rule-strong px-6 py-20 text-center">
                    <p className="display text-5xl">Nothing on file.</p>
                    <p className="mt-3 text-ink-soft">No sketch matches that combination.</p>
                    <button onClick={clear} className="mt-6 border-b border-ink pb-0.5 text-sm hover:border-signal hover:text-signal">
                        Clear filters
                    </button>
                </div>
            ) : view === "grid" ? (
                <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                    {results.map((sketch, i) => (
                        <div key={sketch.slug} className="animate-rise" style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}>
                            <SketchCard sketch={sketch} priority={i < 3} />
                        </div>
                    ))}
                </div>
            ) : (
                <IndexTable items={results} />
            )}
        </>
    );
}
