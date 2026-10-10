import { ControlValues, ISketch, SketchType } from "@/types/sketch";

export const sketches: ISketch[] = [
    {
        id: 1,
        slug: "planets",
        title: "Planetary System",
        summary: "Eight planets in lit, shadowed orbit around a glowing sun.",
        description: "A scale-bent model of the solar system. Orbital periods are relative to Earth's year, axial tilts are real, and the sun is the only light in the scene.",
        types: ["interactive", "3d"],
        tags: ["three.js", "space", "orbit", "webgl"],
        medium: "Three.js",
        year: 2025,
        thumbnail: "/sketches/planets.png",
        interactions: ["Drag to orbit", "Scroll to zoom", "Right-drag to pan"],
        controls: [
            { kind: "slider", key: "orbitSpeed", label: "Orbit speed", min: 0, max: 5, step: 0.1, default: 1, unit: "×" },
            { kind: "slider", key: "planetScale", label: "Planet scale", min: 0.2, max: 3, step: 0.1, default: 1, unit: "×" },
            { kind: "slider", key: "sunIntensity", label: "Sun intensity", min: 0.2, max: 3, step: 0.1, default: 1, unit: "×" },
            { kind: "toggle", key: "showOrbits", label: "Orbit lines", default: true },
            { kind: "toggle", key: "showStars", label: "Starfield", default: true },
            { kind: "toggle", key: "autoRotate", label: "Drift camera", default: false },
        ],
        resetLabel: "Reset camera",
    },
    {
        id: 2,
        slug: "snake",
        title: "Snake AI",
        summary: "A snake that plays itself, routing to food with A* search.",
        description: "Every frame the board is rebuilt as a walkable grid and an A* finder plots the shortest route from head to food. When no route exists the snake falls back to steering around walls and its own body.",
        types: ["2d"],
        tags: ["p5.js", "pathfinding", "A*", "game"],
        medium: "p5.js",
        year: 2025,
        thumbnail: "/sketches/snake.png",
        interactions: ["Watch it play", "Toggle the route overlay to see its plan"],
        controls: [
            { kind: "slider", key: "gameSpeed", label: "Speed", min: 1, max: 60, step: 1, default: 12, unit: "fps" },
            { kind: "toggle", key: "showGrid", label: "Grid", default: true },
            { kind: "toggle", key: "showPath", label: "Route overlay", default: true },
            { kind: "toggle", key: "autoRestart", label: "Auto restart", default: true },
        ],
        resetLabel: "Restart game",
    },
    {
        id: 3,
        slug: "flow-field",
        title: "Flow Field",
        summary: "Thousands of particles drifting through evolving Perlin noise.",
        description: "Each particle reads an angle from a three-dimensional Perlin noise field (two dimensions of space, one of time) and steps along it, leaving a fading trace. The field slowly turns over, so no two minutes look alike.",
        types: ["generative"],
        tags: ["canvas", "perlin noise", "particles"],
        medium: "Canvas 2D",
        year: 2026,
        thumbnail: "/sketches/flow-field.png",
        interactions: ["Click to reseed the field", "Move the pointer to stir the particles"],
        controls: [
            { kind: "slider", key: "particles", label: "Particles", min: 500, max: 8000, step: 100, default: 3000 },
            { kind: "slider", key: "scale", label: "Field scale", min: 0.4, max: 6, step: 0.1, default: 1.8 },
            { kind: "slider", key: "speed", label: "Speed", min: 0.2, max: 4, step: 0.1, default: 1.2, unit: "×" },
            { kind: "slider", key: "trail", label: "Trail length", min: 0, max: 100, step: 1, default: 88, unit: "%" },
            { kind: "toggle", key: "evolve", label: "Evolve field", default: true },
            { kind: "toggle", key: "spectral", label: "Spectral colour", default: false },
        ],
        resetLabel: "Reseed field",
    },
    {
        id: 4,
        slug: "life",
        title: "Game of Life",
        summary: "Conway's cellular automaton, coloured by the age of each cell.",
        description: "Four rules (underpopulation, survival, overpopulation, reproduction) applied to every cell at once. Young cells burn signal orange and cool as they persist, so stable structures read pale and the frontier glows.",
        types: ["interactive", "2d"],
        tags: ["canvas", "cellular automata", "emergence"],
        medium: "Canvas 2D",
        year: 2026,
        thumbnail: "/sketches/life.png",
        interactions: ["Drag to draw cells", "Drag from a live cell to erase"],
        controls: [
            { kind: "slider", key: "rate", label: "Generations / sec", min: 1, max: 60, step: 1, default: 18 },
            { kind: "slider", key: "cell", label: "Cell size", min: 3, max: 24, step: 1, default: 8, unit: "px" },
            { kind: "slider", key: "density", label: "Seed density", min: 5, max: 60, step: 1, default: 24, unit: "%" },
            { kind: "toggle", key: "wrap", label: "Wrap edges", default: true },
            { kind: "toggle", key: "age", label: "Colour by age", default: true },
            { kind: "toggle", key: "grid", label: "Grid", default: false },
        ],
        resetLabel: "Randomise",
        actions: [{ id: "clear", label: "Clear board", shortcut: "C" }],
    },
    {
        id: 5,
        slug: "boids",
        title: "Boids",
        summary: "A flock built from three local rules, after Craig Reynolds.",
        description: "No bird knows the shape of the flock. Each one only steers away from crowding, towards the average heading, and towards the centre of its neighbours. A spatial hash keeps neighbour lookups fast enough for hundreds of birds.",
        types: ["interactive", "generative"],
        tags: ["canvas", "simulation", "emergence", "flocking"],
        medium: "Canvas 2D",
        year: 2026,
        thumbnail: "/sketches/boids.png",
        interactions: ["Move the pointer through the flock to scatter it", "Hold the pointer down to attract instead"],
        controls: [
            { kind: "slider", key: "count", label: "Boids", min: 20, max: 800, step: 10, default: 280 },
            { kind: "slider", key: "separation", label: "Separation", min: 0, max: 3, step: 0.05, default: 1.5 },
            { kind: "slider", key: "alignment", label: "Alignment", min: 0, max: 3, step: 0.05, default: 1 },
            { kind: "slider", key: "cohesion", label: "Cohesion", min: 0, max: 3, step: 0.05, default: 0.9 },
            { kind: "slider", key: "vision", label: "Vision radius", min: 20, max: 140, step: 1, default: 56, unit: "px" },
            { kind: "slider", key: "maxSpeed", label: "Max speed", min: 1, max: 8, step: 0.1, default: 3.4 },
            { kind: "toggle", key: "trails", label: "Trails", default: false },
            { kind: "toggle", key: "pointer", label: "Pointer influence", default: true },
        ],
        resetLabel: "Release new flock",
    },
];

export const sketchTypeLabels: Record<SketchType, string> = {
    "3d": "3D",
    generative: "Generative",
    interactive: "Interactive",
    "2d": "2D",
};

export const catalogueNumber = (id: number) => `No. ${String(id).padStart(3, "0")}`;

export const sketchHref = (sketch: ISketch) => `/sketches/${sketch.slug}`;

export const getSketch = (slug: string) => sketches.find(s => s.slug === slug);

export const defaultValues = (sketch: ISketch): ControlValues =>
    Object.fromEntries(sketch.controls.map(c => [c.key, c.default]));

/** Previous and next sketches in catalogue order, wrapping around */
export const neighbours = (sketch: ISketch) => {
    const i = sketches.findIndex(s => s.slug === sketch.slug);
    return {
        prev: sketches[(i - 1 + sketches.length) % sketches.length],
        next: sketches[(i + 1) % sketches.length],
    };
};
