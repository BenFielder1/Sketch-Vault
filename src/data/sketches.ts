import { Sketch } from "@/types/Sketch";

export const sketches: Sketch[] = [
    {
        id: 1,
        title: "Planetary System",
        description: "Interactive 3D model of the solar system with 8 planets orbiting the sun.",
        types: ["interactive", "3d"],
        tags: ["space", "interactive", "three.js", "planets", "orbit"],
        thumbnail: "/sketches/planets.png",
        link: "/sketches/planets",
        isLiked: false,
        likes: 124,
        views: 1502,
        createdAt: "2024-01-15"
    },
    {
        id: 2,
        title: "Snake AI",
        description: "Uses an A* routing algorithm to find the shortest path to the food.",
        types: ["2d"],
        tags: ["p5.js", "AI", "snake", "routing", "game"],
        thumbnail: "/sketches/snake.png",
        link: "/sketches/snake",
        isLiked: true,
        likes: 89,
        views: 934,
        createdAt: "2024-01-12"
    },
];