"use client";
import { useEffect, useRef, useState } from 'react';
import dynamic from "next/dynamic";
import { usePathname } from 'next/navigation';

import PF from "pathfinding";
import p5 from 'p5';

import SketchHeader from '@/components/sketches/SketchHeader';
import { sketchControls } from '@/data/sketchData';
import Controls from '@/components/sketches/Controls';
import PauseButton from '@/components/sketches/PauseButton';
import InfoPanel from '@/components/sketches/InfoPanel';

const Sketch = dynamic(() => import("react-p5").then(mod => mod.default), {
    ssr: false
});

const SnakeAIPage = () => {
    const [isPlaying, setIsPlaying] = useState(true);
    const [controls, setControls] = useState({
        gameSpeed: 10,
        showGrid: true,
        showPath: false,
        autoRestart: true
    });

    const gameStateRef = useRef({
        snakeX: [5, 4, 3, 2, 1],
        snakeY: [1, 1, 1, 1, 1],
        direction: "r",
        appleCaught: true,
        appleX: 0,
        appleY: 0,
        score: 0,
        isDead: false,
        width1: 0,
        height1: 0,
        lastDirection: "r",
        lastActualDirection: "d",
        taken: true,
        grid: [] as number[][],
        usefulGrid: new PF.Grid([[]]),
        finder: new PF.AStarFinder(),
        path: null as number[][] | null,
        p5Instance: null as p5 | null,
        gameStarted: false
    });

    const pathname = usePathname();

    useEffect(() => {
        const gameState = gameStateRef.current;
        if (gameState.p5Instance && gameState.gameStarted) {
            if (isPlaying) {
                gameState.p5Instance.loop();
            } else {
                gameState.p5Instance.noLoop();
            }
        }
    }, [isPlaying]);

    const initializeGrid = (): void => {
        const { width1, height1 } = gameStateRef.current;
        gameStateRef.current.grid = [];
        for (let y = 0; y < height1; y++) {
            gameStateRef.current.grid.push([]);
            for (let x = 0; x < width1; x++) {
                gameStateRef.current.grid[y].push(0);
            }
        }
    };

    const setup = (p5: p5, canvasParentRef: Element) => {
        const parentElement = canvasParentRef.parentElement;
        gameStateRef.current.width1 = Math.floor((parentElement?.clientWidth ?? 600) / 20);
        gameStateRef.current.height1 = Math.floor((parentElement?.clientHeight ?? 400) / 20);

        gameStateRef.current.p5Instance = p5;
        gameStateRef.current.gameStarted = true;

        p5.createCanvas(gameStateRef.current.width1 * 20, gameStateRef.current.height1 * 20).parent(canvasParentRef);

        initializeGrid();

        if (isPlaying) {
            p5.loop();
        } else {
            p5.noLoop();
        }
    };

    const draw = (p5: p5) => {
        const gameState = gameStateRef.current;

        // Dark background matching our theme
        p5.background(10, 10, 10);

        initializeGrid();

        if (controls.showGrid) {
            p5.stroke(30, 30, 30);
            for (let x = 0; x < p5.width; x += 20) {
                p5.line(x, 0, x, p5.height);
            }
            for (let y = 0; y < p5.height; y += 20) {
                p5.line(0, y, p5.width, y);
            }
        }

        if (gameState.snakeX[0] === gameState.appleX && gameState.snakeY[0] === gameState.appleY) {
            gameState.appleCaught = true;
            gameState.taken = true;
            gameState.score++;
            gameState.snakeX.push(gameState.snakeX[gameState.snakeX.length - 1]);
            gameState.snakeY.push(gameState.snakeY[gameState.snakeY.length - 1]);
        }

        // Snake head - using our primary amber color
        p5.fill(245, 158, 11);
        p5.noStroke();
        p5.rect(gameState.snakeX[0] * 20 + 1, gameState.snakeY[0] * 20 + 1, 18, 18, 4);

        // Snake body - slightly darker amber
        p5.fill(217, 119, 6);
        for (let x = 1; x < gameState.snakeX.length; x++) {
            p5.rect(gameState.snakeX[x] * 20 + 1, gameState.snakeY[x] * 20 + 1, 18, 18, 4);
            gameState.grid[gameState.snakeY[x]][gameState.snakeX[x]] = 1;
        }

        if (gameState.appleCaught) {
            while (gameState.taken) {
                gameState.appleX = Math.floor(Math.random() * (gameState.width1 - 4)) + 2;
                gameState.appleY = Math.floor(Math.random() * (gameState.height1 - 4)) + 2;
                if (gameState.grid[gameState.appleY][gameState.appleX] === 1) {
                    // Position already taken, try again
                } else {
                    gameState.usefulGrid = new PF.Grid(gameState.grid);
                    gameState.path = gameState.finder.findPath(
                        gameState.snakeX[0],
                        gameState.snakeY[0],
                        gameState.appleX,
                        gameState.appleY,
                        gameState.usefulGrid
                    );
                    gameState.taken = false;
                }
            }
            gameState.appleCaught = false;
        }

        // Apple - using our accent teal color
        p5.fill(20, 184, 166);
        p5.rect(gameState.appleX * 20 + 1, gameState.appleY * 20 + 1, 18, 18, 4);

        // Draw path if enabled - using rose color
        if (controls.showPath && gameState.path) {
            p5.stroke(244, 63, 94);
            p5.strokeWeight(2);
            for (let i = 0; i < gameState.path.length - 1; i++) {
                const x1 = gameState.path[i][0] * 20 + 10;
                const y1 = gameState.path[i][1] * 20 + 10;
                const x2 = gameState.path[i + 1][0] * 20 + 10;
                const y2 = gameState.path[i + 1][1] * 20 + 10;
                p5.line(x1, y1, x2, y2);
            }
            p5.strokeWeight(1);
            p5.noStroke();
        }

        // Check wall collision
        if (gameState.snakeX[0] < 0 || gameState.snakeX[0] >= gameState.width1 ||
            gameState.snakeY[0] < 0 || gameState.snakeY[0] >= gameState.height1) {
            gameState.isDead = true;
        }

        // Check self collision
        for (let i = 1; i < gameState.snakeX.length; i++) {
            if (gameState.snakeX[i] === gameState.snakeX[0] && gameState.snakeY[i] === gameState.snakeY[0]) {
                gameState.isDead = true;
            }
        }

        // Draw score
        p5.fill(250, 250, 249);
        p5.textSize(16);
        p5.textFont('DM Sans');
        p5.text("Score: " + gameState.score, 16, 28);

        // Handle game over
        if (gameState.isDead) {
            if (controls.autoRestart) {
                resetGame();
            } else {
                p5.fill(245, 158, 11);
                p5.textSize(18);
                p5.textAlign(p5.CENTER);
                p5.text("Game Over - Press Space to Restart", gameState.width1 * 10, gameState.height1 * 10);
                p5.textAlign(p5.LEFT);
                // Don't continue game logic when dead
                return;
            }
        }

        // AI pathfinding and movement (only when not dead)
        if (!gameState.isDead) {
            gameState.usefulGrid = new PF.Grid(gameState.grid);
            gameState.path = gameState.finder.findPath(
                gameState.snakeX[0],
                gameState.snakeY[0],
                gameState.appleX,
                gameState.appleY,
                gameState.usefulGrid
            );

            checkDirection();
            checkForWallCollision();
            checkForBodyCollision();
            moveSnake(gameState.path);
        }

        // Set frame rate based on game speed
        p5.frameRate(controls.gameSpeed);
    };

    // Add keyPressed function to handle space key
    const keyPressed = (p5: p5) => {
        if (p5.keyCode === 32) { // Space key
            resetGame();
        }
    };

    // Game logic functions
    const moveSnake = (path: number[][] | null): void => {
        const gameState = gameStateRef.current;

        for (let i = gameState.snakeX.length - 1; i > 0; i--) {
            gameState.snakeX[i] = gameState.snakeX[i - 1];
        }
        for (let i = gameState.snakeY.length - 1; i > 0; i--) {
            gameState.snakeY[i] = gameState.snakeY[i - 1];
        }

        if (path === null || path.length < 2) {
            if (gameState.direction === "r") {
                gameState.snakeX[0] = gameState.snakeX[0] + 1;
            } else if (gameState.direction === "l") {
                gameState.snakeX[0] = gameState.snakeX[0] - 1;
            } else if (gameState.direction === "u") {
                gameState.snakeY[0] = gameState.snakeY[0] - 1;
            } else if (gameState.direction === "d") {
                gameState.snakeY[0] = gameState.snakeY[0] + 1;
            }
        } else {
            gameState.snakeX[0] = path[1][0];
            gameState.snakeY[0] = path[1][1];
        }
    };

    const resetGame = (): void => {
        const gameState = gameStateRef.current;
        gameState.snakeX = [5, 4, 3, 2, 1];
        gameState.snakeY = [1, 1, 1, 1, 1];
        gameState.direction = "r";
        gameState.appleCaught = true;
        gameState.appleX = 0;
        gameState.appleY = 0;
        gameState.score = 0;
        gameState.isDead = false;
        gameState.taken = true;
        gameState.lastDirection = "r";
        gameState.lastActualDirection = "d";

        // Ensure game is playing after reset
        setIsPlaying(true);
        if (gameState.p5Instance) {
            gameState.p5Instance.loop();
        }
    };

    const checkDirection = (): void => {
        const gameState = gameStateRef.current;
        if (gameState.snakeX[0] < gameState.appleX) {
            if (gameState.direction !== "l") {
                gameState.lastDirection = gameState.direction;
                gameState.direction = "r";
            }
        } else if (gameState.snakeX[0] > gameState.appleX) {
            if (gameState.direction !== "r") {
                gameState.lastDirection = gameState.direction;
                gameState.direction = "l";
            }
        } else if (gameState.snakeY[0] < gameState.appleY) {
            if (gameState.direction !== "u") {
                gameState.lastDirection = gameState.direction;
                gameState.direction = "d";
            }
        } else if (gameState.snakeY[0] > gameState.appleY) {
            if (gameState.direction !== "d") {
                gameState.lastDirection = gameState.direction;
                gameState.direction = "u";
            }
        }
        if (gameState.lastDirection !== gameState.direction) {
            gameState.lastActualDirection = gameState.lastDirection;
        }
    };

    const checkForWallCollision = (): void => {
        const gameState = gameStateRef.current;
        if (gameState.direction === "r") {
            if (gameState.snakeX[0] + 1 >= gameState.width1) {
                gameState.lastDirection = gameState.direction;
                if (gameState.snakeY[0] + 1 >= gameState.height1) {
                    gameState.direction = "u";
                } else if (gameState.snakeY[0] - 1 < 0) {
                    gameState.direction = "d";
                } else {
                    gameState.direction = gameState.lastActualDirection;
                }
            }
        }
        // Add similar logic for other directions...
        if (gameState.direction === "l") {
            if (gameState.snakeX[0] - 1 < 0) {
                gameState.lastDirection = gameState.direction;
                if (gameState.snakeY[0] + 1 >= gameState.height1) {
                    gameState.direction = "u";
                } else if (gameState.snakeY[0] - 1 < 0) {
                    gameState.direction = "d";
                } else {
                    gameState.direction = gameState.lastActualDirection;
                }
            }
        }
        if (gameState.direction === "u") {
            if (gameState.snakeY[0] - 1 < 0) {
                gameState.lastDirection = gameState.direction;
                if (gameState.snakeX[0] + 1 >= gameState.width1) {
                    gameState.direction = "l";
                } else if (gameState.snakeX[0] - 1 < 0) {
                    gameState.direction = "r";
                } else {
                    gameState.direction = gameState.lastActualDirection;
                }
            }
        }
        if (gameState.direction === "d") {
            if (gameState.snakeY[0] + 1 >= gameState.height1) {
                gameState.lastDirection = gameState.direction;
                if (gameState.snakeX[0] + 1 >= gameState.width1) {
                    gameState.direction = "l";
                } else if (gameState.snakeX[0] - 1 < 0) {
                    gameState.direction = "r";
                } else {
                    gameState.direction = gameState.lastActualDirection;
                }
            }
        }
        if (gameState.lastDirection !== gameState.direction) {
            gameState.lastActualDirection = gameState.lastDirection;
        }
    };

    const checkForBodyCollision = (): void => {
        const gameState = gameStateRef.current;
        for (let i = 0; i < gameState.snakeX.length; i++) {
            if (gameState.direction === "r") {
                if (gameState.snakeX[0] + 1 === gameState.snakeX[i] && gameState.snakeY[0] === gameState.snakeY[i]) {
                    gameState.lastDirection = gameState.direction;
                    if (gameState.snakeY[0] + 1 === gameState.snakeY[i] && gameState.snakeX[0] === gameState.snakeX[i]) {
                        gameState.direction = "u";
                    } else if (gameState.snakeY[0] - 1 === gameState.snakeY[i] && gameState.snakeX[0] === gameState.snakeX[i]) {
                        gameState.direction = "d";
                    } else {
                        gameState.direction = gameState.lastActualDirection;
                    }
                }
            }
            // Add similar logic for other directions (keeping original implementation)...
            if (gameState.direction === "l") {
                if (gameState.snakeX[0] - 1 === gameState.snakeX[i] && gameState.snakeY[0] === gameState.snakeY[i]) {
                    gameState.lastDirection = gameState.direction;
                    if (gameState.snakeY[0] + 1 === gameState.snakeY[i] && gameState.snakeX[0] === gameState.snakeX[i]) {
                        gameState.direction = "u";
                    } else if (gameState.snakeY[0] - 1 === gameState.snakeY[i] && gameState.snakeX[0] === gameState.snakeX[i]) {
                        gameState.direction = "d";
                    } else {
                        gameState.direction = gameState.lastActualDirection;
                    }
                }
            }
            if (gameState.direction === "u") {
                if (gameState.snakeY[0] - 1 === gameState.snakeY[i] && gameState.snakeX[0] === gameState.snakeX[i]) {
                    gameState.lastDirection = gameState.direction;
                    if (gameState.snakeX[0] + 1 === gameState.snakeX[i] && gameState.snakeY[0] === gameState.snakeY[i]) {
                        gameState.direction = "l";
                    } else if (gameState.snakeX[0] - 1 === gameState.snakeX[i] && gameState.snakeY[0] === gameState.snakeY[i]) {
                        gameState.direction = "r";
                    } else {
                        gameState.direction = gameState.lastActualDirection;
                    }
                }
            }
            if (gameState.direction === "d") {
                if (gameState.snakeY[0] + 1 === gameState.snakeY[i] && gameState.snakeX[0] === gameState.snakeX[i]) {
                    gameState.lastDirection = gameState.direction;
                    if (gameState.snakeX[0] + 1 === gameState.snakeX[i] && gameState.snakeY[0] === gameState.snakeY[i]) {
                        gameState.direction = "l";
                    } else if (gameState.snakeX[0] - 1 === gameState.snakeX[i] && gameState.snakeY[0] === gameState.snakeY[i]) {
                        gameState.direction = "r";
                    } else {
                        gameState.direction = gameState.lastActualDirection;
                    }
                }
            }
        }
        if (gameState.lastDirection !== gameState.direction) {
            gameState.lastActualDirection = gameState.lastDirection;
            checkForWallCollision();
        }
    };

    const handleControlChange = (key: string, value: number | boolean) => {
        setControls(prev => ({ ...prev, [key]: value }));
    };

    const saveScreenshot = () => {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            const link = document.createElement('a');
            link.download = `snake-ai-${Date.now()}.png`;
            link.href = canvas.toDataURL();
            link.click();
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col">
            <SketchHeader title="Snake AI" />

            <div className="flex h-full flex-1">
                <Controls
                    sliders={sketchControls.filter(s => pathname.includes(s.name))[0].controlSliders}
                    toggles={sketchControls.filter(s => pathname.includes(s.name))[0].controlToggles}
                    handleControlChange={handleControlChange}
                    resetGame={resetGame}
                    saveScreenshot={saveScreenshot}
                />

                <div className="flex-1 relative">
                    <div className="w-full h-full">
                        <Sketch setup={setup} draw={draw} keyPressed={keyPressed} />
                    </div>

                    <PauseButton isPlaying={isPlaying} setIsPlaying={setIsPlaying} />

                    <InfoPanel
                        title="Snake AI"
                        text="This snake uses an A* pathfinding algorithm to find the optimal route to food."
                        controls="Press Space to restart game"
                    />
                </div>
            </div>
        </div>
    );
};

export default SnakeAIPage;
