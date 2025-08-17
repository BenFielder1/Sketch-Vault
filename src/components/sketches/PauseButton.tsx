import { PlayIcon, PauseIcon } from '@heroicons/react/24/outline';

export default function PauseButton({ isPlaying, setIsPlaying }: {
    isPlaying: boolean;
    setIsPlaying: (value: boolean) => void;
}) {
    return (
        <div className="absolute top-4 right-4">
            <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-3 rounded-full backdrop-blur-sm transition-all duration-300 ${isPlaying
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                    : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                    }`}
            >
                {isPlaying ? (
                    <PauseIcon className="w-6 h-6" />
                ) : (
                    <PlayIcon className="w-6 h-6" />
                )}
            </button>
        </div>
    )
}