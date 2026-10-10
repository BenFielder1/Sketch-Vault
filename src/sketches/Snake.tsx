"use client";
import { useEffect, useRef } from "react";
import p5 from "p5";
import PF from "pathfinding";

import { useLatest, useSignal } from "@/lib/hooks";
import { SketchProps, STAGE } from "./types";

const CELL = 20;

type Direction = "r" | "l" | "u" | "d";

interface GameState {
    snakeX: number[];
    snakeY: number[];
    direction: Direction;
    lastDirection: Direction;
    lastActualDirection: Direction;
    appleCaught: boolean;
    appleX: number;
    appleY: number;
    taken: boolean;
    score: number;
    best: number;
    isDead: boolean;
    cols: number;
    rows: number;
    grid: number[][];
    path: number[][] | null;
}

const freshGame = (cols: number, rows: number, best: number): GameState => ({
    snakeX: [5, 4, 3, 2, 1],
    snakeY: [1, 1, 1, 1, 1],
    direction: "r",
    lastDirection: "r",
    lastActualDirection: "d",
    appleCaught: true,
    appleX: 0,
    appleY: 0,
    taken: true,
    score: 0,
    best,
    isDead: false,
    cols,
    rows,
    grid: [],
    path: null,
});

const finder = new PF.AStarFinder();

// --- Steering fallbacks, used when A* can't find a route ---

function checkDirection(g: GameState) {
    if (g.snakeX[0] < g.appleX) {
        if (g.direction !== "l") {
            g.lastDirection = g.direction;
            g.direction = "r";
        }
    } else if (g.snakeX[0] > g.appleX) {
        if (g.direction !== "r") {
            g.lastDirection = g.direction;
            g.direction = "l";
        }
    } else if (g.snakeY[0] < g.appleY) {
        if (g.direction !== "u") {
            g.lastDirection = g.direction;
            g.direction = "d";
        }
    } else if (g.snakeY[0] > g.appleY) {
        if (g.direction !== "d") {
            g.lastDirection = g.direction;
            g.direction = "u";
        }
    }
    if (g.lastDirection !== g.direction) g.lastActualDirection = g.lastDirection;
}

function checkForWallCollision(g: GameState) {
    const [x, y] = [g.snakeX[0], g.snakeY[0]];
    const turnVertical = () => (y + 1 >= g.rows ? "u" : y - 1 < 0 ? "d" : g.lastActualDirection);
    const turnHorizontal = () => (x + 1 >= g.cols ? "l" : x - 1 < 0 ? "r" : g.lastActualDirection);

    if (g.direction === "r" && x + 1 >= g.cols) {
        g.lastDirection = g.direction;
        g.direction = turnVertical();
    }
    if (g.direction === "l" && x - 1 < 0) {
        g.lastDirection = g.direction;
        g.direction = turnVertical();
    }
    if (g.direction === "u" && y - 1 < 0) {
        g.lastDirection = g.direction;
        g.direction = turnHorizontal();
    }
    if (g.direction === "d" && y + 1 >= g.rows) {
        g.lastDirection = g.direction;
        g.direction = turnHorizontal();
    }
    if (g.lastDirection !== g.direction) g.lastActualDirection = g.lastDirection;
}

function checkForBodyCollision(g: GameState) {
    const hx = g.snakeX[0];
    const hy = g.snakeY[0];
    const occupied = (x: number, y: number) => g.snakeX.some((sx, i) => sx === x && g.snakeY[i] === y);

    for (let i = 0; i < g.snakeX.length; i++) {
        const bx = g.snakeX[i];
        const by = g.snakeY[i];
        const blockedAhead =
            (g.direction === "r" && hx + 1 === bx && hy === by) ||
            (g.direction === "l" && hx - 1 === bx && hy === by) ||
            (g.direction === "u" && hy - 1 === by && hx === bx) ||
            (g.direction === "d" && hy + 1 === by && hx === bx);
        if (!blockedAhead) continue;

        g.lastDirection = g.direction;
        if (g.direction === "r" || g.direction === "l") {
            g.direction = occupied(hx, hy + 1) ? "u" : occupied(hx, hy - 1) ? "d" : g.lastActualDirection;
        } else {
            g.direction = occupied(hx + 1, hy) ? "l" : occupied(hx - 1, hy) ? "r" : g.lastActualDirection;
        }
    }
    if (g.lastDirection !== g.direction) {
        g.lastActualDirection = g.lastDirection;
        checkForWallCollision(g);
    }
}

