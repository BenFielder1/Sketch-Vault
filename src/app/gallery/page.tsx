"use client"
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import {
    FunnelIcon,
    MagnifyingGlassIcon,
    PlayIcon,
    EyeIcon,
    HeartIcon,
    ShareIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, PlayIcon as PlayIconSolid } from '@heroicons/react/24/solid';

interface Sketch {
    id: number;
    title: string;
    description: string;
    types: ('3d' | 'generative' | 'interactive' | "2d")[];
    tags: string[];
    thumbnail: string;
    link: string;
    isLiked: boolean;
    likes: number;
    views: number;
    createdAt: string;
}

const GalleryPage = () => {
    const [sketches, setSketches] = useState<Sketch[]>([]);
    const [filteredSketches, setFilteredSketches] = useState<Sketch[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<'all' | '3d' | 'generative' | 'interactive'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSketch, setSelectedSketch] = useState<Sketch | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Mock data - replace with your actual data
    const mockSketches: Sketch[] = [
        {
            id: 1,
            title: "Planetary System",
            description: "Interactive 3D model of the solar system with 8 planets orbiting the sun.",
            types: ["interactive", "3d"],
            tags: ["space", "interactive", "three.js", "planets", "orbit"],
            thumbnail: "/sketches/planets2.png",
            link: "/sketches/planets",
            isLiked: false,
            likes: 124,
            views: 1502,
            createdAt: "2024-01-15"
        },
        {
            id: 2,
            title: "Snake AI",
            description: "Uses an A* routing algorithm to find the shortest path to the food.",
            types: ["2d"],
            tags: ["p5.js", "AI", "snake", "routing", "game"],
            thumbnail: "/sketches/snake.png",
            link: "/sketches/snake",
            isLiked: true,
            likes: 89,
            views: 934,
            createdAt: "2024-01-12"
        },
        // {
        //     id: 3,
        //     title: "Fractal Explorer",
        //     description: "Navigate through infinite fractal patterns with real-time zooming and color transformations.",
        //     types: ["generative"],
        //     tags: ["fractals", "generative", "math", "infinite"],
        //     thumbnail: "/sketches/planets.png",
        //     link: "",
        //     isLiked: false,
        //     likes: 156,
        //     views: 2103,
        //     createdAt: "2024-01-10"
        // },
        // {
        //     id: 4,
        //     title: "Fluid Dynamics",
        //     description: "Real-time fluid simulation with customizable parameters and interactive obstacles.",
        //     types: ["interactive"],
        //     tags: ["fluid", "physics", "simulation", "interactive"],
        //     thumbnail: "/sketches/planets.png",
        //     link: "",
        //     isLiked: false,
        //     likes: 203,
        //     views: 1834,
        //     createdAt: "2024-01-08"
        // },
        // {
        //     id: 5,
        //     title: "Crystal Growth",
        //     description: "Watch crystals grow in 3D space with physically-based rendering and organic patterns.",
        //     types: ["3d"],
        //     tags: ["3d", "growth", "organic", "crystals"],
        //     thumbnail: "/sketches/planets.png",
        //     link: "",
        //     isLiked: true,
        //     likes: 178,
        //     views: 1456,
        //     createdAt: "2024-01-05"
        // },
        // {
        //     id: 6,
        //     title: "Neural Network Visualization",
        //     description: "Interactive visualization of neural network training with real-time weight updates.",
        //     types: ["generative"],
        //     tags: ["ai", "neural", "visualization", "data"],
        //     thumbnail: "/sketches/planets.png",
        //     link: "",
        //     isLiked: false,
        //     likes: 267,
        //     views: 3102,
        //     createdAt: "2024-01-03"
        // }
    ];

    useEffect(() => {
        setSketches(mockSketches);
        setFilteredSketches(mockSketches);
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

    const toggleLike = (sketchId: number) => {
        setSketches(prev => prev.map(sketch =>
            sketch.id === sketchId
                ? {
                    ...sketch,
                    isLiked: !sketch.isLiked,
                    likes: sketch.isLiked ? sketch.likes - 1 : sketch.likes + 1
                }
                : sketch
        ));
    };

    const filterButtons = [
        { key: 'all', label: 'All Sketches' },
        { key: '3d', label: '3D Art' },
        { key: 'generative', label: 'Generative' },
        { key: 'interactive', label: 'Interactive' },
        { key: '2d', label: '2D Art' }
    ];

    return (
        <>
            {/* <Head>
                <title>Gallery - SketchVault</title>
                <meta name="description" content="Explore our collection of interactive digital sketches and generative art" />
            </Head> */}

            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                {/* Header */}
                <header className="relative z-10 px-6 py-8">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg"></div>
                            <span className="text-white font-bold text-xl">SketchVault</span>
                        </Link>
                        <nav className="hidden md:flex items-center space-x-8">
                            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                                Home
                            </Link>
                            <Link href="/gallery" className="text-white font-semibold">
                                Gallery
                            </Link>
                            <Link href="/live-sketch" className="text-gray-300 hover:text-white transition-colors">
                                Live Sketch
                            </Link>
                        </nav>
                    </div>
                </header>

                {/* Main Content */}
                <main className="relative z-10 px-6 pb-20">
                    <div className="max-w-7xl mx-auto">
                        {/* Page Header */}
                        <div className={`text-center mb-12 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                                Sketch Gallery
                            </h1>
                            {/* <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                                Discover interactive digital art and generative sketches
                            </p> */}
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
                                    onLike={() => toggleLike(sketch.id)}
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
                        onLike={() => toggleLike(selectedSketch.id)}
                    />
                )}
            </div>
        </>
    );
};

// Sketch Card Component
const SketchCard = ({
    sketch,
    onLike,
    onView,
    delay
}: {
    sketch: Sketch;
    onLike: () => void;
    onView: () => void;
    delay: number;
}) => {
    const typeColors = {
        '3d': 'from-blue-500 to-purple-500',
        'generative': 'from-green-500 to-teal-500',
        'interactive': 'from-orange-500 to-pink-500',
        '2d': 'from-red-500 to-purple-500'
    };

    return (
        <div
            className="group relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-500 hover:scale-105"
            style={{ animationDelay: `${delay}ms` }}
        >
            {/* Thumbnail */}
            <div className="relative aspect-square overflow-hidden">
                <div className={`w-full h-full`}>
                    <Image
                        src={sketch.thumbnail}
                        alt={sketch.title}
                        fill
                        style={{ objectFit: "cover" }}
                    // className="transition-transform duration-300 group-hover:scale-110"
                    />
                </div>

                {/* <div className="absolute inset-0 flex items-center justify-center">
                    <PlayIconSolid className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110" />
                </div> */}

                {/* Type Badge */}
                <div className="absolute top-4 left-4">
                    {sketch.types.map((type) => (
                        <span
                            key={type}
                            className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${typeColors[type as keyof typeof typeColors] || 'from-gray-500 to-gray-700'} mr-2`}
                        >
                            {type}
                        </span>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    {/* <button
                        onClick={(e) => { e.stopPropagation(); onLike(); }}
                        className="p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
                    >
                        {sketch.isLiked ? (
                            <HeartSolidIcon className="w-4 h-4 text-red-500" />
                        ) : (
                            <HeartIcon className="w-4 h-4 text-white" />
                        )}
                    </button> */}
                    <button className="p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors">
                        <ShareIcon className="w-4 h-4 text-white" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {sketch.title}
                </h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {sketch.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {sketch.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-md">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* View Button */}
                <button
                    onClick={onView}
                    className="w-full mt-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white py-3 rounded-lg font-medium hover:from-purple-600 hover:to-cyan-600 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                >
                    View Sketch
                </button>
            </div>
        </div>
    );
};

// Sketch Modal Component
const SketchModal = ({
    sketch,
    onClose,
    onLike
}: {
    sketch: Sketch;
    onClose: () => void;
    onLike: () => void;
}) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
                >
                    <XMarkIcon className="w-6 h-6 text-white" />
                </button>

                <div className="flex flex-col md:flex-row">
                    {/* Sketch Display */}
                    <div className="flex-1 aspect-square md:aspect-auto relative overflow-hidden">
                        {/* Background Image */}
                        <Image
                            src={sketch.thumbnail}
                            alt={sketch.title}
                            fill
                            style={{ objectFit: "cover" }}
                            className="absolute inset-0"
                        />

                        {/* Overlay gradient for better text readability */}
                        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/60"></div>

                        {/* Text overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-white text-center">
                                <PlayIcon className="w-24 h-24 mx-auto mb-4 opacity-80 drop-shadow-lg" />
                                <p className="text-lg font-medium drop-shadow-lg">Interactive Sketch</p>
                                <p className="text-sm opacity-80 drop-shadow-lg">Click to launch</p>
                            </div>
                        </div>
                    </div>

                    {/* Info Panel */}
                    <div className="w-full md:w-96 p-8 bg-slate-800">
                        <h2 className="text-2xl font-bold text-white mb-4">{sketch.title}</h2>
                        <p className="text-gray-300 mb-6">{sketch.description}</p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {sketch.tags.map((tag) => (
                                <span key={tag} className="px-3 py-1 bg-white/10 text-gray-300 text-sm rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <button
                            onClick={() => {
                                if (sketch.link) {
                                    window.location.href = sketch.link;
                                }
                            }}
                            className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-cyan-600 hover:shadow-lg transition-all duration-300"
                        >
                            Launch
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GalleryPage;