"use client";
import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
    ArrowLeftIcon,
    PlayIcon,
    PauseIcon,
    ArrowPathIcon,
    Cog6ToothIcon,
    PhotoIcon
} from '@heroicons/react/24/outline';

interface PlanetData {
    name: string;
    size: number;
    color: string;
    distance: number;
    speed: number;
    tilt: number;
    rings?: boolean;
}

const SnakePage = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const animationIdRef = useRef<number | null>(null);

    const [isPlaying, setIsPlaying] = useState(true);
    const [showControls, setShowControls] = useState(true);
    const [controls, setControls] = useState({
        timeSpeed: 1,
        planetScale: 1,
        orbitSpeed: 1,
        showOrbits: true,
        showStars: true,
        cameraAutoRotate: false,
        sunIntensity: 1
    });

    // Update controls effect
    useEffect(() => {

    }, []);

    const handleControlChange = (key: string, value: number | boolean) => {
        setControls(prev => ({ ...prev, [key]: value }));
    };

    const saveScreenshot = () => {
        if (rendererRef.current) {
            const link = document.createElement('a');
            link.download = `snake-${Date.now()}.png`;
            link.href = rendererRef.current.domElement.toDataURL();
            link.click();
        }
    };

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900  flex flex-col">
                {/* Header */}
                <header className="relative z-20 px-6 py-4 bg-black/20 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <Link href="/gallery" className="flex items-center space-x-2 text-white hover:text-purple-300 transition-colors">
                            <ArrowLeftIcon className="w-5 h-5" />
                            <span>Back to Gallery</span>
                        </Link>
                        <h1 className="text-xl font-bold text-white">Snake AI</h1>
                        <div className="w-24"></div> {/* Spacer for centering */}
                    </div>
                </header>

                <div className="flex h-full flex-1">
                    {/* Controls Sidebar */}
                    <div className={`${showControls ? 'w-80' : 'w-16'} transition-all duration-300 bg-black/40 backdrop-blur-sm border-r border-white/10 flex flex-col`}>
                        <button
                            onClick={() => setShowControls(!showControls)}
                            className="p-4 text-white hover:bg-white/10 transition-colors"
                        >
                            <Cog6ToothIcon className="w-6 h-6" />
                        </button>

                        {showControls && (
                            <>
                                <div className="p-4 flex-1 overflow-y-auto">
                                    <h3 className="text-white font-semibold mb-4">Animation Controls</h3>

                                    <div className="space-y-6">
                                        <ControlSlider
                                            label="Time Speed"
                                            value={controls.timeSpeed}
                                            min={0}
                                            max={5}
                                            step={0.1}
                                            onChange={(value) => handleControlChange('timeSpeed', value)}
                                        />

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
                                            max={3}
                                            step={0.1}
                                            onChange={(value) => handleControlChange('orbitSpeed', value)}
                                        />

                                        <ControlSlider
                                            label="Sun Intensity"
                                            value={controls.sunIntensity}
                                            min={0.1}
                                            max={2}
                                            step={0.1}
                                            onChange={(value) => handleControlChange('sunIntensity', value)}
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

                                        <ControlToggle
                                            label="Auto Rotate Camera"
                                            value={controls.cameraAutoRotate}
                                            onChange={(value) => handleControlChange('cameraAutoRotate', value)}
                                        />
                                    </div>
                                </div>

                                {/* <div className="p-4 border-t border-white/10 space-y-3">
                                    <button
                                        onClick={saveScreenshot}
                                        className="w-full flex items-center justify-center gap-2 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                                    >
                                        <PhotoIcon className="w-4 h-4" />
                                        Save Screenshot
                                    </button>
                                </div> */}
                            </>
                        )}
                    </div>

                    {/* 3D Scene */}
                    <div className="flex-1 relative">
                        <div className="w-full h-full" id="app">
                            <Snake />
                        </div>

                        {/* Play/Pause Button */}
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

                        {/* Info Panel */}
                        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white max-w-xs">
                            <h3 className="font-semibold mb-2">Snake AI</h3>
                            <p className="text-sm text-gray-300 mb-2">
                                This snake uses an A* routing algorithm to find the shortest path to the food.
                                It continuously updates its path as it moves, allowing it to navigate around obstacles.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// Control Components
