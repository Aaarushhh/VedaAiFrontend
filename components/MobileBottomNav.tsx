'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const HomeIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 20 20" fill="none" className={`h-3.5 w-3.5 ${active ? 'text-white' : 'text-zinc-500'}`} aria-hidden>
    <rect x="2.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="11.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="2.5" y="11.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="11.5" y="11.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const DocIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 20 20" fill="none" className={`h-3.5 w-3.5 ${active ? 'text-white' : 'text-zinc-500'}`} aria-hidden>
    <path
      d="M5 2.5h6.5L15 6v10.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <path d="M11 2.75V6h3.25" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

const LibraryIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 20 20" fill="none" className={`h-3.5 w-3.5 ${active ? 'text-white' : 'text-zinc-500'}`} aria-hidden>
    <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.4" />
    <path d="M10 6v4l2.5 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ToolkitIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 20 20" fill="none" className={`h-3.5 w-3.5 ${active ? 'text-white' : 'text-zinc-500'}`} aria-hidden>
    <rect x="2.5" y="4" width="15" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M1.5 16.5h17" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 text-orange-500" aria-hidden>
    <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const navItems = [
  { href: '/home', label: 'Home', icon: HomeIcon },
  { href: '/', label: 'Assignments', icon: DocIcon },
  { href: '/library', label: 'Library', icon: LibraryIcon },
  { href: '/toolkit', label: 'AI Toolkit', icon: ToolkitIcon },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/' || pathname.startsWith('/assignments') || pathname === '/create';
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className="fixed inset-x-0 bottom-2 z-40 px-2 md:hidden">
        <div className="mx-auto flex max-w-sm items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-2 shadow-lg">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex min-w-0 flex-1 flex-col items-center gap-1"
              >
                <Icon active={active} />
                <span className={`text-[9px] leading-none ${active ? 'font-semibold text-white' : 'text-zinc-500'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      <Link
        href="/create"
        className="fixed bottom-[78px] right-2 z-40 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md md:hidden"
        aria-label="Create assignment"
      >
        <PlusIcon />
      </Link>
    </>
  );
}
