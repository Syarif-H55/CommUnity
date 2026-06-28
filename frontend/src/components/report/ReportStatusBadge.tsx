'use client';

import { cn } from '@/lib/utils';
import { ReportStatus } from '@/types';

const statusConfig: Record<ReportStatus, { label: string; className: string }> = {
    draft: {
        label: 'Draft',
        className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    },
    submitted: {
        label: 'Dikirim',
        className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    },
    approved: {
        label: 'Disetujui',
        className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    },
    revision_requested: {
        label: 'Revisi Diminta',
        className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    },
};

export function ReportStatusBadge({ status, className }: { status: ReportStatus; className?: string }) {
    const config = statusConfig[status];
    return (
        <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', config.className, className)}>
            {config.label}
        </span>
    );
}
