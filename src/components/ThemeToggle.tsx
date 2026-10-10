"use client";
import { useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

type Theme = "light" | "dark";

const query = "(prefers-color-scheme: dark)";

function subscribe(callback: () => void) {
    const media = window.matchMedia(query);
    const observer = new MutationObserver(callback);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    media.addEventListener("change", callback);
    return () => {
        observer.disconnect();
        media.removeEventListener("change", callback);
    };
}

function currentTheme(): Theme {
    const set = document.documentElement.dataset.theme;
    if (set === "light" || set === "dark") return set;
    return window.matchMedia(query).matches ? "dark" : "light";
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
    const theme = useSyncExternalStore(subscribe, currentTheme, () => "light" as Theme);
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";

    const toggle = () => {
        document.documentElement.dataset.theme = nextTheme;
        try {
            localStorage.setItem("sv-theme", nextTheme);
        } catch {
            // Storage can be unavailable (private mode); the choice still applies for this visit
        }
    };

    return (
        <button
            type="button"
            onClick={toggle}
            className={`inline-flex h-8 w-8 items-center justify-center text-ink-soft transition-colors hover:bg-sunken hover:text-ink ${className}`}
            aria-label={`Switch to ${nextTheme} theme`}
            title={`Switch to ${nextTheme} theme`}
        >
            {theme === "dark" ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
        </button>
    );
}
