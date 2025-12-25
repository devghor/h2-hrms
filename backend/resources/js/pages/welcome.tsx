import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome - H2-HRMS">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4"></nav>
                </header>
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">
                        <div className="flex-1 rounded-br-lg rounded-bl-lg bg-white p-6 pb-12 text-[13px] leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-tl-lg lg:rounded-br-none lg:p-20 dark:bg-[#161615] dark:text-[#EDEDEC] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                            <h1 className="mb-4 text-3xl font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Welcome to H2-HRMS</h1>
                            <p className="mb-6 text-base text-[#706f6c] dark:text-[#A1A09A]">
                                Your comprehensive Human Resource Management System designed to streamline workforce management, enhance productivity,
                                and simplify HR operations.
                            </p>
                            <div className="mb-6">
                                <h2 className="mb-3 text-lg font-medium text-[#1b1b18] dark:text-[#EDEDEC]">Key Features</h2>
                                <ul className="space-y-2 text-[#706f6c] dark:text-[#A1A09A]">
                                    <li className="flex items-center">
                                        <span className="mr-3 h-2 w-2 rounded-full bg-[#f53003] dark:bg-[#FF4433]"></span>
                                        Employee Management & Records
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mr-3 h-2 w-2 rounded-full bg-[#f53003] dark:bg-[#FF4433]"></span>
                                        Attendance & Time Tracking
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mr-3 h-2 w-2 rounded-full bg-[#f53003] dark:bg-[#FF4433]"></span>
                                        Payroll Management
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mr-3 h-2 w-2 rounded-full bg-[#f53003] dark:bg-[#FF4433]"></span>
                                        Leave Management System
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mr-3 h-2 w-2 rounded-full bg-[#f53003] dark:bg-[#FF4433]"></span>
                                        Performance Evaluation
                                    </li>
                                </ul>
                            </div>
                            {!auth.user && (
                                <div className="flex gap-3 text-sm leading-normal">
                                    <Link
                                        href={route('register')}
                                        className="inline-block rounded-sm border border-black bg-[#1b1b18] px-5 py-1.5 text-sm leading-normal text-white hover:border-black hover:bg-black dark:border-[#eeeeec] dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:border-white dark:hover:bg-white"
                                    >
                                        Get Started
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                    >
                                        Sign In
                                    </Link>
                                </div>
                            )}
                        </div>
                        <div className="relative -mb-px aspect-[335/376] w-full shrink-0 overflow-hidden rounded-t-lg bg-gradient-to-br from-[#f53003] to-[#ff6b35] lg:mb-0 lg:-ml-px lg:aspect-auto lg:w-[438px] lg:rounded-t-none lg:rounded-r-lg dark:from-[#8b0000] dark:to-[#cc1100]">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center text-white">
                                    <div className="mb-4">
                                        <svg className="mx-auto h-24 w-24 opacity-90" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5V6C15 7.66 13.66 9 12 9S9 7.66 9 6V5.5L3 7V9L9 10.5V22H15V10.5L21 9Z" />
                                        </svg>
                                    </div>
                                    <h2 className="mb-2 text-2xl font-bold">H2-HRMS</h2>
                                    <p className="text-lg opacity-90">Human Resource Management</p>
                                    <p className="mt-2 text-sm opacity-75">Efficient • Reliable • Secure</p>
                                </div>
                            </div>
                            <div className="absolute inset-0 rounded-t-lg shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-t-none lg:rounded-r-lg dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]" />
                        </div>
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
