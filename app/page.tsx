'use client';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import MobileTopBar from '@/components/MobileTopBar';
import MobileBottomNav from '@/components/MobileBottomNav';
import AssignmentCard from '@/components/AssignmentCard';
import EmptyAssignments from '@/components/EmptyAssignments';
import { useAssignmentStore } from '@/store/assignmentStore';

type StatusFilter = 'all' | 'pending' | 'processing' | 'completed' | 'failed';

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
];

const FilterIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
    <path
      d="M3 4.5h14L11.5 11v4.5l-3 1.5V11L3 4.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
    <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.75" />
    <path d="m13.5 13.5 3 3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
    <path
      d="M10 4v12M4 10h12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const BackIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
    <path d="M12 4 6 10l6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Home() {
  const router = useRouter();
  const { assignments, setAssignments } = useAssignmentStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL;
    if (!base) return;
    axios
      .get(`${base}/api/assignments`)
      .then((res) => setAssignments(res.data.data))
      .catch(console.error);
  }, [setAssignments]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return assignments.filter((a) => {
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
      if (q && !a.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [assignments, search, statusFilter]);

  return (
    <>
      <div className="min-h-screen md:hidden">
        <MobileTopBar />
        <main className="px-2 pb-24 pt-2">
          {assignments.length === 0 ? (
            <EmptyAssignments />
          ) : (
            <>
              <div className="mb-2 flex items-center justify-center rounded-lg bg-zinc-100 py-2">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="absolute left-3 inline-flex h-7 w-7 items-center justify-center rounded-full text-zinc-500"
                  aria-label="Go back"
                >
                  <BackIcon />
                </button>
                <h1 className="text-[11px] font-medium text-zinc-700">Assignments</h1>
              </div>

              <div className="mb-2 flex items-center gap-2 rounded-xl bg-zinc-100 p-2">
                <button
                  type="button"
                  onClick={() => setFilterOpen((o) => !o)}
                  className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] text-zinc-400"
                >
                  <FilterIcon />
                  Filter
                </button>

                {filterOpen && (
                  <>
                    <button
                      type="button"
                      aria-hidden
                      tabIndex={-1}
                      className="fixed inset-0 z-10 cursor-default"
                      onClick={() => setFilterOpen(false)}
                    />
                    <div
                      role="menu"
                      className="absolute left-3 top-[118px] z-20 w-36 rounded-xl border border-zinc-200 bg-white p-1 shadow-lg"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setStatusFilter(opt.value);
                            setFilterOpen(false);
                          }}
                          className={`block w-full rounded-lg px-2 py-1.5 text-left text-xs transition hover:bg-zinc-100 ${
                            statusFilter === opt.value
                              ? 'font-semibold text-zinc-900'
                              : 'text-zinc-700'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                <div className="relative flex-1">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-300">
                    <SearchIcon />
                  </span>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search Name"
                    className="w-full rounded-full border border-zinc-200 bg-white py-1.5 pl-9 pr-3 text-[10px] text-zinc-700 placeholder-zinc-300 focus:border-zinc-300 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                {filtered.map((a) => (
                  <AssignmentCard key={a._id} assignment={a} />
                ))}
              </div>
            </>
          )}
        </main>
        <MobileBottomNav />
      </div>

      <div className="hidden min-h-screen md:flex">
        <Sidebar />
        <div className="ml-[344px] mr-3 flex min-h-screen flex-1 flex-col">
          <TopBar title="Assignment" />

          {assignments.length === 0 ? (
            <EmptyAssignments />
          ) : (
            <main className="relative flex-1 py-6 pb-32">
              <header className="mb-4 flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-1.5 inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500"
                />
                <div>
                  <h1 className="text-base font-bold text-zinc-900">Assignments</h1>
                  <p className="text-xs text-zinc-500">
                    Manage and create assignments for your classes.
                  </p>
                </div>
              </header>

              <div className="mb-5 flex items-center justify-between gap-4 rounded-2xl bg-white px-5 py-3">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setFilterOpen((o) => !o)}
                    className="inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm font-normal text-zinc-400 transition hover:text-zinc-700"
                  >
                    <FilterIcon />
                    Filter By
                    {statusFilter !== 'all' && (
                      <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
                        {statusFilter}
                      </span>
                    )}
                  </button>

                  {filterOpen && (
                    <>
                      <button
                        type="button"
                        aria-hidden
                        tabIndex={-1}
                        className="fixed inset-0 z-10 cursor-default"
                        onClick={() => setFilterOpen(false)}
                      />
                      <div
                        role="menu"
                        className="absolute left-0 top-11 z-20 w-44 rounded-xl border border-zinc-200 bg-white p-1 shadow-lg"
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              setStatusFilter(opt.value);
                              setFilterOpen(false);
                            }}
                            className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition hover:bg-zinc-100 ${
                              statusFilter === opt.value
                                ? 'font-semibold text-zinc-900'
                                : 'text-zinc-700'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="relative w-full max-w-xl">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                    <SearchIcon />
                  </span>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search Assignment"
                    className="w-full rounded-full border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm text-zinc-700 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none"
                  />
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="mt-12 rounded-2xl border border-dashed border-zinc-300 bg-white py-12 text-center text-sm text-zinc-500">
                  No assignments match your filters.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {filtered.map((a) => (
                    <AssignmentCard key={a._id} assignment={a} />
                  ))}
                </div>
              )}

              <div className="pointer-events-none fixed bottom-6 left-[344px] right-3 z-30 flex justify-center">
                <Link
                  href="/create"
                  className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-lg ring-1 ring-black/5 transition hover:bg-zinc-800"
                >
                  <PlusIcon />
                  Create Assignment
                </Link>
              </div>
            </main>
          )}
        </div>
      </div>
    </>
  );
}
