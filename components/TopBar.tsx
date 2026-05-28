'use client';
import { useRouter } from 'next/navigation';

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  userName?: string;
}

const BackIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
    <path d="M12 4 6 10l6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const GridIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-[18px] w-[18px] text-zinc-500" aria-hidden>
    <rect x="2.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="11.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="2.5" y="11.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="11.5" y="11.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const BellIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5 text-zinc-700" aria-hidden>
    <path
      d="M5 8a5 5 0 1 1 10 0v3l1.5 2.5h-13L5 11V8Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M8 16a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ChevronDown = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 text-zinc-500" aria-hidden>
    <path d="m6 8 4 4 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Avatar = () => (
  <svg viewBox="0 0 40 40" className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-100 to-orange-200">
    <circle cx="20" cy="15" r="6" fill="#7c2d12" />
    <ellipse cx="20" cy="33" rx="11" ry="8" fill="#1e3a8a" />
    <ellipse cx="20" cy="32" rx="9" ry="6" fill="#fde68a" />
  </svg>
);

export default function TopBar({ title = 'Assignment', showBack = true, userName = 'John Doe' }: TopBarProps) {
  const router = useRouter();

  return (
    <header className="sticky top-3 z-20 mt-3 mr-3 flex h-16 items-center justify-between rounded-3xl border border-zinc-200 bg-white px-6 shadow-sm">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-700 transition hover:bg-zinc-100"
            aria-label="Go back"
          >
            <BackIcon />
          </button>
        )}
        <GridIcon />
        <h1 className="text-base font-medium text-zinc-900">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-zinc-100"
          aria-label="Notifications"
        >
          <BellIcon />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <div className="h-6 w-px bg-zinc-200" />

        <button
          type="button"
          className="flex items-center gap-2 rounded-full p-1 pr-2 transition hover:bg-zinc-100"
        >
          <Avatar />
          <span className="text-sm font-medium text-zinc-900">{userName}</span>
          <ChevronDown />
        </button>
      </div>
    </header>
  );
}
