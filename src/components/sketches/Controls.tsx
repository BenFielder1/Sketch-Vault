import { ArrowPathIcon, PhotoIcon } from '@heroicons/react/24/outline';

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
        <div className="w-80 transition-all duration-300 bg-[var(--color-bg-secondary)] border-r border-[var(--color-border)] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-[var(--color-border)]">
                <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Controls</h2>
            </div>

            {/* Sliders Section */}
            <div className="p-4 flex-1 overflow-y-auto">
                <h3 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-4">
                    Animation
                </h3>
                <div className="space-y-5">
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
                
                {/* Toggles Section */}
                <h3 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-4 mt-8">
                    Display Options
                </h3>
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

            {/* Action Buttons */}
            <div className="p-4 border-t border-[var(--color-border)] space-y-3">
                {resetCamera && (
                    <button
                        onClick={resetCamera}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
                    >
                        <ArrowPathIcon className="w-5 h-5" />
                        Reset Camera
                    </button>
                )}

                {resetGame && (
                    <button
                        onClick={resetGame}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
                    >
                        <ArrowPathIcon className="w-5 h-5" />
                        Reset Game
                    </button>
                )}

                {saveScreenshot && (
                    <button
                        onClick={saveScreenshot}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
                    >
                        <PhotoIcon className="w-5 h-5" />
                        Save Screenshot
                    </button>
                )}
            </div>
        </div>
    );
}
