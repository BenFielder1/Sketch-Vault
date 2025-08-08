/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
    PlayIcon,
    PauseIcon,
    ArrowPathIcon,
    Cog6ToothIcon,
    PhotoIcon,
    VideoCameraIcon,
    PaintBrushIcon,
    SparklesIcon,
    CubeIcon,
    SunIcon,
    MoonIcon
} from '@heroicons/react/24/outline';

const LiveSketchPage = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedSketch, setSelectedSketch] = useState('particles');
    const [showControls, setShowControls] = useState(true);
    const [isRecording, setIsRecording] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Sketch configurations
    const sketches = [
        {
            id: 'particles',
            name: 'Particle System',
            description: 'Interactive particle system with physics',
            icon: <SparklesIcon className="w-5 h-5" />,
            controls: {
                particleCount: { min: 50, max: 500, default: 200 },
                speed: { min: 0.1, max: 5, default: 1 },
                size: { min: 1, max: 10, default: 3 },
                gravity: { min: -2, max: 2, default: 0.1 }
            }
        },
        {
            id: 'waves',
            name: 'Wave Function',
            description: 'Sine wave visualization with harmonics',
            icon: <PaintBrushIcon className="w-5 h-5" />,
            controls: {
                frequency: { min: 0.1, max: 5, default: 1 },
                amplitude: { min: 10, max: 200, default: 100 },
                phase: { min: 0, max: 6.28, default: 0 },
                harmonics: { min: 1, max: 10, default: 3 }
            }
        },
        {
            id: 'fractal',
            name: 'Fractal Tree',
            description: 'Recursive fractal tree generation',
            icon: <CubeIcon className="w-5 h-5" />,
            controls: {
                iterations: { min: 3, max: 10, default: 6 }, // Reduced max to prevent performance issues
                angle: { min: 0.1, max: 1.2, default: 0.4 },
                length: { min: 0.6, max: 0.85, default: 0.75 },
                branches: { min: 2, max: 4, default: 2 }, // Reduced max branches
            }
        }
    ];

    const [controls, setControls] = useState(() => {
        const initialControls: any = {};
        sketches.forEach(sketch => {
            initialControls[sketch.id] = {};
            Object.entries(sketch.controls).forEach(([key, config]) => {
                initialControls[sketch.id][key] = config.default;
            });
        });
        return initialControls;
    });

    const currentSketch = sketches.find(s => s.id === selectedSketch);

    useEffect(() => {
        // Initialize canvas and start animation loop when playing
        if (isPlaying && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Set canvas size
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;

            let animationId: number;

            const animate = () => {
                // Clear canvas
                ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Simple animation based on selected sketch
                renderSketch(ctx, canvas.width, canvas.height);

                if (isPlaying) {
                    animationId = requestAnimationFrame(animate);
                }
            };

            animate();

            return () => {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                }
            };
        }
    }, [isPlaying, selectedSketch, controls]);

    const renderSketch = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        const time = Date.now() * 0.001;
        const sketchControls = controls[selectedSketch];

        switch (selectedSketch) {
            case 'particles':
                renderParticles(ctx, width, height, time, sketchControls);
                break;
            case 'waves':
                renderWaves(ctx, width, height, time, sketchControls);
                break;
            case 'fractal':
                renderFractal(ctx, width, height, time, sketchControls);
                break;
        }
    };

    const renderParticles = (ctx: CanvasRenderingContext2D, width: number, height: number, time: number, controls: any) => {
        ctx.fillStyle = '#8b5cf6';
        for (let i = 0; i < controls.particleCount; i++) {
            const x = (Math.sin(time * controls.speed + i) * width / 4) + width / 2;
            const y = (Math.cos(time * controls.speed * 0.7 + i * 0.5) * height / 4) + height / 2;
            ctx.beginPath();
            ctx.arc(x, y, controls.size, 0, Math.PI * 2);
            ctx.fill();
        }
    };

    const renderWaves = (ctx: CanvasRenderingContext2D, width: number, height: number, time: number, controls: any) => {
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2;
        ctx.beginPath();

        for (let x = 0; x < width; x += 2) {
            let y = height / 2;
            for (let h = 1; h <= controls.harmonics; h++) {
                y += Math.sin((x * controls.frequency * h) / 50 + time + controls.phase) * (controls.amplitude / h);
            }
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    };

    // Replace the renderFractal function in pages/live-sketch.tsx

    const renderFractal = (ctx: CanvasRenderingContext2D, width: number, height: number, time: number, controls: any) => {
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;

        // Use iterative approach instead of recursion to prevent stack overflow
        interface Branch {
            x1: number;
            y1: number;
            x2: number;
            y2: number;
            depth: number;
            generation: number;
        }

        // Start with the trunk
        const initialBranch: Branch = {
            x1: width / 2,
            y1: height - 50,
            x2: width / 2,
            y2: height - 150,
            depth: Math.min(controls.iterations, 10), // Cap iterations to prevent performance issues
            generation: 0
        };

        let branches: Branch[] = [initialBranch];
        const maxBranches = 5000; // Prevent too many branches
        let totalBranches = 0;

        while (branches.length > 0 && totalBranches < maxBranches) {
            const currentBranches = [...branches];
            branches = [];

            for (const branch of currentBranches) {
                // Draw the current branch
                ctx.beginPath();
                ctx.moveTo(branch.x1, branch.y1);
                ctx.lineTo(branch.x2, branch.y2);
                ctx.stroke();

                totalBranches++;

                // Generate new branches if depth > 0
                if (branch.depth > 0) {
                    const angle = Math.atan2(branch.y2 - branch.y1, branch.x2 - branch.x1);
                    const currentLength = Math.sqrt((branch.x2 - branch.x1) ** 2 + (branch.y2 - branch.y1) ** 2);
                    const newLength = currentLength * controls.length;

                    // Only create new branches if they're large enough to be visible
                    if (newLength > 3) {
                        const numBranches = Math.min(controls.branches, 4); // Cap branches per node

                        for (let i = 0; i < numBranches; i++) {
                            // Add some randomness based on time for organic feel
                            const timeOffset = time * 0.1 + branch.generation * 0.3;
                            const angleVariation = Math.sin(timeOffset + i) * 0.1;

                            const branchAngle = angle +
                                (i - numBranches / 2 + 0.5) * controls.angle +
                                angleVariation;

                            const newX = branch.x2 + Math.cos(branchAngle) * newLength;
                            const newY = branch.y2 + Math.sin(branchAngle) * newLength;

                            branches.push({
                                x1: branch.x2,
                                y1: branch.y2,
                                x2: newX,
                                y2: newY,
                                depth: branch.depth - 1,
                                generation: branch.generation + 1
                            });
                        }
                    }
                }
            }
        }
    };

    const handleControlChange = (controlName: string, value: number) => {
        setControls((prev: any) => ({
            ...prev,
            [selectedSketch]: {
                ...prev[selectedSketch],
                [controlName]: value
            }
        }));
    };

    const resetSketch = () => {
        if (currentSketch) {
            const resetControls: any = {};
            Object.entries(currentSketch.controls).forEach(([key, config]) => {
                resetControls[key] = config.default;
            });
            setControls((prev: any) => ({
                ...prev,
                [selectedSketch]: resetControls
            }));
        }
    };

    const saveScreenshot = () => {
        if (canvasRef.current) {
            const link = document.createElement('a');
            link.download = `sketch-${selectedSketch}-${Date.now()}.png`;
            link.href = canvasRef.current.toDataURL();
            link.click();
        }
    };

    const toggleRecording = () => {
        setIsRecording(!isRecording);
        // In a real implementation, you would start/stop screen recording here
    };

    return (
        <>
            {/* <Head>
                <title>Live Sketch - SketchVault</title>
                <meta name="description" content="Create and interact with live generative art in real-time" />
            </Head> */}

            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
                {/* Header */}
                <header className="relative z-20 px-6 py-4 bg-black/20 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg"></div>
                            <span className="text-white font-bold text-xl">SketchVault</span>
                        </Link>
                        <nav className="hidden md:flex items-center space-x-8">
                            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                                Home
                            </Link>
                            <Link href="/gallery" className="text-gray-300 hover:text-white transition-colors">
                                Gallery
                            </Link>
                            <Link href="/live-sketch" className="text-white font-semibold">
                                Live Sketch
                            </Link>
                        </nav>
                    </div>
                </header>

                <div className="flex h-full flex-1">
                    {/* Sidebar */}
                    <div className={`${showControls ? 'w-80' : 'w-16'} transition-all duration-300 bg-black/40 backdrop-blur-sm border-r border-white/10 flex flex-col`}>
                        {/* Toggle Button */}
                        <button
                            onClick={() => setShowControls(!showControls)}
                            className="p-4 text-white hover:bg-white/10 transition-colors"
                        >
                            <Cog6ToothIcon className="w-6 h-6" />
                        </button>

                        {showControls && (
                            <>
                                {/* Sketch Selection */}
                                <div className="p-4 border-b border-white/10">
                                    <h3 className="text-white font-semibold mb-3">Sketch Type</h3>
                                    <div className="space-y-2">
                                        {sketches.map((sketch) => (
                                            <button
                                                key={sketch.id}
                                                onClick={() => setSelectedSketch(sketch.id)}
                                                className={`w-full p-3 rounded-lg text-left transition-all duration-200 flex items-center gap-3 ${selectedSketch === sketch.id
                                                    ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                                                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                                    }`}
                                            >
                                                {sketch.icon}
                                                <div>
                                                    <div className="font-medium">{sketch.name}</div>
                                                    <div className="text-xs opacity-75">{sketch.description}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Controls */}
                                {currentSketch && (
                                    <div className="p-4 flex-1 overflow-y-auto">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-white font-semibold">Controls</h3>
                                            <button
                                                onClick={resetSketch}
                                                className="text-gray-400 hover:text-white transition-colors"
                                            >
                                                <ArrowPathIcon className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            {Object.entries(currentSketch.controls).map(([controlName, config]) => (
                                                <div key={controlName}>
                                                    <label className="block text-gray-300 text-sm font-medium mb-2 capitalize">
                                                        {controlName}: {controls[selectedSketch][controlName].toFixed(2)}
                                                    </label>
                                                    <input
                                                        type="range"
                                                        min={config.min}
                                                        max={config.max}
                                                        step={(config.max - config.min) / 100}
                                                        value={controls[selectedSketch][controlName]}
                                                        onChange={(e) => handleControlChange(controlName, parseFloat(e.target.value))}
                                                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="p-4 border-t border-white/10 space-y-3">
                                    <button
                                        onClick={saveScreenshot}
                                        className="w-full flex items-center justify-center gap-2 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                                    >
                                        <PhotoIcon className="w-4 h-4" />
                                        Save Image
                                    </button>
                                    <button
                                        onClick={toggleRecording}
                                        className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg transition-colors ${isRecording
                                            ? 'bg-red-500 text-white hover:bg-red-600'
                                            : 'bg-white/10 text-white hover:bg-white/20'
                                            }`}
                                    >
                                        <VideoCameraIcon className="w-4 h-4" />
                                        {isRecording ? 'Stop Recording' : 'Record Video'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Canvas Area */}
                    <div className="flex-1 relative">
                        {/* Canvas */}
                        <canvas
                            ref={canvasRef}
                            className="w-full h-full bg-slate-900 cursor-crosshair"
                            style={{ touchAction: 'none' }}
                        />

                        {/* Overlay Controls */}
                        <div className="absolute top-4 right-4 flex gap-2">
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

                        {/* Info Overlay */}
                        {!isPlaying && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                <div className="text-center text-white">
                                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
                                        <PlayIcon className="w-12 h-12" />
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2">Ready to Create</h2>
                                    <p className="text-gray-300 mb-6 max-w-md">
                                        Press play to start the live sketch. Adjust controls in the sidebar to modify the artwork in real-time.
                                    </p>
                                    <div className="flex gap-4 justify-center">
                                        <button
                                            onClick={() => setIsPlaying(true)}
                                            className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                                        >
                                            Start Sketching
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Performance Stats */}
                        {isPlaying && (
                            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white text-sm">
                                <div>Sketch: {currentSketch?.name}</div>
                                <div>Status: {isRecording ? 'Recording' : 'Live'}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #8b5cf6, #06b6d4);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #8b5cf6, #06b6d4);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        .slider::-webkit-slider-track {
          height: 8px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.2);
        }

        .slider::-moz-range-track {
          height: 8px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
        </>
    );
};

export default LiveSketchPage;