import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 overflow-hidden bg-slate-50 p-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100 md:p-10">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl dark:bg-amber-700/20" />
                <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-700/20" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.7),transparent_55%),radial-gradient(circle_at_80%_40%,rgba(255,255,255,0.6),transparent_50%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(15,23,42,0.65),transparent_55%),radial-gradient(circle_at_80%_40%,rgba(15,23,42,0.5),transparent_50%)]" />
            </div>
            <div className="relative z-10 w-full max-w-sm">
                <div className="flex flex-col gap-8 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-[0_24px_60px_-40px_rgba(15,23,42,0.8)] md:p-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-md">
                                <AppLogoIcon className="size-9 fill-current text-slate-900 dark:text-slate-100" />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium">{title}</h1>
                            <p className="text-center text-sm text-slate-500 dark:text-slate-300">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
