import { IControlSlider, IControlToggle } from "./controls";

export type SketchType = "3d" | "generative" | "interactive" | "2d";

export interface ISketch {
    id: number;
    title: string;
    description: string;
    types: SketchType[];
    tags: string[];
    thumbnail: string;
    link: string;
}

export interface ISketchControls {
    id: number;
    name: string;
    controlSliders: IControlSlider[];
    controlToggles: IControlToggle[];
}