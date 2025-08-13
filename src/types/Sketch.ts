export interface Sketch {
    id: number;
    title: string;
    description: string;
    types: ('3d' | 'generative' | 'interactive' | "2d")[];
    tags: string[];
    thumbnail: string;
    link: string;
    isLiked: boolean;
    likes: number;
    views: number;
    createdAt: string;
}
