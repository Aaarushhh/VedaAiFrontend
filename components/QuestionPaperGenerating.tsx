'use client';

interface Props {
  title?: string;
  message?: string;
  totalQuestions?: number;
  totalMarks?: number;
}

export default function QuestionPaperGenerating({
  title = 'Your assignment',
  message = 'Generating your question paper...',
  totalQuestions,
  totalMarks,
}: Props) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 md:gap-4">
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-white shadow-sm md:rounded-3xl md:px-6 md:py-5">
        <p className="text-[10px] font-medium leading-4 text-zinc-100 md:text-sm md:leading-6">
          {message}
        </p>
        <p className="mt-1 text-[9px] text-zinc-400 md:text-xs">
          {title}
          {totalQuestions != null && totalMarks != null
            ? ` · ${totalQuestions} questions · ${totalMarks} marks`
            : ''}
        </p>
        <div className="mt-3 flex items-center gap-2 md:mt-4">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-500 border-t-white" />
          <span className="text-[10px] text-zinc-300 md:text-xs">This may take a few seconds</span>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white px-4 py-5 text-zinc-900 shadow-sm md:rounded-3xl md:px-12 md:py-12">
        <div
          className="pointer-events-none absolute inset-0 bg-white/60 backdrop-blur-[1px]"
          aria-hidden
        />
        <div className="relative space-y-4 opacity-70">
          <div className="mx-auto h-4 w-48 animate-pulse rounded bg-zinc-200 md:h-5 md:w-64" />
          <div className="mx-auto h-3 w-36 animate-pulse rounded bg-zinc-100 md:w-44" />
          <div className="mx-auto h-3 w-28 animate-pulse rounded bg-zinc-100" />
          <div className="mt-6 flex justify-between">
            <div className="h-3 w-24 animate-pulse rounded bg-zinc-100" />
            <div className="h-3 w-28 animate-pulse rounded bg-zinc-100" />
          </div>
          {[1, 2, 3].map((block) => (
            <div key={block} className="mt-6 space-y-2">
              <div className="mx-auto h-3 w-40 animate-pulse rounded bg-zinc-200" />
              <div className="h-3 w-full animate-pulse rounded bg-zinc-100" />
              <div className="h-3 w-[92%] animate-pulse rounded bg-zinc-100" />
              <div className="h-3 w-[85%] animate-pulse rounded bg-zinc-100" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
