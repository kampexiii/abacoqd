import { cn } from '@/lib/utils';

type SectionIntroProps = {
    eyebrow: string;
    title: string;
    lead?: string;
    align?: 'left' | 'center';
};

export default function SectionIntro({
    eyebrow,
    title,
    lead,
    align = 'left',
}: SectionIntroProps) {
    return (
        <div
            className={cn(align === 'center' && 'abaco-section-intro--center')}
        >
            <p className="abaco-section-eyebrow">{eyebrow}</p>
            <h2 className="abaco-section-title">{title}</h2>
            {lead && <p className="abaco-section-lead">{lead}</p>}
        </div>
    );
}
