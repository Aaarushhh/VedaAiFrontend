'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import MobileTopBar from '@/components/MobileTopBar';
import MobileBottomNav from '@/components/MobileBottomNav';
import QuestionPaper from '@/components/QuestionPaper';
import { useAssignmentStore } from '@/store/assignmentStore';
import { getSocket } from '@/lib/socket';

type AnyRecord = Record<string, unknown>;

function isPaperLike(value: unknown): value is AnyRecord {
  if (!value || typeof value !== 'object') return false;
  const v = value as AnyRecord;
  return Array.isArray(v.sections) || typeof v.schoolName === 'string';
}

function extractPaper(payload: unknown): unknown | null {
  if (!payload || typeof payload !== 'object') return null;
  const p = payload as AnyRecord;

  const candidates = [
    p.generatedPaper,
    p.paper,
    p.questionPaper,
    (p.data as AnyRecord | undefined)?.generatedPaper,
    (p.data as AnyRecord | undefined)?.paper,
    (p.data as AnyRecord | undefined)?.questionPaper,
    p.data,
  ];

  for (const c of candidates) {
    if (isPaperLike(c)) return c;
  }

  if (isPaperLike(payload)) return payload;
  return null;
}

export default function AssignmentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const currentPaper = useAssignmentStore((s) => s.currentPaper);
  const isGenerating = useAssignmentStore((s) => s.isGenerating);
  const generationMessage = useAssignmentStore((s) => s.generationMessage);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    const { currentPaper: existing, assignments, setCurrentPaper } =
      useAssignmentStore.getState();

    if (existing) {
      setLoading(false);
      return;
    }

    const inStore = assignments.find((a) => a._id === id);
    const cached = extractPaper(inStore);
    if (cached) {
      setCurrentPaper(cached);
      setLoading(false);
      return;
    }

    const apiBase = process.env.NEXT_PUBLIC_API_URL;
    if (!apiBase) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    axios
      .get(`${apiBase}/api/assignments/${id}`)
      .then((res) => {
        if (cancelled) return;
        const payload = res.data;
        console.log('[AssignmentPage] /api/assignments/:id response →', payload);
        const paper = extractPaper(payload);
        if (paper) {
          setCurrentPaper(paper);
          setLoading(false);
          return;
        }

        const status =
          (payload as AnyRecord)?.status ??
          ((payload as AnyRecord)?.data as AnyRecord | undefined)?.status;

        if (status === 'failed') {
          toast.error('Generation failed for this assignment.');
          setLoading(false);
          return;
        }

        const socket = getSocket();
        socket.on(`assignment:${id}`, (socketData: AnyRecord) => {
          if (cancelled) return;
          const incoming = extractPaper(socketData);
          if (incoming) {
            setCurrentPaper(incoming);
            setLoading(false);
            return;
          }
          if (socketData?.status === 'failed') {
            toast.error('Generation failed.');
            setLoading(false);
          }
        });
      })
      .catch((err) => {
        console.error('Failed to fetch assignment', err);
        if (!cancelled) {
          toast.error('Could not load this assignment.');
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <>
      <div className="min-h-screen md:hidden">
        <MobileTopBar />
        <main className="px-2 pb-24 pt-2">
          {loading || isGenerating ? (
            <div className="flex min-h-[60vh] flex-col items-center justify-center">
              <div className="mb-6 h-12 w-12 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900" />
              <h2 className="mb-2 text-base font-semibold text-zinc-800">
                {generationMessage || 'Loading your question paper...'}
              </h2>
              <p className="text-xs text-zinc-500">This may take a few seconds</p>
            </div>
          ) : currentPaper ? (
            <QuestionPaper paper={currentPaper} />
          ) : (
            <div className="flex min-h-[60vh] flex-col items-center justify-center">
              <p className="mb-4 text-zinc-600">Paper not found.</p>
              <button
                onClick={() => router.push('/')}
                className="rounded-full bg-zinc-900 px-5 py-2 text-sm text-white transition hover:bg-zinc-800"
              >
                Go back
              </button>
            </div>
          )}
        </main>
        <MobileBottomNav />
      </div>

      <div className="hidden min-h-screen md:flex">
        <Sidebar />
        <div className="ml-[344px] mr-3 flex min-h-screen flex-1 flex-col">
          <TopBar title="Assignment Output" />
          <main className="flex-1 py-4">
            {loading || isGenerating ? (
              <div className="flex min-h-[60vh] flex-col items-center justify-center">
                <div className="mb-6 h-16 w-16 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900" />
                <h2 className="mb-2 text-lg font-semibold text-zinc-800">
                  {generationMessage || 'Loading your question paper...'}
                </h2>
                <p className="text-sm text-zinc-500">This may take a few seconds</p>
              </div>
            ) : currentPaper ? (
              <QuestionPaper paper={currentPaper} />
            ) : (
              <div className="flex min-h-[60vh] flex-col items-center justify-center">
                <p className="mb-4 text-zinc-600">Paper not found.</p>
                <button
                  onClick={() => router.push('/')}
                  className="rounded-full bg-zinc-900 px-5 py-2 text-sm text-white transition hover:bg-zinc-800"
                >
                  Go back
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
