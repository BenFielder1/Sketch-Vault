import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "SketchVault - Interactive Digital Art Gallery",
    description: "Explore beautiful digital sketches and interactive art created with Three.js and p5.js",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
}
