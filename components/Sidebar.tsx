'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAssignmentStore } from '@/store/assignmentStore';

type IconProps = { className?: string };

const HomeIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
    <rect x="2.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="11.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="2.5" y="11.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="11.5" y="11.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const GroupsIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
    <path
      d="M7 9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM13.5 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M2.5 16c.4-2.4 2.3-4 4.5-4s4.1 1.6 4.5 4M12.5 16c.3-1.8 1.7-3 3-3s2.7 1.2 3 3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const DocIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
    <path
      d="M5 2.5h6.5L15 6v10.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M11 2.75V6h3.25" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M6.75 10h6.5M6.75 13h6.5M6.75 7.5H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ToolkitIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
    <rect x="2.5" y="4" width="15" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M1.5 16.5h17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const LibraryIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
    <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10 6v4l2.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SettingsIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
    <circle cx="10" cy="10" r="2.25" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M16.5 10c0 .4 0 .8-.1 1.2l1.6 1.2-1.5 2.6-1.9-.6c-.6.5-1.3.9-2 1.1L12 17.5h-3l-.6-1.9c-.7-.2-1.4-.6-2-1.1l-1.9.6L3 12.5l1.6-1.2c0-.4-.1-.8-.1-1.2s0-.8.1-1.2L3 7.5 4.5 4.9l1.9.6c.6-.5 1.3-.9 2-1.1L9 2.5h3l.6 1.9c.7.2 1.4.6 2 1.1l1.9-.6 1.5 2.6-1.6 1.2c.1.4.1.8.1 1.3Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const SparkleIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
    <path
      d="M10 2.5 11.4 7l4.5 1.4-4.5 1.4L10 14.3l-1.4-4.5L4.1 8.4 8.6 7 10 2.5Z"
      fill="currentColor"
    />
    <path d="M15.5 12.5 16 14l1.5.5L16 15l-.5 1.5L15 15l-1.5-.5L15 14l.5-1.5Z" fill="currentColor" />
  </svg>
);

interface NavItem {
  href: string;
  label: string;
  icon: (p: IconProps) => React.ReactElement;
  matchPaths: string[];
}

const navItems: NavItem[] = [
  { href: '/home', label: 'Home', icon: HomeIcon, matchPaths: ['/home'] },
  { href: '/groups', label: 'My Groups', icon: GroupsIcon, matchPaths: ['/groups'] },
  { href: '/', label: 'Assignments', icon: DocIcon, matchPaths: ['/', '/create', '/assignments'] },
  { href: '/toolkit', label: "AI Teacher's Toolkit", icon: ToolkitIcon, matchPaths: ['/toolkit'] },
  { href: '/library', label: 'My Library', icon: LibraryIcon, matchPaths: ['/library'] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const assignmentsCount = useAssignmentStore((s) => s.assignments.length);

  const isActive = (item: NavItem) =>
    item.matchPaths.some((p) =>
      p === '/' ? pathname === '/' || pathname.startsWith('/assignments') || pathname === '/create' : pathname.startsWith(p),
    );

  return (
    <aside className="fixed left-3 top-3 bottom-3 z-30 flex w-80 flex-col rounded-3xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 px-5 pt-5 pb-12   ">
        <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" aria-hidden>
          <defs>
            <linearGradient id="vMark" x1="0.1" y1="0" x2="0.9" y2="1">
              <stop offset="0%" stopColor="#FF8A4C" />
              <stop offset="55%" stopColor="#F26A2C" />
              <stop offset="100%" stopColor="#D9491A" />
            </linearGradient>
            <linearGradient id="vGloss" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#d4d4d8" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <rect x="1" y="1" width="38" height="38" rx="9" fill="url(#vMark)" />
          <path
            d="M11 11.5h4.4l4.6 12 4.6-12H29l-7.5 17.2h-3L11 11.5Z"
            fill="url(#vGloss)"
          />
        </svg>
        <span className="text-[22px] font-bold tracking-tight text-zinc-900">VedaAI</span>
      </div>

      <div className="px-4 pb-14">
        <Link href="/create" className="block">
          <button
            type="button"
            className="group relative flex w-full items-center justify-center gap-2 rounded-full bg-zinc-900 px-4 py-3 text-sm font-medium text-white ring-2 ring-orange-500/80 ring-offset-2 ring-offset-white transition hover:bg-zinc-800"
          >
            <SparkleIcon className="h-4 w-4 text-white-400" />
            Create Assignment
          </button>
        </Link>
      </div>

      <nav className="flex-1 px-3">
        <ul className="space-y-1.5">
          {navItems.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                    active
                      ? 'bg-zinc-100 font-medium text-zinc-900'
                      : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                  {item.label === 'Assignments' && assignmentsCount > 0 && (
                    <span className="ml-auto inline-flex min-w-[1.5rem] items-center justify-center rounded-md bg-orange-500 px-1.5 py-0.5 text-xs font-semibold text-white">
                      {assignmentsCount}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-3 pb-2">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900"
        >
          <SettingsIcon className="h-5 w-5" />
          <span>Settings</span>
        </Link>
      </div>

      <div className="mx-3 mb-4 flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-2.5">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-amber-100 to-orange-200">
          <svg viewBox="0 0 40 40" className="absolute inset-0 h-full w-full" aria-hidden>
            <circle cx="20" cy="20" r="20" fill="#fde68a" />
            <ellipse cx="20" cy="13" rx="7" ry="3.5" fill="#1f2937" />
            <path d="M13 13 Q 13 6 20 6 Q 27 6 27 13 L 27 16 Q 24 14 20 14 Q 16 14 13 16 Z" fill="#1f2937" />
            <ellipse cx="20" cy="20" rx="6" ry="6.5" fill="#c4956c" />
            <circle cx="17.5" cy="20" r="0.9" fill="#1f2937" />
            <circle cx="22.5" cy="20" r="0.9" fill="#1f2937" />
            <path d="M18 23 Q 20 24.5 22 23" stroke="#1f2937" strokeWidth="0.8" strokeLinecap="round" fill="none" />
            <path d="M9 40 Q 9 28 20 28 Q 31 28 31 40 Z" fill="#1e3a8a" />
            <path d="M14 40 Q 14 31 20 31 Q 26 31 26 40 Z" fill="#fbbf24" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-zinc-900">Delhi Public School</p>
          <p className="truncate text-xs text-zinc-500">Bokaro Steel City</p>
        </div>
      </div>
    </aside>
  );
}
