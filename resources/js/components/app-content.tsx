import { SidebarInset } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import * as React from 'react';

interface AppContentProps extends React.ComponentProps<'main'> {
    variant?: 'header' | 'sidebar';
}

export function AppContent({
    variant = 'header',
    children,
    className,
    ...props
}: AppContentProps) {
    if (variant === 'sidebar') {
        return (
            <SidebarInset
                className={cn(
                    'relative overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100',
                    className,
                )}
                {...props}
            >
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl dark:bg-amber-700/20" />
                    <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-700/20" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.7),transparent_55%),radial-gradient(circle_at_80%_40%,rgba(255,255,255,0.6),transparent_50%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(15,23,42,0.65),transparent_55%),radial-gradient(circle_at_80%_40%,rgba(15,23,42,0.5),transparent_50%)]" />
                </div>
                <div className="relative z-10 flex min-h-svh flex-col">
                    {children}
                </div>
            </SidebarInset>
        );
    }

    return (
        <main
            className={cn(
                'relative flex min-h-svh w-full flex-1 overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100',
                className,
            )}
            {...props}
        >
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl dark:bg-amber-700/20" />
                <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-700/20" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.7),transparent_55%),radial-gradient(circle_at_80%_40%,rgba(255,255,255,0.6),transparent_50%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(15,23,42,0.65),transparent_55%),radial-gradient(circle_at_80%_40%,rgba(15,23,42,0.5),transparent_50%)]" />
            </div>
            <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl p-6">
                {children}
            </div>
        </main>
    );
}
