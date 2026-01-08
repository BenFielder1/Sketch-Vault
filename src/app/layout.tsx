import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "SketchVault | Interactive Digital Art Gallery",
    description: "Discover and interact with stunning digital sketches and generative art. Built with Three.js, p5.js, and creative code.",
    keywords: ["digital art", "generative art", "creative coding", "three.js", "p5.js", "interactive art"],
    authors: [{ name: "Ben Fielder" }],
    openGraph: {
        title: "SketchVault | Interactive Digital Art Gallery",
        description: "Discover and interact with stunning digital sketches and generative art.",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="noise-overlay">
                {children}
            </body>
        </html>
    );
}
