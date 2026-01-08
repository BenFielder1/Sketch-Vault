export default function FeatureCard({ 
    icon, 
    title, 
    description,
    accentColor = 'primary'
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    accentColor?: 'primary' | 'accent' | 'rose';
}) {
    const colorClasses = {
        primary: {
            icon: 'text-[var(--color-primary)]',
            bg: 'bg-[var(--color-primary)]/10',
            border: 'group-hover:border-[var(--color-primary)]/30',
        },
        accent: {
            icon: 'text-[var(--color-accent)]',
            bg: 'bg-[var(--color-accent)]/10',
            border: 'group-hover:border-[var(--color-accent)]/30',
        },
        rose: {
            icon: 'text-[var(--color-rose)]',
            bg: 'bg-[var(--color-rose)]/10',
            border: 'group-hover:border-[var(--color-rose)]/30',
        },
    };
    
    const colors = colorClasses[accentColor];
    
    return (
        <div className={`group relative p-6 lg:p-8 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] ${colors.border} transition-all duration-300 card-lift`}>
            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-2xl">
                <div className={`absolute -top-10 -right-10 w-20 h-20 ${colors.bg} rotate-45 transform origin-bottom-left`} />
            </div>
            
            {/* Icon */}
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${colors.bg} ${colors.icon} mb-5`}>
                {icon}
            </div>
            
            {/* Content */}
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">
                {title}
            </h3>
            <p className="text-[var(--color-text-secondary)] leading-relaxed">
                {description}
            </p>
            
            {/* Bottom line accent */}
            <div className={`absolute bottom-0 left-8 right-8 h-0.5 ${colors.bg} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
        </div>
    );
}
