export default function FeatureCard({ icon, title, description }: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="group bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105">
            <div className="text-purple-400 mb-4 group-hover:text-cyan-400 transition-colors">
                {icon}
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
            <p className="text-gray-300 leading-relaxed">{description}</p>
        </div>
    );
}