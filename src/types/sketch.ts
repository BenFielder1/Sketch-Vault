export type SketchType = "3d" | "generative" | "interactive" | "2d";

export interface ISliderControl {
    kind: "slider";
    key: string;
    label: string;
    min: number;
    max: number;
    step: number;
    default: number;
    unit?: string;
}

export interface IToggleControl {
    kind: "toggle";
    key: string;
    label: string;
    default: boolean;
}

export type IControl = ISliderControl | IToggleControl;

export type ControlValues = Record<string, number | boolean>;

export interface ISketchAction {
    id: string;
    label: string;
    /** Single key, matched case-insensitively */
    shortcut?: string;
}

export interface ISketch {
    /** Catalogue number, shown as No. 001 */
    id: number;
    slug: string;
    title: string;
    /** One line, used on cards and index rows */
    summary: string;
    /** A short paragraph shown in the viewer */
    description: string;
    types: SketchType[];
    tags: string[];
    medium: string;
    year: number;
    thumbnail: string;
    /** How to interact with the piece, shown in the viewer */
    interactions: string[];
    controls: IControl[];
    /** Label for the R key / reset button */
    resetLabel: string;
    /** Extra one-off actions the sketch understands */
    actions?: ISketchAction[];
}