function moveSnake(g: GameState) {
    for (let i = g.snakeX.length - 1; i > 0; i--) {
        g.snakeX[i] = g.snakeX[i - 1];
        g.snakeY[i] = g.snakeY[i - 1];
    }
    if (g.path && g.path.length >= 2) {
        g.snakeX[0] = g.path[1][0];
        g.snakeY[0] = g.path[1][1];
    } else if (g.direction === "r") g.snakeX[0]++;
    else if (g.direction === "l") g.snakeX[0]--;
    else if (g.direction === "u") g.snakeY[0]--;
    else g.snakeY[0]++;
}

function rebuildGrid(g: GameState) {
    g.grid = Array.from({ length: g.rows }, () => new Array(g.cols).fill(0));
    for (let i = 1; i < g.snakeX.length; i++) {
        const [x, y] = [g.snakeX[i], g.snakeY[i]];
        if (y >= 0 && y < g.rows && x >= 0 && x < g.cols) g.grid[y][x] = 1;
    }
}

const route = (g: GameState) => {
    const inBounds = g.snakeX[0] >= 0 && g.snakeX[0] < g.cols && g.snakeY[0] >= 0 && g.snakeY[0] < g.rows;
    return inBounds ? finder.findPath(g.snakeX[0], g.snakeY[0], g.appleX, g.appleY, new PF.Grid(g.grid)) : null;
};

