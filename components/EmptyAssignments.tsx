'use client';
import { useRouter } from 'next/navigation';

const EmptyIllustration = () => (
  <svg viewBox="0 0 260 220" className="h-44 w-44 md:h-96 md:w-96" aria-hidden>
    <defs>
      <radialGradient id="bgGlow" cx="0.5" cy="0.5" r="0.55">
        <stop offset="0%" stopColor="#f4f4f5" stopOpacity="0.9" />
        <stop offset="70%" stopColor="#f4f4f5" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#f4f4f5" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="paperGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#fafafa" />
      </linearGradient>
      <radialGradient id="glassGrad" cx="0.35" cy="0.3" r="0.7">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
        <stop offset="60%" stopColor="#f1f5f9" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.45" />
      </radialGradient>
      <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
        <feOffset dx="0" dy="4" result="offsetblur" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.18" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <circle cx="130" cy="110" r="100" fill="url(#bgGlow)" />

    <g transform="translate(60 30) rotate(-6 60 75)" filter="url(#softShadow)">
      <rect x="0" y="0" width="120" height="150" rx="10" fill="url(#paperGrad)" stroke="#e5e7eb" strokeWidth="1" />
      <rect x="14" y="18" width="32" height="10" rx="2" fill="#27272a" />
      <rect x="50" y="20" width="40" height="6" rx="3" fill="#e4e4e7" />
      <rect x="14" y="38" width="92" height="3.5" rx="1.75" fill="#e4e4e7" />
      <rect x="14" y="47" width="92" height="3.5" rx="1.75" fill="#e4e4e7" />
      <rect x="14" y="56" width="70" height="3.5" rx="1.75" fill="#e4e4e7" />
      <rect x="14" y="74" width="92" height="3.5" rx="1.75" fill="#e4e4e7" />
      <rect x="14" y="83" width="92" height="3.5" rx="1.75" fill="#e4e4e7" />
      <rect x="14" y="92" width="60" height="3.5" rx="1.75" fill="#e4e4e7" />
      <rect x="14" y="110" width="92" height="3.5" rx="1.75" fill="#e4e4e7" />
      <rect x="14" y="119" width="80" height="3.5" rx="1.75" fill="#e4e4e7" />
      <rect x="14" y="128" width="50" height="3.5" rx="1.75" fill="#e4e4e7" />
    </g>

    <path
      d="M58 38 C 54 32, 62 26, 70 30 C 76 33, 72 42, 66 42 C 60 42, 56 38, 60 34"
      stroke="#27272a"
      strokeWidth="1.75"
      fill="none"
      strokeLinecap="round"
    />

    <circle cx="76" cy="56" r="4" fill="#a855f7" />
    <circle cx="76" cy="56" r="1.5" fill="#fff" opacity="0.5" />

    <g transform="translate(130 95)" filter="url(#softShadow)">
      <circle cx="40" cy="40" r="42" fill="#ffffff" opacity="0.4" />
      <circle cx="40" cy="40" r="38" fill="url(#glassGrad)" stroke="#cbd5e1" strokeWidth="3" />
      <ellipse cx="28" cy="28" rx="10" ry="6" fill="#ffffff" opacity="0.55" transform="rotate(-30 28 28)" />
      <path
        d="M28 28 L52 52 M52 28 L28 52"
        stroke="#ef4444"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <rect
        x="68"
        y="68"
        width="12"
        height="32"
        rx="6"
        transform="rotate(-45 68 68)"
        fill="#94a3b8"
        stroke="#64748b"
        strokeWidth="1.5"
      />
      <rect
        x="94"
        y="94"
        width="12"
        height="10"
        rx="3"
        transform="rotate(-45 94 94)"
        fill="#475569"
      />
    </g>

    <circle cx="208" cy="120" r="3.5" fill="#60a5fa" />
    <path
      d="M50 145 l3 -3 M53 145 l-3 -3"
      stroke="#fbbf24"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M225 60 l3 -3 M228 60 l-3 -3"
      stroke="#22d3ee"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
    <circle cx="40" cy="100" r="2" fill="#a855f7" opacity="0.5" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden>
    <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default function EmptyAssignments() {
  const router = useRouter();

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10 md:px-6 md:py-20">
      <div className="flex max-w-2xl flex-col items-center text-center">
        <EmptyIllustration />
        <h2 className="mt-5 text-2xl font-semibold text-zinc-900 md:mt-8 md:text-4xl">No assignments yet</h2>
        <p className="mt-3 text-[11px] leading-5 text-zinc-500 md:mt-5 md:text-lg md:leading-8">
          Create your first assignment to start collecting and grading student submissions. You can
          set up rubrics, define marking criteria, and let AI assist with grading.
        </p>
        <button
          type="button"
          onClick={() => router.push('/create')}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2 text-[11px] font-medium text-white transition hover:bg-zinc-800 md:mt-10 md:gap-3 md:px-8 md:py-4 md:text-lg"
        >
          <PlusIcon />
          Create Your First Assignment
        </button>
      </div>
    </div>
  );
}
