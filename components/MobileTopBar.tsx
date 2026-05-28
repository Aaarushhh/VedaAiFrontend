'use client';

const VedaMark = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
    <rect x="1" y="1" width="22" height="22" rx="6" fill="#2f2f32" />
    <path
      d="M6.7 7h2.6l2.7 7.1L14.7 7h2.6l-4.4 10.2h-1.8L6.7 7Z"
      fill="#f4f4f5"
    />
  </svg>
);

const BellIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 text-zinc-700" aria-hidden>
    <path
      d="M5 8a5 5 0 1 1 10 0v3l1.5 2.5h-13L5 11V8Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M8 16a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const MenuIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 text-zinc-600" aria-hidden>
    <path d="M4 6h12M4 10h12M4 14h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const Avatar = () => (
  <div className="flex h-6 w-6 items-center justify-center rounded-full border border-orange-400 bg-white">
    <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden>
      <circle cx="10" cy="7.2" r="3.2" fill="#7c2d12" />
      <ellipse cx="10" cy="15.8" rx="5.2" ry="3.4" fill="#1e3a8a" />
    </svg>
  </div>
);

export default function MobileTopBar() {
  return (
    <header className="md:hidden">
      <div className="mx-2 mt-2 flex h-10 items-center justify-between rounded-lg bg-white px-2.5">
        <div className="flex items-center gap-1.5">
          <VedaMark />
          <span className="text-[12px] font-semibold text-zinc-800">VedaAI</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button type="button" className="relative rounded-full p-1.5" aria-label="Notifications">
            <BellIcon />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
          </button>
          <Avatar />
          <button type="button" className="rounded-full p-1.5" aria-label="Menu">
            <MenuIcon />
          </button>
        </div>
      </div>
    </header>
  );
}