export default function Snake({ values, playing, resetSignal, onReadouts }: SketchProps) {
    const mountRef = useRef<HTMLDivElement>(null);
    const valuesRef = useLatest(values);
    const onReadoutsRef = useLatest(onReadouts);
    const playingRef = useLatest(playing);
    const game = useRef<GameState>(freshGame(0, 0, 0));
    const instance = useRef<p5 | null>(null);

    const restart = () => {
        const g = game.current;
        game.current = freshGame(g.cols, g.rows, g.best);
        if (playingRef.current) instance.current?.loop();
        else instance.current?.redraw();
    };

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        const fitBoard = (p: p5) => {
            const cols = Math.max(8, Math.floor(mount.clientWidth / CELL));
            const rows = Math.max(6, Math.floor(mount.clientHeight / CELL));
            p.resizeCanvas(cols * CELL, rows * CELL);
            game.current = freshGame(cols, rows, game.current.best);
        };

        const sketch = (p: p5) => {
            p.setup = () => {
                p.createCanvas(CELL, CELL);
                p.pixelDensity(Math.min(window.devicePixelRatio, 2));
                fitBoard(p);
                if (!playingRef.current) p.noLoop();
            };

            p.draw = () => {
                const g = game.current;
                const v = valuesRef.current;
                p.frameRate(v.gameSpeed as number);
                p.background(STAGE.bg);

                rebuildGrid(g);

                if (v.showGrid) {
                    p.stroke(STAGE.faint);
                    p.strokeWeight(1);
                    for (let x = 0; x <= p.width; x += CELL) p.line(x, 0, x, p.height);
                    for (let y = 0; y <= p.height; y += CELL) p.line(0, y, p.width, y);
                }

                if (g.snakeX[0] === g.appleX && g.snakeY[0] === g.appleY) {
                    g.appleCaught = true;
                    g.taken = true;
                    g.score++;
                    g.best = Math.max(g.best, g.score);
                    g.snakeX.push(g.snakeX[g.snakeX.length - 1]);
                    g.snakeY.push(g.snakeY[g.snakeY.length - 1]);
                }

                if (g.appleCaught) {
                    for (let attempts = 0; g.taken && attempts < 500; attempts++) {
                        g.appleX = Math.floor(Math.random() * (g.cols - 4)) + 2;
                        g.appleY = Math.floor(Math.random() * (g.rows - 4)) + 2;
                        const onSnake = g.snakeX.some((x, i) => x === g.appleX && g.snakeY[i] === g.appleY);
                        if (!onSnake) g.taken = false;
                    }
                    g.appleCaught = false;
                }

                // Planned route, drawn under everything else
                if (v.showPath && g.path && g.path.length > 1) {
                    p.noFill();
                    p.stroke(255, 90, 36, 140);
                    p.strokeWeight(2);
                    (p.drawingContext as CanvasRenderingContext2D).setLineDash([4, 6]);
                    p.beginShape();
                    g.path.forEach(([x, y]) => p.vertex(x * CELL + CELL / 2, y * CELL + CELL / 2));
                    p.endShape();
                    (p.drawingContext as CanvasRenderingContext2D).setLineDash([]);
                }

                // Food: a signal square with a hollow centre
                p.noStroke();
                p.fill(STAGE.signal);
                p.rect(g.appleX * CELL + 3, g.appleY * CELL + 3, CELL - 6, CELL - 6);
                p.fill(STAGE.bg);
                p.rect(g.appleX * CELL + 8, g.appleY * CELL + 8, CELL - 16, CELL - 16);

                // Body fades towards the tail
                for (let i = g.snakeX.length - 1; i >= 1; i--) {
                    const t = i / g.snakeX.length;
                    p.fill(236, 235, 228, 255 - t * 170);
                    p.rect(g.snakeX[i] * CELL + 2, g.snakeY[i] * CELL + 2, CELL - 4, CELL - 4);
                }
                p.fill(STAGE.signal);
                p.rect(g.snakeX[0] * CELL + 1, g.snakeY[0] * CELL + 1, CELL - 2, CELL - 2);

                const hitWall = g.snakeX[0] < 0 || g.snakeX[0] >= g.cols || g.snakeY[0] < 0 || g.snakeY[0] >= g.rows;
                const hitSelf = g.snakeX.some((x, i) => i > 0 && x === g.snakeX[0] && g.snakeY[i] === g.snakeY[0]);
                if (hitWall || hitSelf) g.isDead = true;

                onReadoutsRef.current({ Score: g.score, Best: g.best, Length: g.snakeX.length });

                if (g.isDead) {
                    if (v.autoRestart) {
                        game.current = freshGame(g.cols, g.rows, g.best);
                    } else {
                        p.fill(0, 0, 0, 150);
                        p.rect(0, 0, p.width, p.height);
                        p.fill(STAGE.ink);
                        p.textAlign(p.CENTER, p.CENTER);
                        p.textFont("monospace");
                        p.textSize(13);
                        p.text(`GAME OVER · SCORE ${g.score} · PRESS R TO RESTART`, p.width / 2, p.height / 2);
                        p.noLoop();
                    }
                    return;
                }

                g.path = route(g);
                checkDirection(g);
                checkForWallCollision(g);
                checkForBodyCollision(g);
                moveSnake(g);
            };
        };

        const p = new p5(sketch, mount);
        instance.current = p;

        let resizeTimer = 0;
        let firstObservation = true;
        const observer = new ResizeObserver(() => {
            // The observer fires once on observe; setup has already sized the board
            if (firstObservation) {
                firstObservation = false;
                return;
            }
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(() => fitBoard(p), 150);
        });
        observer.observe(mount);

        return () => {
            observer.disconnect();
            window.clearTimeout(resizeTimer);
            p.remove();
            instance.current = null;
        };
    }, [valuesRef, playingRef, onReadoutsRef]);

    useEffect(() => {
        const p = instance.current;
        if (!p) return;
        if (playing && !game.current.isDead) p.loop();
        else p.noLoop();
    }, [playing]);

    useSignal(resetSignal, restart);

    return <div ref={mountRef} className="flex h-full w-full items-center justify-center" />;
}
