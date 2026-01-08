"use client"
import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

import { ISketch } from '@/types/sketch';
import { sketchData } from '@/data/sketchData';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SketchModal from '@/components/SketchModal';
import SketchCard from '@/components/SketchCard';

type FilterType = 'all' | '3d' | 'generative' | 'interactive' | '2d';

const GalleryPage = () => {
    const [sketches, setSketches] = useState<ISketch[]>([]);
    const [filteredSketches, setFilteredSketches] = useState<ISketch[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSketch, setSelectedSketch] = useState<ISketch | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        setSketches(sketchData);
        setFilteredSketches(sketchData);
    }, []);

    useEffect(() => {
        let filtered = sketches;

        if (selectedFilter !== 'all') {
            filtered = filtered.filter(sketch => sketch.types.includes(selectedFilter));
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(sketch =>
                sketch.title.toLowerCase().includes(query) ||
                sketch.description.toLowerCase().includes(query) ||
                sketch.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }

        setFilteredSketches(filtered);
    }, [selectedFilter, searchQuery, sketches]);

    const filterButtons: { key: FilterType; label: string; color: string }[] = [
        { key: 'all', label: 'All', color: 'var(--color-text-primary)' },
        { key: '3d', label: '3D', color: 'var(--color-primary)' },
        { key: 'generative', label: 'Generative', color: 'var(--color-accent)' },
        { key: 'interactive', label: 'Interactive', color: 'var(--color-rose)' },
        { key: '2d', label: '2D', color: '#60a5fa' },
    ];

    return (
        <>
            <div className="min-h-screen bg-[var(--color-bg-primary)] relative">
                <Header />
                
                {/* Background decorations */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-1/4 -right-32 w-80 h-80 bg-[var(--color-primary)]/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 -left-32 w-64 h-64 bg-[var(--color-accent)]/5 rounded-full blur-3xl" />
                    <div className="absolute inset-0 grid-pattern opacity-20" />
                </div>

                {/* Main Content */}
                <main className="relative z-10 pt-28 pb-20 px-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Page Header */}
                        <div className="mb-12">
                            <h1 className="animate-in delay-1 text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-4">
                                Gallery
                            </h1>
                            <p className="animate-in delay-2 text-[var(--color-text-secondary)] max-w-xl">
                                Browse the collection of interactive digital art and generative sketches.
                            </p>
                        </div>

                        {/* Search and Filters Bar */}
                        <div className="animate-in delay-3 mb-10 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                            {/* Search Bar */}
                            <div className="relative w-full lg:w-96">
                                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                                <input
                                    type="text"
                                    placeholder="Search sketches..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl py-3 pl-12 pr-4 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)]/50 focus:ring-1 focus:ring-[var(--color-primary)]/50 transition-all"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md hover:bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                                    >
                                        <XMarkIcon className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {/* Desktop Filter Buttons */}
                            <div className="hidden lg:flex items-center gap-2">
                                {filterButtons.map(({ key, label }) => (
                                    <button
                                        key={key}
                                        onClick={() => setSelectedFilter(key)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                            selectedFilter === key
                                                ? 'bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] border border-[var(--color-border-hover)]'
                                                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>

                            {/* Mobile Filter Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)]"
                            >
                                <FunnelIcon className="w-4 h-4" />
                                Filters
                                {selectedFilter !== 'all' && (
                                    <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                                )}
                            </button>
                        </div>

                        {/* Mobile Filter Panel */}
                        {showFilters && (
                            <div className="lg:hidden mb-6 p-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                                <div className="flex flex-wrap gap-2">
                                    {filterButtons.map(({ key, label }) => (
                                        <button
                                            key={key}
                                            onClick={() => {
                                                setSelectedFilter(key);
                                                setShowFilters(false);
                                            }}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                selectedFilter === key
                                                    ? 'bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] border border-[var(--color-border-hover)]'
                                                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)]'
                                            }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Results count */}
                        <div className="mb-6 text-sm text-[var(--color-text-muted)]">
                            {filteredSketches.length} {filteredSketches.length === 1 ? 'sketch' : 'sketches'} found
                        </div>

                        {/* Gallery Grid */}
                        {filteredSketches.length > 0 ? (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredSketches.map((sketch, index) => (
                                    <SketchCard
                                        key={sketch.id}
                                        sketch={sketch}
                                        onView={() => setSelectedSketch(sketch)}
                                        delay={100 + index * 75}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] mb-4">
                                    <MagnifyingGlassIcon className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                                    No sketches found
                                </h3>
                                <p className="text-[var(--color-text-secondary)] mb-6">
                                    Try adjusting your search or filter criteria.
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSelectedFilter('all');
                                    }}
                                    className="px-4 py-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] transition-colors"
                                >
                                    Clear filters
                                </button>
                            </div>
                        )}
                    </div>
                </main>

                <Footer />

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
