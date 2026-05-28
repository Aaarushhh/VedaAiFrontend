'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';
import { Assignment, useAssignmentStore } from '@/store/assignmentStore';

interface Props {
  assignment: Assignment;
}

function formatDate(iso?: string) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

const DotsIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden>
    <circle cx="10" cy="4.5" r="1.5" />
    <circle cx="10" cy="10" r="1.5" />
    <circle cx="10" cy="15.5" r="1.5" />
  </svg>
);

export default function AssignmentCard({ assignment }: Props) {
  const router = useRouter();
  const removeAssignment = useAssignmentStore((s) => s.removeAssignment);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const open = () => {
    setMenuOpen(false);
    router.push(`/assignments/${assignment._id}`);
  };

  const askDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    const base = process.env.NEXT_PUBLIC_API_URL;
    if (!base) {
      removeAssignment(assignment._id);
      toast.success('Assignment deleted');
      setConfirmOpen(false);
      return;
    }

    setDeleting(true);
    try {
      await axios.delete(`${base}/api/assignments/${assignment._id}`);
      removeAssignment(assignment._id);
      toast.success('Assignment deleted');
      setConfirmOpen(false);
    } catch (err) {
      console.error('Delete failed', err);
      const status =
        axios.isAxiosError(err) && err.response?.status ? `(${err.response.status})` : '';
      toast.error(`Could not delete assignment ${status}`.trim());
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      }}
      className="relative cursor-pointer rounded-xl border border-zinc-200 bg-white px-3 py-2.5 shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-zinc-400 md:rounded-2xl md:px-6 md:py-5"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[11px] font-semibold text-zinc-900 md:text-lg md:font-bold">{assignment.title}</h3>
        <button
          type="button"
          aria-label="More options"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((o) => !o);
          }}
          className="-mr-1 -mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 md:-mr-2 md:h-8 md:w-8"
        >
          <DotsIcon />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between text-[9px] text-zinc-700 md:mt-10 md:text-xs">
        <span>
          <span className="font-semibold text-zinc-900">Assigned on</span> :{' '}
          {formatDate(assignment.createdAt)}
        </span>
        {assignment.dueDate && (
          <span>
            <span className="font-semibold text-zinc-900">Due</span> : {formatDate(assignment.dueDate)}
          </span>
        )}
      </div>

      {menuOpen && (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            className="fixed inset-0 z-10 cursor-default"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(false);
            }}
          />
          <div
            role="menu"
            onClick={(e) => e.stopPropagation()}
            className="absolute right-4 top-12 z-20 w-44 rounded-xl border border-zinc-200 bg-white p-1 shadow-lg"
          >
            <button
              type="button"
              role="menuitem"
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-800 hover:bg-zinc-100"
            >
              View Assignment
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={askDelete}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </>
      )}

      {confirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => {
            e.stopPropagation();
            if (!deleting) setConfirmOpen(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape' && !deleting) setConfirmOpen(false);
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
          >
            <h3 className="text-lg font-bold text-zinc-900">Delete assignment?</h3>
            <p className="mt-2 text-sm text-zinc-600">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-zinc-900">&ldquo;{assignment.title}&rdquo;</span>?
              This will permanently remove it from your database. This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                disabled={deleting}
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmOpen(false);
                }}
                className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={(e) => {
                  e.stopPropagation();
                  confirmDelete();
                }}
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-70"
              >
                {deleting && (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                )}
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
