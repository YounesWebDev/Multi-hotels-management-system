import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-50 p-6 text-slate-900 lg:p-10 dark:bg-slate-950 dark:text-slate-100">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl dark:bg-amber-700/20" />
                    <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-700/20" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.7),transparent_55%),radial-gradient(circle_at_80%_40%,rgba(255,255,255,0.6),transparent_50%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(15,23,42,0.65),transparent_55%),radial-gradient(circle_at_80%_40%,rgba(15,23,42,0.5),transparent_50%)]" />
                </div>
                <header className="relative z-10 mb-10 w-full max-w-5xl text-sm lg:mb-16">
                    <nav className="flex items-center justify-end gap-4">
                    {auth.user ? (
                        <Link
                            href={dashboard()}
                            className="inline-flex items-center rounded-sm border border-slate-300 px-5 py-2 text-sm font-medium leading-normal text-slate-900 hover:border-slate-400 dark:border-slate-600 dark:text-slate-100 dark:hover:border-slate-400"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={login()}
                                className="inline-flex items-center rounded-sm border border-transparent px-5 py-2 text-sm font-medium leading-normal text-slate-900 hover:border-slate-300 dark:text-slate-100 dark:hover:border-slate-600"
                            >
                                Log in
                            </Link>
                            {canRegister && (
                                <Link
                                    href={register()}
                                    className="inline-flex items-center rounded-sm border border-slate-300 px-5 py-2 text-sm font-medium leading-normal text-slate-900 hover:border-slate-400 dark:border-slate-600 dark:text-slate-100 dark:hover:border-slate-400"
                                >
                                    Register
                                </Link>
                            )}
                        </>
                    )}
                    </nav>
                </header>
                <main className="relative z-10 w-full max-w-5xl text-center">
                    <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white/80 px-6 py-10 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)] backdrop-blur sm:px-10 sm:py-14 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-[0_24px_60px_-40px_rgba(15,23,42,0.8)]">
                        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-amber-600 dark:text-amber-300">
                            Multi Hotels Management
                        </p>
                        <h1 className="text-balance text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-slate-100">
                            Hotel management system
                        </h1>
                        <p className="mt-5 text-pretty text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">
                            Everything you need to run modern properties in one
                            place: reservations, rooms, and guest experiences
                            streamlined with clear workflows and real-time
                            visibility.
                        </p>
                    </div>
                </main>
            </div>
        </>
    );
}
