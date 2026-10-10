import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const instrument = Instrument_Serif({
    subsets: ["latin"],
    weight: "400",
    style: ["normal", "italic"],
    variable: "--font-instrument",
});

export const metadata: Metadata = {
    title: {
        default: "SketchVault — an archive of living sketches",
        template: "%s · SketchVault",
    },
    description: "A catalogued collection of interactive, generative and algorithmic sketches by Ben Fielder, built with Three.js, p5.js and the Canvas API.",
    keywords: ["generative art", "creative coding", "three.js", "p5.js", "interactive art", "canvas"],
    authors: [{ name: "Ben Fielder", url: "https://benfielder.com" }],
    openGraph: {
        title: "SketchVault",
        description: "A catalogued collection of interactive, generative and algorithmic sketches.",
        type: "website",
    },
};

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#edebe4" },
        { media: "(prefers-color-scheme: dark)", color: "#0f0f0e" },
    ],
};

// Applies a stored theme choice before first paint so there is no flash.
const themeScript = `try{var t=localStorage.getItem('sv-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${geist.variable} ${geistMono.variable} ${instrument.variable}`} suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeScript }} />
            </head>
            <body>
                {children}
            </body>
        </html>
    );
}
