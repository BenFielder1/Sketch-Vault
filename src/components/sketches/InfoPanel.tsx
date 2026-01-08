import { InformationCircleIcon } from '@heroicons/react/24/outline';

export default function InfoPanel({ title, text, controls }: {
    title: string;
    text: string;
    controls: string;
}) {
    return (
        <div className="absolute bottom-4 left-4 max-w-sm">
            <div className="bg-[var(--color-bg-secondary)]/90 backdrop-blur-sm rounded-xl border border-[var(--color-border)] p-4">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
                        <InformationCircleIcon className="w-5 h-5 text-[var(--color-primary)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">{title}</h3>
                        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-2">{text}</p>
                        <p className="text-xs text-[var(--color-text-muted)] bg-[var(--color-bg-elevated)] px-2 py-1 rounded inline-block">
                            {controls}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
