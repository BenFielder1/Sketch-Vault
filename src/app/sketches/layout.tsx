"use client";
import { useEffect, useState } from 'react';
import {
    PlayIcon,
    PauseIcon,
    Cog6ToothIcon,
    PhotoIcon
} from '@heroicons/react/24/outline';
import { usePathname } from "next/navigation";

import ControlSlider from '@/components/sketches/ControlSlider';
import ControlToggle from '@/components/sketches/ControlToggle';
import SketchHeader from '@/components/sketches/SketchHeader';

import { sketchControls } from '@/data/sketchData';

export default function SkecthLayout({ children, params }: { children: React.ReactNode, params: {test: string} }) {
    const [isPlaying, setIsPlaying] = useState(true);
    const [controls, setControls] = useState({
        planetScale: 1,
        orbitSpeed: 1,
        showOrbits: true,
        showStars: true,
    });

    const path = usePathname();

    params.test = "Hello World!!"

    

    

    const handleControlChange = (key: string, value: number | boolean) => {
        setControls(prev => ({ ...prev, [key]: value }));
    };

    const saveScreenshot = () => {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            const link = document.createElement('a');
            link.download = `sketch-test-${Date.now()}.png`;
            link.href = canvas.toDataURL();
            link.click();
        }
    };

    return (
        <>
            {children}
            {/* <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
                <SketchHeader title="testing..." />

                <div className="flex h-full flex-1">
                    <div className={`w-80 transition-all duration-300 bg-black/40 backdrop-blur-sm border-r border-white/10 flex flex-col`}>
                        <button
                            className="p-4 text-white hover:bg-white/10 transition-colors"
                        >
                            <Cog6ToothIcon className="w-6 h-6" />
                        </button>

                        <>
                            <div className="p-4 flex-1 overflow-y-auto">
                                <h3 className="text-white font-semibold mb-4">Animation Controls</h3>

                                <div className="space-y-6">
                                    <ControlSlider
                                        label="Planet Scale"
                                        value={controls.planetScale}
                                        min={0.5}
                                        max={3}
                                        step={0.1}
                                        onChange={(value) => handleControlChange('planetScale', value)}
                                    />

                                    <ControlSlider
                                        label="Orbit Speed"
                                        value={controls.orbitSpeed}
                                        min={0.1}
                                        max={5}
                                        step={0.1}
                                        onChange={(value) => handleControlChange('orbitSpeed', value)}
                                    />
                                </div>

                                <h3 className="text-white font-semibold mb-4 mt-8">Display Options</h3>

                                <div className="space-y-4">
                                    <ControlToggle
                                        label="Show Orbits"
                                        value={controls.showOrbits}
                                        onChange={(value) => handleControlChange('showOrbits', value)}
                                    />

                                    <ControlToggle
                                        label="Show Stars"
                                        value={controls.showStars}
                                        onChange={(value) => handleControlChange('showStars', value)}
                                    />
                                </div>
                            </div>

                            <div className="p-4 border-t border-white/10 space-y-3">
                                <button
                                    onClick={saveScreenshot}
                                    className="w-full flex items-center justify-center gap-2 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                                >
                                    <PhotoIcon className="w-4 h-4" />
                                    Save Screenshot
                                </button>
                            </div>
                        </>
                    </div>

                    <div className="flex-1 relative">
                        <div className="w-full h-full">
                            {children}
                        </div>

                        <div className="absolute top-4 right-4">
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className={`p-3 rounded-full backdrop-blur-sm transition-all duration-300 ${isPlaying
                                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                    : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                    }`}
                            >
                                {isPlaying ? (
                                    <PauseIcon className="w-6 h-6" />
                                ) : (
                                    <PlayIcon className="w-6 h-6" />
                                )}
                            </button>
                        </div>

                        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white max-w-xs">
                            <h3 className="font-semibold mb-2">Solar System</h3>
                            <p className="text-sm text-gray-300 mb-2">
                                Interactive 3D model with 8 planets orbiting the sun.
                            </p>
                            <p className="text-xs text-gray-400">
                                Use mouse to orbit, zoom, and pan the camera.
                                Adjust controls in the sidebar.
                            </p>
                        </div>
                    </div>
                </div>
            </div> */}
        </>
    );
};
