import { PlayIcon, PauseIcon } from '@heroicons/react/24/outline';

export default function PauseButton({ isPlaying, setIsPlaying }: {
    isPlaying: boolean;
    setIsPlaying: (value: boolean) => void;
}) {
    return (
        <div className="absolute top-4 right-4 z-10">
            <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-3 rounded-xl backdrop-blur-sm transition-all duration-300 border ${
                    isPlaying
                        ? 'bg-[var(--color-rose)]/10 text-[var(--color-rose)] border-[var(--color-rose)]/30 hover:bg-[var(--color-rose)]/20'
                        : 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border-[var(--color-accent)]/30 hover:bg-[var(--color-accent)]/20'
                }`}
            >
                {isPlaying ? (
                    <PauseIcon className="w-6 h-6" />
                ) : (
                    <PlayIcon className="w-6 h-6" />
                )}
            </button>
        </div>
    );
}
