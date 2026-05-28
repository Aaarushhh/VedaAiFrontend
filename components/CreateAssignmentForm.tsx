'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import { useAssignmentStore } from '@/store/assignmentStore';
import { getSocket } from '@/lib/socket';

const QUESTION_TYPES = [
  'Multiple Choice Questions',
  'True/False Questions',
  'Short Questions',
  'Long Answer Questions',
  'Match the Following Questions',
  'Diagram/Graph-Based Questions',
  'Numerical Problems',
  'Fill in the Blanks',
];

interface QtRow {
  type: string;
  count: number;
  marks: number;
}

const defaultRows: QtRow[] = [
  { type: 'Multiple Choice Questions', count: 4, marks: 1 },
  { type: 'Short Questions', count: 3, marks: 2 },
  { type: 'Diagram/Graph-Based Questions', count: 5, marks: 5 },
  { type: 'Numerical Problems', count: 5, marks: 5 },
];

const CloudUploadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-zinc-500" aria-hidden>
    <path
      d="M7 16a4 4 0 0 1-.8-7.9 5 5 0 0 1 9.8-1.3A4.5 4.5 0 0 1 17.5 16H17"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M12 11v8M9 14l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 text-zinc-500" aria-hidden>
    <rect x="3" y="4.5" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M3 8h14M7 3v3M13 3v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 text-zinc-500" aria-hidden>
    <path d="m6 8 4 4 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" aria-hidden>
    <path d="M5 5l10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

const MinusIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" aria-hidden>
    <path d="M5 10h10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

