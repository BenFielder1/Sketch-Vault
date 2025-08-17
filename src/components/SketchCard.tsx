import Image from "next/image";
import { ShareIcon } from '@heroicons/react/24/outline';

import { ISketch } from "@/types/sketch";

export default function SketchCard({ sketch, onView, delay }: {
    sketch: ISketch;
    onView: () => void;
    delay: number;
}) {
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
                    />
                </div>

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