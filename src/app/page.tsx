"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRightIcon, SparklesIcon, CubeIcon, PaintBrushIcon } from '@heroicons/react/24/outline';

import Footer from '@/components/Footer';
import FeatureCard from '@/components/FeatureCard';
import Header from '@/components/Header';

const HomePage = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <Header />

                {/* Hero Section */}
                <main className="relative z-10 px-6 py-20">
                    <div className="max-w-7xl mx-auto">
                        <div className={`text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
                                Digital Art
                                <span className="block bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                                    Reimagined
                                </span>
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                                Explore an interactive gallery of digital sketches and generative art,
                                brought to life with Three.js and p5.js technologies.
                            </p>

                            <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-16">
                                <Link
                                    href="/gallery"
                                    className="group bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25 flex items-center gap-2"
                                >
                                    Explore Gallery
                                    <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    href="/live-sketch"
                                    className="group border-2 border-gray-300 text-gray-300 hover:border-white hover:text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center gap-2"
                                >
                                    Live Sketching
                                    <SparklesIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                </Link>
                            </div>
                        </div>

                        {/* Feature Cards */}
                        <div className={`grid md:grid-cols-3 gap-8 mt-20 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <FeatureCard
                                icon={<CubeIcon className="w-8 h-8" />}
                                title="3D Sketches"
                                description="Interactive three-dimensional artworks that respond to your movements and interactions."
                            />
                            <FeatureCard
                                icon={<PaintBrushIcon className="w-8 h-8" />}
                                title="Generative Art"
                                description="Algorithm-driven compositions that create unique patterns and forms through code."
                            />
                            <FeatureCard
                                icon={<SparklesIcon className="w-8 h-8" />}
                                title="Interactive Experience"
                                description="Immersive digital canvas where art comes alive through real-time interactions."
                            />
                        </div>
                    </div>
                </main>

                
            </div>
            <Footer />
        </>
    );
};

export default HomePage;