import { ISketch, ISketchControls } from "@/types/sketch";

export const sketchData: ISketch[] = [
    {
        id: 1,
        title: "Planetary System",
        description: "Interactive 3D model of the solar system with 8 planets orbiting the sun.",
        types: ["interactive", "3d"],
        tags: ["space", "interactive", "three.js", "planets", "orbit"],
        thumbnail: "/sketches/planets.png",
        link: "/sketches/planets",
    },
    {
        id: 2,
        title: "Snake AI",
        description: "Uses an A* routing algorithm to find the shortest path to the food.",
        types: ["2d"],
        tags: ["p5.js", "AI", "snake", "routing", "game"],
        thumbnail: "/sketches/snake.png",
        link: "/sketches/snake",
    },
];

export const sketchControls: ISketchControls[] = [
    {
        id: 1,
        name: "planets",
        controlSliders: [
            { name: "Planet Scale", varName: "planetScale", min: 0.1, max: 3, step: 0.1, value: 1.0 },
            { name: "Orbit Speed", varName: "orbitSpeed", min: 0.1, max: 5, step: 0.1, value: 1.0 }
        ],
        controlToggles: [
            { name: "Show Orbits", varName: "showOrbits", value: true },
            { name: "Show Stars", varName: "showStars", value: true }
        ]
    },
    {
        id: 2,
        name: "snake",
        controlSliders: [
            { name: "Game Speed (FPS)", varName: "gameSpeed", min: 1, max: 60, step: 1, value: 10 }
        ],
        controlToggles: [
            { name: "Show Grid", varName: "showGrid", value: true },
            { name: "Show AI Path", varName: "showPath", value: false },
            { name: "Auto Restart", varName: "autoRestart", value: true }
        ]
    }
]