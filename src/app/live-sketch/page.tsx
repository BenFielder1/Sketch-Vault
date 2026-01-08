/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState, useEffect, useRef } from 'react';
import {
    PlayIcon,
    PauseIcon,
    ArrowPathIcon,
    Cog6ToothIcon,
    PhotoIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from '@heroicons/react/24/outline';
import Header from '@/components/Header';

const LiveSketchPage = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const [selectedSketch, setSelectedSketch] = useState('particles');
    const [showControls, setShowControls] = useState(true);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const timeRef = useRef<number>(0);

    // Sketch configurations
    const sketches = [
        {
            id: 'particles',
            name: 'Particle System',
            description: 'Interactive particle physics',
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
                </svg>
            ),
            color: 'var(--color-primary)',
            controls: {
                particleCount: { min: 50, max: 500, default: 200, label: 'Particle Count' },
                speed: { min: 0.1, max: 5, default: 1, label: 'Speed' },
                size: { min: 1, max: 10, default: 3, label: 'Size' }
            }
        },
        {
            id: 'waves',
            name: 'Wave Function',
            description: 'Sine wave harmonics',
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12c1.5-3 3-6 5-6s3.5 6 5 6 3.5-6 5-6 3.5 3 5 6" />
                </svg>
            ),
            color: 'var(--color-accent)',
            controls: {
                frequency: { min: 0.1, max: 5, default: 1, label: 'Frequency' },
                amplitude: { min: 10, max: 200, default: 100, label: 'Amplitude' },
                phase: { min: 0, max: 6.28, default: 0, label: 'Phase' },
                harmonics: { min: 1, max: 10, default: 3, label: 'Harmonics' }
            }
        },
        {
            id: 'fractal',
            name: 'Fractal Tree',
            description: 'Recursive branching',
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22v-8" />
                    <path d="M12 14l-4-4" />
                    <path d="M12 14l4-4" />
                    <path d="M8 10l-2-2" />
                    <path d="M8 10l2-2" />
                    <path d="M16 10l-2-2" />
                    <path d="M16 10l2-2" />
                </svg>
            ),
            color: 'var(--color-rose)',
            controls: {
                iterations: { min: 3, max: 10, default: 6, label: 'Iterations' },
                angle: { min: 0.1, max: 1.2, default: 0.4, label: 'Angle' },
                length: { min: 0.6, max: 0.85, default: 0.75, label: 'Length Ratio' },
                branches: { min: 2, max: 4, default: 2, label: 'Branches' },
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
        if (isPlaying && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;

            let animationId: number;

            const animate = () => {
                ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

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
        timeRef.current += 0.01;
        
        const sketchControls = controls[selectedSketch];

        switch (selectedSketch) {
            case 'particles':
                renderParticles(ctx, width, height, sketchControls);
                break;
            case 'waves':
                renderWaves(ctx, width, height, sketchControls);
                break;
            case 'fractal':
                renderFractal(ctx, width, height, sketchControls);
                break;
        }
    };

    const renderParticles = (ctx: CanvasRenderingContext2D, width: number, height: number, controls: any) => {
        ctx.fillStyle = '#F59E0B';

        for (let i = 0; i < controls.particleCount; i++) {
            const x = (Math.sin(timeRef.current * controls.speed + i) * width / 4) + width / 2;
            const y = (Math.cos(timeRef.current * controls.speed * 0.7 + i * 0.5) * height / 4) + height / 2;
            ctx.beginPath();
            ctx.arc(x, y, controls.size, 0, Math.PI * 2);
            ctx.fill();
        }
    };

    const renderWaves = (ctx: CanvasRenderingContext2D, width: number, height: number, controls: any) => {
        ctx.strokeStyle = '#14B8A6';
        ctx.lineWidth = 2;
        ctx.beginPath();

        for (let x = 0; x < width; x += 2) {
            let y = height / 2;
            for (let h = 1; h <= controls.harmonics; h++) {
                y += Math.sin((x * controls.frequency * h) / 50 + timeRef.current + controls.phase) * (controls.amplitude / h);
            }
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    };

    const renderFractal = (ctx: CanvasRenderingContext2D, width: number, height: number, controls: any) => {
        ctx.strokeStyle = '#F43F5E';
        ctx.lineWidth = 2;

        interface Branch {
            x1: number;
            y1: number;
            x2: number;
            y2: number;
            depth: number;
            generation: number;
        }

        const initialBranch: Branch = {
            x1: width / 2,
            y1: height - 50,
            x2: width / 2,
            y2: height - 150,
            depth: Math.min(controls.iterations, 10),
            generation: 0
        };

        let branches: Branch[] = [initialBranch];
        const maxBranches = 5000;
        let totalBranches = 0;

        while (branches.length > 0 && totalBranches < maxBranches) {
            const currentBranches = [...branches];
            branches = [];

            for (const branch of currentBranches) {
                ctx.beginPath();
                ctx.moveTo(branch.x1, branch.y1);
                ctx.lineTo(branch.x2, branch.y2);
                ctx.stroke();

                totalBranches++;

                if (branch.depth > 0) {
                    const angle = Math.atan2(branch.y2 - branch.y1, branch.x2 - branch.x1);
                    const currentLength = Math.sqrt((branch.x2 - branch.x1) ** 2 + (branch.y2 - branch.y1) ** 2);
                    const newLength = currentLength * controls.length;

                    if (newLength > 3) {
                        const numBranches = Math.min(controls.branches, 4);

                        for (let i = 0; i < numBranches; i++) {
                            const timeOffset = timeRef.current * 0.1 + branch.generation * 0.3;
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

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col">
            <Header />

            <div className="flex-1 flex pt-16">
                {/* Sidebar */}
                <div 
                    className={`${showControls ? 'w-80' : 'w-0'} transition-all duration-300 bg-[var(--color-bg-secondary)] border-r border-[var(--color-border)] flex flex-col overflow-hidden`}
                >
                    <div className={`w-80 flex flex-col h-full ${showControls ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
                        {/* Sidebar Header */}
                        <div className="p-4 border-b border-[var(--color-border)]">
                            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Controls</h2>
                        </div>

                        {/* Sketch Selection */}
                        <div className="p-4 border-b border-[var(--color-border)]">
                            <h3 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
                                Sketch Type
                            </h3>
                            <div className="space-y-2">
                                {sketches.map((sketch) => (
                                    <button
                                        key={sketch.id}
                                        onClick={() => setSelectedSketch(sketch.id)}
                                        className={`w-full p-3 rounded-xl text-left transition-all duration-200 flex items-center gap-3 ${
                                            selectedSketch === sketch.id
                                                ? 'bg-[var(--color-bg-elevated)] border-[var(--color-border-hover)]'
                                                : 'hover:bg-[var(--color-bg-elevated)]'
                                        } border border-[var(--color-border)]`}
                                        style={{
                                            borderColor: selectedSketch === sketch.id ? sketch.color : undefined,
                                        }}
                                    >
                                        <div 
                                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                                            style={{ 
                                                backgroundColor: `color-mix(in srgb, ${sketch.color} 15%, transparent)`,
                                                color: sketch.color 
                                            }}
                                        >
                                            {sketch.icon}
                                        </div>
                                        <div>
                                            <div className="font-medium text-[var(--color-text-primary)]">{sketch.name}</div>
                                            <div className="text-xs text-[var(--color-text-muted)]">{sketch.description}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Controls */}
                        {currentSketch && (
                            <div className="p-4 flex-1 overflow-y-auto">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                                        Parameters
                                    </h3>
                                    <button
                                        onClick={resetSketch}
                                        className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] transition-colors"
                                        title="Reset to defaults"
                                    >
                                        <ArrowPathIcon className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="space-y-5">
                                    {Object.entries(currentSketch.controls).map(([controlName, config]) => (
                                        <div key={controlName}>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="text-sm text-[var(--color-text-secondary)]">
                                                    {config.label}
                                                </label>
                                                <span className="text-sm font-mono text-[var(--color-text-muted)] bg-[var(--color-bg-elevated)] px-2 py-0.5 rounded">
                                                    {controls[selectedSketch][controlName].toFixed(2)}
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min={config.min}
                                                max={config.max}
                                                step={(config.max - config.min) / 100}
                                                value={controls[selectedSketch][controlName]}
                                                onChange={(e) => handleControlChange(controlName, parseFloat(e.target.value))}
                                                className="w-full h-2 bg-[var(--color-bg-elevated)] rounded-lg appearance-none cursor-pointer slider"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="p-4 border-t border-[var(--color-border)]">
                            <button
                                onClick={saveScreenshot}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
                            >
                                <PhotoIcon className="w-5 h-5" />
                                Save Screenshot
                            </button>
                        </div>
                    </div>
                </div>

                {/* Canvas Area */}
                <div className="flex-1 relative">
                    {/* Toggle Sidebar Button */}
                    <button
                        onClick={() => setShowControls(!showControls)}
                        className={`absolute top-4 z-20 p-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] transition-all ${
                            showControls ? 'left-4' : 'left-4'
                        }`}
                    >
                        {showControls ? (
                            <ChevronLeftIcon className="w-5 h-5" />
                        ) : (
                            <div className="flex items-center gap-2">
                                <Cog6ToothIcon className="w-5 h-5" />
                                <ChevronRightIcon className="w-4 h-4" />
                            </div>
                        )}
                    </button>

                    {/* Play/Pause Button */}
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`absolute top-4 right-4 z-20 p-3 rounded-xl backdrop-blur-sm transition-all duration-300 border ${
                            isPlaying
                                ? 'bg-[var(--color-rose)]/10 text-[var(--color-rose)] border-[var(--color-rose)]/30 hover:bg-[var(--color-rose)]/20'
                                : 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border-[var(--color-accent)]/30 hover:bg-[var(--color-accent)]/20'
                        }`}
                    >
                        {isPlaying ? (
                            <PauseIcon className="w-6 h-6" />
                        ) : (
                            <PlayIcon className="w-6 h-6" />
                        )}
                    </button>

                    {/* Canvas */}
                    <canvas
                        ref={canvasRef}
                        className="w-full h-full bg-[var(--color-bg-primary)] cursor-crosshair"
                        style={{ touchAction: 'none' }}
                    />

                    {/* Start Overlay */}
                    {!isStarted && (
                        <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg-primary)]/80 backdrop-blur-sm">
                            <div className="text-center max-w-md px-6">
                                <div 
                                    className="w-24 h-24 mx-auto mb-8 rounded-2xl flex items-center justify-center"
                                    style={{ 
                                        backgroundColor: `color-mix(in srgb, ${currentSketch?.color || 'var(--color-primary)'} 15%, transparent)` 
                                    }}
                                >
                                    <PlayIcon 
                                        className="w-12 h-12 ml-1" 
                                        style={{ color: currentSketch?.color || 'var(--color-primary)' }}
                                    />
                                </div>
                                <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4">
                                    Live Sketch Studio
                                </h2>
                                <p className="text-[var(--color-text-secondary)] mb-8 leading-relaxed">
                                    Create generative art in real-time. Adjust parameters in the sidebar 
                                    to modify the artwork as it renders.
                                </p>
                                <button
                                    onClick={() => { setIsPlaying(true); setIsStarted(true); }}
                                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-200 glow-amber"
                                    style={{ 
                                        backgroundColor: currentSketch?.color || 'var(--color-primary)',
                                        color: 'var(--color-bg-primary)'
                                    }}
                                >
                                    Start Creating
                                    <PlayIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Status indicator */}
                    {isPlaying && (
                        <div className="absolute bottom-4 left-4 flex items-center gap-3 px-4 py-2 rounded-lg bg-[var(--color-bg-secondary)]/90 backdrop-blur-sm border border-[var(--color-border)]">
                            <span 
                                className="w-2 h-2 rounded-full animate-pulse"
                                style={{ backgroundColor: currentSketch?.color || 'var(--color-primary)' }}
                            />
                            <span className="text-sm text-[var(--color-text-secondary)]">
                                {currentSketch?.name}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LiveSketchPage;