const ControlSlider = ({
    label,
    value,
    min,
    max,
    step,
    onChange
}: {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (value: number) => void;
}) => (
    <div>
        <label className="block text-gray-300 text-sm font-medium mb-2">
            {label}: {value.toFixed(1)}
        </label>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
        />
    </div>
);

const ControlToggle = ({
    label,
    value,
    onChange
}: {
    label: string;
    value: boolean;
    onChange: (value: boolean) => void;
}) => (
    <div className="flex items-center justify-between">
        <label className="text-gray-300 text-sm font-medium">{label}</label>
        <button
            onClick={() => onChange(!value)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-gradient-to-r from-purple-500 to-cyan-500' : 'bg-white/20'
                }`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'
                    }`}
            />
        </button>
    </div>
);

export default SnakePage;




import dynamic from "next/dynamic"

const Sketch = dynamic(() => import("react-p5").then(mod => mod.default), {
    ssr: false
});

import PF from "pathfinding";

// TypeScript interfaces
interface P5Instance {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createCanvas: (width: number, height: number) => any;
    background: (color: number) => void;
    stroke: (color: number) => void;
    fill: (r: number, g: number, b: number) => void;
    line: (x1: number, y1: number, x2: number, y2: number) => void;
    square: (x: number, y: number, size: number) => void;
    textSize: (size: number) => void;
    text: (text: string, x: number, y: number) => void;
    noLoop: () => void;
    loop: () => void;
    frameRate: (rate: number) => void;
    width: number;
    height: number;
    keyCode: number;
}

// Game state and variables
let snakeX: number[] = [5, 4, 3, 2, 1];
let snakeY: number[] = [1, 1, 1, 1, 1];
let direction: string = "r";
let appleCaught: boolean = true;
let appleX: number = 0;
let appleY: number = 0;
let score: number = 0;
let isDead: boolean = false;
let width1: number = 0;
let height1: number = 0;
let lastDirection: string = "r";
let lastActualDirection: string = "d";
let taken: boolean = true;

let grid: number[][] = [];
let usefulGrid: PF.Grid;
const finder: PF.AStarFinder = new PF.AStarFinder();
let path: number[][] | null;

