import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { catalogueNumber, getSketch, sketches } from "@/data/sketches";
import SketchViewer from "@/components/viewer/SketchViewer";

export const dynamicParams = false;

export function generateStaticParams() {
    return sketches.map(sketch => ({ slug: sketch.slug }));
}

export async function generateMetadata({ params }: PageProps<"/sketches/[slug]">): Promise<Metadata> {
    const { slug } = await params;
    const sketch = getSketch(slug);
    if (!sketch) return {};
    return {
        title: `${sketch.title} (${catalogueNumber(sketch.id)})`,
        description: sketch.summary,
        openGraph: {
            title: `${sketch.title} · SketchVault`,
            description: sketch.summary,
            images: [sketch.thumbnail],
        },
    };
}

export default async function SketchPage({ params }: PageProps<"/sketches/[slug]">) {
    const { slug } = await params;
    if (!getSketch(slug)) notFound();

    // Keyed so moving between sketches starts each one with fresh state
    return <SketchViewer key={slug} slug={slug} />;
}
