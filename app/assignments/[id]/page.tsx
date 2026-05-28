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
import QuestionPaperGenerating from '@/components/QuestionPaperGenerating';
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
  const assignments = useAssignmentStore((s) => s.assignments);
  const currentPaper = useAssignmentStore((s) => s.currentPaper);
  const currentPaperAssignmentId = useAssignmentStore((s) => s.currentPaperAssignmentId);
  const isGenerating = useAssignmentStore((s) => s.isGenerating);
  const generatingAssignmentId = useAssignmentStore((s) => s.generatingAssignmentId);
  const generationMessage = useAssignmentStore((s) => s.generationMessage);
  const [loading, setLoading] = useState(true);

  const assignment = assignments.find((a) => a._id === id);
  const waitingOnGeneration = isGenerating && generatingAssignmentId === id;
  const pendingOnServer =
    assignment?.status === 'pending' || assignment?.status === 'processing';
  const paperForThisAssignment =
    currentPaper && currentPaperAssignmentId === id ? currentPaper : null;
  const showGeneratingView =
    !paperForThisAssignment && (waitingOnGeneration || loading || pendingOnServer);

  useEffect(() => {
    if (!id) return;

    const socket = getSocket();
    const event = `assignment:${id}`;

    const handler = (socketData: AnyRecord) => {
      const { setCurrentPaper, updateAssignment, setIsGenerating, setGenerationMessage } =
        useAssignmentStore.getState();

      if (typeof socketData.message === 'string') {
        setGenerationMessage(socketData.message);
      }

      const incoming = extractPaper(socketData);
      if (incoming) {
        setCurrentPaper(id, incoming);
        updateAssignment(id, { status: 'completed', generatedPaper: incoming });
        setIsGenerating(false);
        setLoading(false);
        return;
      }

      if (socketData.status === 'failed') {
        setIsGenerating(false);
        updateAssignment(id, { status: 'failed' });
        setLoading(false);
        toast.error('Generation failed. Please try again.');
      }
    };

    socket.on(event, handler);
    return () => {
      socket.off(event, handler);
    };
  }, [id]);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    const { currentPaperAssignmentId: paperId, assignments: list, setCurrentPaper, updateAssignment, setIsGenerating } =
      useAssignmentStore.getState();

    if (paperId === id) {
      setIsGenerating(false);
      setLoading(false);
      return;
    }

    const inStore = list.find((a) => a._id === id);
    const cached = extractPaper(inStore);
    if (cached) {
      setCurrentPaper(id, cached);
      setIsGenerating(false);
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
          setCurrentPaper(id, paper);
          updateAssignment(id, { status: 'completed', generatedPaper: paper });
          setIsGenerating(false);
          setLoading(false);
          return;
        }

        const body = payload as AnyRecord;
        const record = (body.data ?? body) as AnyRecord;
        const status = record.status ?? body.status;

        if (record.title || status) {
          const patch: { title?: string; status?: 'pending' | 'processing' | 'completed' | 'failed' } =
            {};
          if (typeof record.title === 'string') patch.title = record.title;
          if (status === 'pending' || status === 'processing' || status === 'completed' || status === 'failed') {
            patch.status = status;
          }
          if (Object.keys(patch).length > 0) updateAssignment(id, patch);
        }

        if (status === 'failed') {
          setIsGenerating(false);
          toast.error('Generation failed for this assignment.');
          setLoading(false);
          return;
        }

        if (status === 'completed') {
          setIsGenerating(false);
        }

        setLoading(false);
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

  const generatingTitle = assignment?.title;
  const generatingMessage =
    generationMessage ||
    (waitingOnGeneration ? 'Generating your question paper...' : 'Loading your question paper...');

  const outputContent = paperForThisAssignment ? (
    <QuestionPaper paper={paperForThisAssignment} />
  ) : showGeneratingView ? (
    <QuestionPaperGenerating
      title={generatingTitle}
      message={generatingMessage}
      totalQuestions={assignment?.totalQuestions}
      totalMarks={assignment?.totalMarks}
    />
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
  );

  return (
    <>
      <div className="min-h-screen md:hidden">
        <MobileTopBar />
        <main className="px-2 pb-24 pt-2">{outputContent}</main>
        <MobileBottomNav />
      </div>

      <div className="hidden min-h-screen md:flex">
        <Sidebar />
        <div className="ml-[344px] mr-3 flex min-h-screen flex-1 flex-col">
          <TopBar title="Assignment Output" />
          <main className="flex-1 py-4">{outputContent}</main>
        </div>
      </div>
    </>
  );
}