const PlusIcon = ({ className = 'h-3.5 w-3.5' }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
    <path d="M10 5v10M5 10h10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

const MicIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 text-zinc-500" aria-hidden>
    <rect x="7.5" y="3" width="5" height="9" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5 10a5 5 0 0 0 10 0M10 15v2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

function Counter({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-1 py-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="flex h-6 w-6 items-center justify-center rounded-full text-zinc-600 transition hover:bg-zinc-100"
        aria-label="Decrease"
      >
        <MinusIcon />
      </button>
      <span className="min-w-[1.25rem] text-center text-sm font-medium text-zinc-900 tabular-nums">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="flex h-6 w-6 items-center justify-center rounded-full text-zinc-600 transition hover:bg-zinc-100"
        aria-label="Increase"
      >
        <PlusIcon />
      </button>
    </div>
  );
}

export default function CreateAssignmentForm() {
  const router = useRouter();
  const { addAssignment, setIsGenerating, setGenerationMessage, setCurrentPaper } = useAssignmentStore();

  const [dueDate, setDueDate] = useState('');
  const [rows, setRows] = useState<QtRow[]>(defaultRows);
  const [instructions, setInstructions] = useState('');
  const [fileName, setFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeNav, setActiveNav] = useState<'previous' | 'next'>('next');

  const totalQuestions = rows.reduce((sum, r) => sum + Number(r.count), 0);
  const totalMarks = rows.reduce((sum, r) => sum + Number(r.count) * Number(r.marks), 0);

  const updateRow = (i: number, patch: Partial<QtRow>) => {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  };

  const removeRow = (i: number) => setRows((prev) => prev.filter((_, idx) => idx !== i));

  const addRow = () => {
    const used = new Set(rows.map((r) => r.type));
    const next = QUESTION_TYPES.find((t) => !used.has(t)) ?? QUESTION_TYPES[0];
    setRows((prev) => [...prev, { type: next, count: 1, marks: 1 }]);
  };

  const handlePrevious = () => {
    setActiveNav('previous');
    router.push('/');
  };

  const handleNext = async () => {
    setActiveNav('next');

    if (!dueDate) {
      toast.error('Please select a due date.');
      return;
    }
    if (rows.length === 0) {
      toast.error('Please add at least one question type.');
      return;
    }

    const apiBase = process.env.NEXT_PUBLIC_API_URL;
    if (!apiBase) {
      console.warn('NEXT_PUBLIC_API_URL is not set. Skipping API call.');
      toast.success('Form is valid. No backend configured yet.', {
        description: `Would submit ${totalQuestions} questions / ${totalMarks} marks`,
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: fileName || 'Untitled assignment',
        dueDate,
        questionTypes: rows,
        additionalInstructions: instructions,
        totalQuestions,
        totalMarks,
      };
      console.log('[CreateAssignment] POST /api/assignments →', payload);

      const res = await axios.post(`${apiBase}/api/assignments`, payload);
      console.log('[CreateAssignment] response ←', res.data);

      const data = (res.data ?? {}) as Record<string, unknown>;
      const nested = (data.data ?? {}) as Record<string, unknown>;
      const assignmentId = (
        data.assignmentId ??
        data._id ??
        data.id ??
        nested.assignmentId ??
        nested._id ??
        nested.id
      ) as string | undefined;

      if (!assignmentId) {
        toast.error('Backend did not return an assignment id', {
          description: 'Check the network response — see browser console for details.',
        });
        return;
      }

      addAssignment({
        _id: assignmentId,
        title: fileName || 'Untitled assignment',
        dueDate,
        status: 'pending',
        totalQuestions,
        totalMarks,
        createdAt: new Date().toISOString(),
      });

      toast.success('Assignment saved', { description: `id: ${assignmentId}` });

      setIsGenerating(true);
      setGenerationMessage('Generating your question paper...');

      const socket = getSocket();
      socket.on(`assignment:${assignmentId}`, (data: { message?: string; status?: string; data?: unknown }) => {
        if (data.message) setGenerationMessage(data.message);
        if (data.status === 'completed') {
          setIsGenerating(false);
          setCurrentPaper(data.data);
          router.push(`/assignments/${assignmentId}`);
        }
        if (data.status === 'failed') {
          setIsGenerating(false);
          toast.error('Generation failed. Please try again.');
        }
      });
    } catch (err) {
      console.error('Failed to create assignment:', err);
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const serverMsg =
          (err.response?.data as { message?: string } | undefined)?.message ?? err.message;
        toast.error(`Failed to save assignment${status ? ` (${status})` : ''}`, {
          description: serverMsg,
        });
      } else {
        toast.error('Failed to reach backend', {
          description: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-3 md:gap-4">
      <div className="block rounded-lg bg-zinc-100 px-2 py-2 md:hidden">
        <div className="relative flex items-center justify-center">
          <button
            type="button"
            onClick={handlePrevious}
            className="absolute left-0 inline-flex h-7 w-7 items-center justify-center rounded-full text-zinc-500"
            aria-label="Go back"
          >
            <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
              <path d="M12 5 6 10l6 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h2 className="text-[11px] font-medium text-zinc-700">Create Assignment</h2>
        </div>
      </div>

      <div className="hidden px-2 pb-2 pt-2 md:block">
        <div className="flex items-start gap-3">
          <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />
          <div>
            <h2 className="text-xl font-bold text-zinc-900">Create Assignment</h2>
            <p className="mt-0.5 text-sm text-zinc-500">Set up a new assignment for your students</p>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl px-1 md:px-0">
        <div className="grid w-full grid-cols-2 gap-1.5 md:gap-2">
          <div className="h-1 rounded-full bg-zinc-700 md:h-1.5" />
          <div className="h-1 rounded-full bg-zinc-300 md:h-1.5" />
        </div>
      </div>

      <section className="mx-auto w-full max-w-5xl rounded-xl border border-zinc-200 bg-zinc-100/90 p-3 shadow-sm md:rounded-3xl md:border-white/70 md:bg-gradient-to-br md:from-white/85 md:via-white/65 md:to-white/45 md:p-8 md:backdrop-blur-xl">
        <div className="mb-4 md:mb-6">
          <h3 className="text-sm font-semibold text-zinc-900 md:text-base">Assignment Details</h3>
          <p className="text-[10px] text-zinc-500 md:text-xs">Basic information about your assignment</p>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) setFileName(file.name);
          }}
          className={`flex flex-col items-center justify-center rounded-xl border border-dashed px-4 py-6 text-center transition md:rounded-2xl md:border-2 md:px-6 md:py-10 ${
            dragOver ? 'border-zinc-400 bg-zinc-50' : 'border-zinc-200 bg-zinc-50/40'
          }`}
        >
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 md:mb-3 md:h-11 md:w-11">
            <CloudUploadIcon />
          </div>
          {fileName ? (
            <p className="text-xs font-medium text-zinc-800 md:text-sm">{fileName}</p>
          ) : (
            <>
              <p className="text-[10px] font-medium text-zinc-800 md:text-sm">Choose a file or drag &amp; drop it here</p>
              <p className="mt-1 text-[9px] text-zinc-400 md:text-xs">JPEG, PNG, upto 10MB</p>
            </>
          )}
          <label className="mt-3 inline-flex cursor-pointer items-center rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-[10px] font-medium text-zinc-700 transition hover:bg-zinc-50 md:mt-4 md:text-xs">
            Browse Files
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setFileName(f.name);
              }}
            />
          </label>
        </div>
        <p className="mt-2 text-center text-[9px] text-zinc-400 md:text-xs">Upload images of your preferred document/image</p>

        <div className="mt-4 md:mt-6">
          <label className="mb-1.5 block text-[10px] font-medium text-zinc-700 md:text-sm">Due Date</label>
          <div className="relative">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              placeholder="DD-MM-YYYY"
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 pr-9 text-[10px] text-zinc-700 focus:border-zinc-400 focus:outline-none md:rounded-xl md:px-4 md:py-2.5 md:pr-10 md:text-sm"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
              <CalendarIcon />
            </span>
          </div>
        </div>

        <div className="mt-4 md:mt-6">
          <div className="mb-2 hidden grid-cols-[minmax(0,1fr)_28px_140px_140px] items-center gap-3 px-1 text-xs font-medium text-zinc-500 md:grid">
            <span>Question Type</span>
            <span />
            <span className="text-center">No. of Questions</span>
            <span className="text-center">Marks</span>
          </div>

          <div className="flex flex-col gap-2 md:gap-3">
            {rows.map((row, i) => (
              <div
                key={i}
                className="rounded-lg bg-white/80 p-2 md:grid md:grid-cols-[minmax(0,1fr)_28px_140px_140px] md:items-center md:gap-3 md:rounded-none md:bg-transparent md:p-0"
              >
                <div className="mb-2 flex items-center gap-2 md:contents">
                  <div className="relative min-w-0 flex-1 md:flex-none">
                    <select
                      value={row.type}
                      onChange={(e) => updateRow(i, { type: e.target.value })}
                      className="w-full min-w-0 appearance-none rounded-full border border-zinc-200 bg-white px-3 py-1.5 pr-8 text-[10px] text-zinc-800 focus:border-zinc-400 focus:outline-none md:px-4 md:py-2 md:pr-9 md:text-sm"
                    >
                      {QUESTION_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                      <ChevronDownIcon />
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeRow(i)}
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 md:h-7 md:w-7"
                    aria-label="Remove row"
                  >
                    <XIcon />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 md:contents">
                  <div className="text-center text-[9px] font-medium text-zinc-500 md:hidden">No. of Questions</div>
                  <div className="text-center text-[9px] font-medium text-zinc-500 md:hidden">Marks</div>

                  <div className="flex justify-center">
                    <Counter value={row.count} onChange={(v) => updateRow(i, { count: v })} />
                  </div>

                  <div className="flex justify-center">
                    <Counter value={row.marks} onChange={(v) => updateRow(i, { marks: v })} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addRow}
            className="mt-3 inline-flex items-center gap-2 text-[10px] font-medium text-zinc-700 transition hover:text-zinc-900 md:mt-4 md:text-sm"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-white md:h-6 md:w-6">
              <PlusIcon className="h-2.5 w-2.5 md:h-3 md:w-3" />
            </span>
            Add Question Type
          </button>

          <div className="mt-3 flex flex-col items-end gap-0.5 text-[10px] md:mt-4 md:gap-1 md:text-sm">
            <span className="text-zinc-500">
              Total Questions: <strong className="text-zinc-900">{totalQuestions}</strong>
            </span>
            <span className="text-zinc-500">
              Total Marks: <strong className="text-zinc-900">{totalMarks}</strong>
            </span>
          </div>
        </div>

        <div className="mt-4 hidden md:block">
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">
            Additional Information <span className="font-normal text-zinc-400">(For better output)</span>
          </label>
          <div className="relative">
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={3}
              placeholder="e.g. Generate a question paper for 3 hour exam duration..."
              className="w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 pr-10 text-sm text-zinc-700 focus:border-zinc-400 focus:outline-none"
            />
            <button
              type="button"
              className="absolute bottom-3 right-3 flex h-7 w-7 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800"
              aria-label="Record voice"
            >
              <MicIcon />
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-1 pt-1 md:pt-2">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={loading}
          className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-[10px] font-medium shadow-sm transition disabled:opacity-50 md:gap-2 md:px-5 md:py-2 md:text-sm ${
            activeNav === 'previous'
              ? 'border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800'
              : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
          }`}
        >
          <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5 md:h-4 md:w-4" aria-hidden>
            <path d="M12 5 6 10l6 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Previous
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={loading}
          className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-[10px] font-medium shadow-sm transition disabled:opacity-50 md:gap-2 md:px-5 md:py-2 md:text-sm ${
            activeNav === 'next'
              ? 'border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800'
              : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
          }`}
        >
          {loading ? 'Creating...' : 'Next'}
          <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5 md:h-4 md:w-4" aria-hidden>
            <path d="M8 5l6 5-6 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
