import Image from "next/image";
import { PlayIcon, XMarkIcon } from '@heroicons/react/24/outline';

import { ISketch } from "@/types/sketch";

export default function SketchModal({ sketch, onClose }: {
    sketch: ISketch;
    onClose: () => void;
}) {
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