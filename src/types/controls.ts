export interface IControlSlider {
    min: number,
    max: number,
    step: number,
    value: number,
    name: string,
    varName: string
}

export interface IControlToggle {
    value: boolean,
    name: string,
    varName: string
}