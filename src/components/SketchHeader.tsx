"use client";
import Link from "next/link";
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Header() {
    return (

        <header className="relative z-20 px-6 py-6">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link href="/gallery" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Back to Gallery</span>
                </Link>

                <h1 className="text-xl font-bold text-white">Planetary System</h1>
                <div className="w-24"></div> {/* Spacer for centering */}
            </div>
        </header>
    );
}
