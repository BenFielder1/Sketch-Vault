import type { Metadata } from "next";

import Studio from "@/components/studio/Studio";

export const metadata: Metadata = {
    title: "Studio",
    description: "Make your own generative artwork: pick a generator, choose a palette, add symmetry and save the frame.",
};

export default function LiveSketchPage() {
    return <Studio />;
}
