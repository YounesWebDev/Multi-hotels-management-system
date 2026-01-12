import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    const { name, quote } = usePage<SharedData>().props;

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center overflow-hidden bg-slate-50 px-8 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl dark:bg-amber-700/20" />
                <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-700/20" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.7),transparent_55%),radial-gradient(circle_at_80%_40%,rgba(255,255,255,0.6),transparent_50%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(15,23,42,0.65),transparent_55%),radial-gradient(circle_at_80%_40%,rgba(15,23,42,0.5),transparent_50%)]" />
            </div>
            <div className="relative hidden h-full flex-col bg-slate-900/90 p-10 text-slate-100 lg:flex">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(148,163,184,0.25),transparent_60%),radial-gradient(circle_at_80%_60%,rgba(52,211,153,0.12),transparent_55%)]" />
                <Link
                    href={home()}
                    className="relative z-20 flex items-center text-lg font-medium"
                >
                    <AppLogoIcon className="mr-2 size-8 fill-current text-white" />
                    {name}
                </Link>
                {quote && (
                    <div className="relative z-20 mt-auto">
                        <blockquote className="space-y-2">
                            <p className="text-lg">
                                &ldquo;{quote.message}&rdquo;
                            </p>
                            <footer className="text-sm text-neutral-300">
                                {quote.author}
                            </footer>
                        </blockquote>
                    </div>
                )}
            </div>
            <div className="relative w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)] backdrop-blur sm:w-[350px] dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-[0_24px_60px_-40px_rgba(15,23,42,0.8)]">
                    <Link
                        href={home()}
                        className="relative z-20 flex items-center justify-center lg:hidden"
                    >
                        <AppLogoIcon className="h-10 fill-current text-slate-900 dark:text-slate-100 sm:h-12" />
                    </Link>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-xl font-medium">{title}</h1>
                        <p className="text-sm text-balance text-slate-500 dark:text-slate-300">
                            {description}
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
