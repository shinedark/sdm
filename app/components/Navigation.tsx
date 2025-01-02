'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
    const pathname = usePathname();

    return (
        <nav className="w-full">
            <div className="flex justify-center flex-wrap gap-2 sm:gap-4 px-2 py-1">
                {[
                    { name: 'Home', path: '/' },
                    { name: 'Vision', path: '/vision' },
                    { name: 'About', path: '/about' },
                    { name: 'Store', path: '/store' },
                ].map(({ name, path }) => (
                    <Link
                        key={path}
                        href={path}
                        className={`w-16 sm:w-20 h-8 sm:h-10 text-sm sm:text-base flex items-center justify-center rounded-full transition-all duration-500 ease-in-out transform hover:scale-105 ${pathname === path
                            ? 'bg-white text-black'
                            : 'bg-black text-white hover:bg-white/20'
                            }`}
                    >
                        {name}
                    </Link>
                ))}
            </div>
        </nav>
    );
} 