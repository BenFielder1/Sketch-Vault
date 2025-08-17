"use client"
import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

import { ISketch } from '@/types/sketch';
import { sketchData } from '@/data/sketchData';
import Header from '@/components/Header';
import SketchModal from '@/components/SketchModal';
import SketchCard from '@/components/SketchCard';

const GalleryPage = () => {
    const [sketches, setSketches] = useState<ISketch[]>([]);
    const [filteredSketches, setFilteredSketches] = useState<ISketch[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<'all' | '3d' | 'generative' | 'interactive'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSketch, setSelectedSketch] = useState<ISketch | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setSketches(sketchData);
        setFilteredSketches(sketchData);
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        let filtered = sketches;

        if (selectedFilter !== 'all') {
            filtered = filtered.filter(sketch => sketch.types.includes(selectedFilter));
        }

        if (searchQuery) {
            filtered = filtered.filter(sketch =>
                sketch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                sketch.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        setFilteredSketches(filtered);
    }, [selectedFilter, searchQuery, sketches]);

    const filterButtons = [
        { key: 'all', label: 'All Sketches' },
        { key: '3d', label: '3D Art' },
        { key: 'generative', label: 'Generative' },
        { key: 'interactive', label: 'Interactive' },
        { key: '2d', label: '2D Art' }
    ];

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <Header />

                {/* Main Content */}
                <main className="relative z-10 px-6 pb-20">
                    <div className="max-w-7xl mx-auto">
                        {/* Page Header */}
                        <div className={`text-center mb-12 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                                Sketch Gallery
                            </h1>
                        </div>

                        {/* Search and Filters */}
                        <div className={`mb-12 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                                {/* Search Bar */}
                                <div className="relative flex-1 max-w-md">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search sketches..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-white/10 border border-white/20 rounded-full py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-lg"
                                    />
                                </div>

                                {/* Filter Buttons */}
                                <div className="flex gap-2 flex-wrap justify-center">
                                    {filterButtons.map(({ key, label }) => (
                                        <button
                                            key={key}
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            onClick={() => setSelectedFilter(key as any)}
                                            className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${selectedFilter === key
                                                ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                                                : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/20'
                                                }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Gallery Grid */}
                        <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            {filteredSketches.map((sketch, index) => (
                                <SketchCard
                                    key={sketch.id}
                                    sketch={sketch}
                                    onView={() => setSelectedSketch(sketch)}
                                    delay={index * 100}
                                />
                            ))}
                        </div>

                        {filteredSketches.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-gray-400 text-lg">No sketches found matching your criteria.</p>
                            </div>
                        )}
                    </div>
                </main>

                {/* Sketch Modal */}
                {selectedSketch && (
                    <SketchModal
                        sketch={selectedSketch}
                        onClose={() => setSelectedSketch(null)}
                    />
                )}
            </div>
        </>
    );
};

export default GalleryPage;