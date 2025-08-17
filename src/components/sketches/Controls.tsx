import { ArrowPathIcon, Cog6ToothIcon, PhotoIcon } from '@heroicons/react/24/outline';

import { IControlSlider, IControlToggle } from "@/types/controls";
import ControlSlider from "./ControlSlider";
import ControlToggle from "./ControlToggle";

export default function Controls({ sliders, toggles, handleControlChange, resetCamera, resetGame, saveScreenshot }: {
    sliders: IControlSlider[];
    toggles: IControlToggle[];
    handleControlChange: (varName: string, value: number | boolean) => void;
    resetCamera?: () => void;
    resetGame?: () => void;
    saveScreenshot?: () => void;
}) {
    return (
        <div className="w-80 transition-all duration-300 bg-black/40 backdrop-blur-sm border-r border-white/10 flex flex-col">
            <div className="p-4 text-white">
                <Cog6ToothIcon className="w-6 h-6" />
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
                <h3 className="text-white font-semibold mb-4">Animation Controls</h3>
                <div className="space-y-6">
                    {sliders.map(slider => (
                        <ControlSlider
                            key={slider.varName}
                            label={slider.name}
                            value={slider.value}
                            min={slider.min}
                            max={slider.max}
                            step={slider.step}
                            onChange={(value) => { handleControlChange(slider.varName, value); slider.value = value; }}
                        />
                    ))}
                </div>
                <h3 className="text-white font-semibold mb-4 mt-8">Display Options</h3>
                <div className="space-y-4">
                    {toggles.map(toggle => (
                        <ControlToggle
                            key={toggle.varName}
                            label={toggle.name}
                            value={toggle.value}
                            onChange={(value) => { handleControlChange(toggle.varName, value); toggle.value = value; }}
                        />
                    ))}
                </div>
            </div>

            <div className="p-4 border-t border-white/10 space-y-3">
                {resetCamera && (
                    <button
                        onClick={resetCamera}
                        className="w-full flex items-center justify-center gap-2 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                    >
                        <ArrowPathIcon className="w-4 h-4" />
                        Reset Camera
                    </button>
                )}

                {resetGame && (
                    <button
                        onClick={resetGame}
                        className="w-full flex items-center justify-center gap-2 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                    >
                        <ArrowPathIcon className="w-4 h-4" />
                        Reset Game
                    </button>
                )}

                {saveScreenshot && (
                    <button
                        onClick={saveScreenshot}
                        className="w-full flex items-center justify-center gap-2 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                    >
                        <PhotoIcon className="w-4 h-4" />
                        Save Screenshot
                    </button>
                )}
            </div>
        </div>
    );
}
