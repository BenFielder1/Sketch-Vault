export default function InfoPanel({ title, text, controls }: {
    title: string;
    text: string;
    controls: string;
}) {
    return (
        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white max-w-xs">
            <h3 className="font-semibold mb-2">{title}</h3>
            <p className="text-sm text-gray-300 mb-2">{text}</p>
            <p className="text-xs text-gray-400">{controls}</p>
        </div>
    )
}