const Snake: React.FC = () => {
    const [isBrowser, setIsBrowser] = useState(false);

    useEffect(() => {
        setIsBrowser(true);
        // Initialize dimensions based on browser window
        width1 = Math.floor((document.getElementById("app")?.parentElement?.clientWidth ?? 10) / 20);
        height1 = Math.floor((document.getElementById("app")?.parentElement?.clientHeight ?? 15) / 20);

        // Initialize grid
        initializeGrid();
    }, []);

    // Initialize the grid
    const initializeGrid = (): void => {
        grid = [];
        for (let y = 0; y < height1; y++) {
            grid.push([]);
            for (let x = 0; x < width1; x++) {
                grid[y].push(0);
            }
        }
    };

    const setup = (p5: P5Instance, canvasParentRef: Element) => {
        p5.createCanvas(width1 * 20, height1 * 20).parent(canvasParentRef);
    };

    const draw = (p5: P5Instance) => {
        p5.background(220);

        // Reset grid
        initializeGrid();

        p5.stroke(0);
        for (let x = 0; x < p5.width; x += 20) {
            p5.line(x, 0, x, p5.height);
        }
        for (let y = 0; y < p5.height; y += 20) {
            p5.line(0, y, p5.width, y);
        }

        if (snakeX[0] === appleX && snakeY[0] === appleY) {
            appleCaught = true;
            taken = true;
            score++;
            snakeX.push(snakeX[snakeX.length - 1]);
            snakeY.push(snakeY[snakeY.length - 1]);
        }

        p5.fill(255, 0, 0);
        p5.square(snakeX[0] * 20, snakeY[0] * 20, 20);
        for (let x = 1; x < snakeX.length; x++) {
            p5.square(snakeX[x] * 20, snakeY[x] * 20, 20);
            grid[snakeY[x]][snakeX[x]] = 1;
        }

        p5.fill(0, 255, 0);
        if (appleCaught) {
            while (taken) {
                appleX = Math.floor(Math.random() * (width1 - 4)) + 2;
                appleY = Math.floor(Math.random() * (height1 - 4)) + 2;
                if (grid[appleY][appleX] === 1) {
                    // Position already taken, try again
                }
                else {
                    usefulGrid = new PF.Grid(grid);
                    path = finder.findPath(snakeX[0], snakeY[0], appleX, appleY, usefulGrid);
                    if (path.length > 2) {
                        taken = false;
                    }
                }
            }
            appleCaught = false;
        }
        p5.square(appleX * 20, appleY * 20, 20);

        if (snakeX[0] < 0 || snakeX[0] >= width1 || snakeY[0] < 0 || snakeY[0] >= height1) {
            isDead = true;
            p5.noLoop();
        }

        for (let i = 1; i < snakeX.length; i++) {
            if (snakeX[i] === snakeX[0] && snakeY[i] === snakeY[0]) {
                isDead = true;
                p5.noLoop();
            }
        }

        p5.fill(0, 0, 255);
        p5.textSize(32);
        p5.text("Score " + score, 20, 40);

        // Implementing pathfinding library
        usefulGrid = new PF.Grid(grid);
        path = finder.findPath(snakeX[0], snakeY[0], appleX, appleY, usefulGrid);

        checkDirection();
        checkForWallCollision();
        checkForBodyCollision();
        moveSnake(path);

        if (isDead) {
            p5.fill(255, 255, 0);
            p5.textSize(20);
            p5.text("You died, hit space to play again", 150, 300);
            console.log(direction);
            console.log(lastDirection);
            console.log(lastActualDirection);
            reset();
        }

        p5.frameRate(60);

        if (p5.keyCode === 32) { // Space key
            if (isDead) {
                isDead = false;
                p5.loop();
            }
        }
    };

    // If not in browser, don"t render the sketch
    if (!isBrowser) {
        return (
            <div>
                <div className="App">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="App">
                <Sketch setup={setup} draw={draw} />
            </div>
        </div>
    );
};

function moveSnake(path: number[][] | null): void {
    for (let i = snakeX.length - 1; i > 0; i--) {
        snakeX[i] = snakeX[i - 1];
    }
    for (let i = snakeY.length - 1; i > 0; i--) {
        snakeY[i] = snakeY[i - 1];
    }

    if (path === null || path.length < 2) {
        if (direction === "r") {
            snakeX[0] = snakeX[0] + 1;
        }
        else if (direction === "l") {
            snakeX[0] = snakeX[0] - 1;
        }
        else if (direction === "u") {
            snakeY[0] = snakeY[0] - 1;
        }
        else if (direction === "d") {
            snakeY[0] = snakeY[0] + 1;
        }
    }
    else {
        snakeX[0] = path[1][0];
        snakeY[0] = path[1][1];
    }
}

function reset(): void {
    snakeX = [5, 4, 3, 2, 1];
    snakeY = [1, 1, 1, 1, 1];
    direction = "r";
    appleCaught = true;
    appleX = 0;
    appleY = 0;
    score = 0;
}

function checkDirection(): void {
    if (snakeX[0] < appleX) {
        if (direction !== "l") {
            lastDirection = direction;
            direction = "r";
        }
    }
    else if (snakeX[0] > appleX) {
        if (direction !== "r") {
            lastDirection = direction;
            direction = "l";
        }
    }
    else if (snakeY[0] < appleY) {
        if (direction !== "u") {
            lastDirection = direction;
            direction = "d";
        }
    }
    else if (snakeY[0] > appleY) {
        if (direction !== "d") {
            lastDirection = direction;
            direction = "u";
        }
    }
    if (lastDirection !== direction) {
        lastActualDirection = lastDirection;
    }
}

function checkForWallCollision(): void {
    if (direction === "r") {
        if (snakeX[0] + 1 >= width1) {
            lastDirection = direction;
            if (snakeY[0] + 1 >= height1) {
                direction = "u";
            }
            else if (snakeY[0] - 1 < 0) {
                direction = "d";
            }
            else {
                direction = lastActualDirection;
            }
        }
    }
    if (direction === "l") {
        if (snakeX[0] - 1 < 0) {
            lastDirection = direction;
            if (snakeY[0] + 1 >= height1) {
                direction = "u";
            }
            else if (snakeY[0] - 1 < 0) {
                direction = "d";
            }
            else {
                direction = lastActualDirection;
            }
        }
    }
    if (direction === "u") {
        if (snakeY[0] - 1 < 0) {
            lastDirection = direction;
            if (snakeX[0] + 1 >= width1) {
                direction = "l";
            }
            else if (snakeX[0] - 1 < 0) {
                direction = "r";
            }
            else {
                direction = lastActualDirection;
            }
        }
    }
    if (direction === "d") {
        if (snakeY[0] + 1 >= height1) {
            lastDirection = direction;
            if (snakeX[0] + 1 >= width1) {
                direction = "l";
            }
            else if (snakeX[0] - 1 < 0) {
                direction = "r";
            }
            else {
                direction = lastActualDirection;
            }
        }
    }
    if (lastDirection !== direction) {
        lastActualDirection = lastDirection;
    }
}

function checkForBodyCollision(): void {
    for (let i = 0; i < snakeX.length; i++) {
        if (direction === "r") {
            if (snakeX[0] + 1 === snakeX[i] && snakeY[0] === snakeY[i]) {
                lastDirection = direction;
                if (snakeY[0] + 1 === snakeY[i] && snakeX[0] === snakeX[i]) {
                    direction = "u";
                }
                else if (snakeY[0] - 1 === snakeY[i] && snakeX[0] === snakeX[i]) {
                    direction = "d";
                }
                else {
                    direction = lastActualDirection;
                }
            }
        }
        if (direction === "l") {
            if (snakeX[0] - 1 === snakeX[i] && snakeY[0] === snakeY[i]) {
                lastDirection = direction;
                if (snakeY[0] + 1 === snakeY[i] && snakeX[0] === snakeX[i]) {
                    direction = "u";
                }
                else if (snakeY[0] - 1 === snakeY[i] && snakeX[0] === snakeX[i]) {
                    direction = "d";
                }
                else {
                    direction = lastActualDirection;
                }
            }
        }
        if (direction === "u") {
            if (snakeY[0] - 1 === snakeY[i] && snakeX[0] === snakeX[i]) {
                lastDirection = direction;
                if (snakeX[0] + 1 === snakeX[i] && snakeY[0] === snakeY[i]) {
                    direction = "l";
                }
                else if (snakeX[0] - 1 === snakeX[i] && snakeY[0] === snakeY[i]) {
                    direction = "r";
                }
                else {
                    direction = lastActualDirection;
                }
            }
        }
        if (direction === "d") {
            if (snakeY[0] + 1 === snakeY[i] && snakeX[0] === snakeX[i]) {
                lastDirection = direction;
                if (snakeX[0] + 1 === snakeX[i] && snakeY[0] === snakeY[i]) {
                    direction = "l";
                }
                else if (snakeX[0] - 1 === snakeX[i] && snakeY[0] === snakeY[i]) {
                    direction = "r";
                }
                else {
                    direction = lastActualDirection;
                }
            }
        }
    }
    if (lastDirection !== direction) {
        lastActualDirection = lastDirection;
        checkForWallCollision();
    }
}