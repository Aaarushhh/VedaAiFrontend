'use client';

interface Question {
  id: number;
  text: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Moderate' | 'Challenging';
  marks: number;
  type: string;
  answer?: string;
}

interface Section {
  title: string;
  instruction: string;
  questions: Question[];
}

interface Paper {
  schoolName: string;
  subject: string;
  className: string;
  timeAllowed: string;
  maxMarks: number;
  sections: Section[];
  answerKey: { questionId: number; answer: string }[];
  teacherName?: string;
  grade?: string;
  chapters?: string;
}

interface Props {
  paper: Paper;
}

const DownloadIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
    <path
      d="M5 3h6.5L15 6.5V16a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M9.5 8v4m0 0L7.75 10.25M9.5 12l1.75-1.75"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function QuestionPaper({ paper }: Props) {
  const handleDownload = () => {
    window.print();
  };

  const greeting = paper.teacherName ? `Certainly, ${paper.teacherName}! ` : '';
  const introLine = `${greeting}Here are customized Question Paper for your ${paper.grade ?? paper.className} ${paper.subject} classes${paper.chapters ? ` on ${paper.chapters}` : ''}.`;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 md:gap-4">
      <section className="no-print rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-white shadow-sm md:rounded-3xl md:px-6 md:py-5">
        <p className="text-[10px] font-medium leading-4 text-zinc-100 md:text-sm md:leading-6">{introLine}</p>
        <button
          type="button"
          onClick={handleDownload}
          className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-100 md:mt-4 md:gap-2 md:px-4 md:py-2 md:text-xs"
        >
          <DownloadIcon />
          Download as PDF
        </button>
      </section>

      <section
        id="paper-print-area"
        className="paper-print rounded-2xl border border-zinc-200 bg-white px-4 py-5 text-zinc-900 shadow-sm md:rounded-3xl md:px-12 md:py-12"
      >
        <header className="text-center">
          <h1 className="text-[12px] font-bold md:text-xl">{paper.schoolName}</h1>
          <p className="mt-0.5 text-[10px] md:mt-1 md:text-base">Subject: {paper.subject}</p>
          <p className="text-[10px] md:text-base">Class: {paper.className}</p>
        </header>

        <div className="mt-4 flex items-center justify-between text-[9px] md:mt-8 md:text-sm">
          <span>Time Allowed: {paper.timeAllowed}</span>
          <span>Maximum Marks: {paper.maxMarks}</span>
        </div>

        <p className="mt-2.5 text-[9px] md:mt-4 md:text-sm">All questions are compulsory unless stated otherwise.</p>

        <div className="mt-3 space-y-1.5 text-[9px] md:mt-5 md:space-y-2 md:text-sm">
          <p>
            Name:&nbsp;
            <span className="inline-block w-28 translate-y-[-1px] border-b border-zinc-500 align-middle md:w-52 md:translate-y-[-2px]" />
          </p>
          <p>
            Roll Number:&nbsp;
            <span className="inline-block w-22 translate-y-[-1px] border-b border-zinc-500 align-middle md:w-44 md:translate-y-[-2px]" />
          </p>
          <p>
            Class:&nbsp;{paper.className}
            <span className="ml-4">Section:&nbsp;</span>
            <span className="inline-block w-16 translate-y-[-1px] border-b border-zinc-500 align-middle md:w-32 md:translate-y-[-2px]" />
          </p>
        </div>

        {paper.sections.map((section, si) => (
          <div key={si} className="mt-5 md:mt-8">
            <h2 className="text-center text-[11px] font-bold md:text-base">{section.title}</h2>
            <p className="mt-2 text-[9px] font-semibold md:mt-4 md:text-sm">
              {section.questions[0]?.type ?? 'Questions'}
            </p>
            <p className="text-[9px] italic md:text-sm">{section.instruction}</p>

            <ol className="mt-2 space-y-1.5 text-[9px] md:mt-3 md:space-y-2 md:text-sm">
              {section.questions.map((q, qi) => (
                <li key={qi} className="flex gap-2">
                  <span className="min-w-[1.5rem] text-right tabular-nums">{q.id}.</span>
                  <span className="flex-1">
                    [{q.difficulty}] {q.text} [{q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}]
                  </span>
                </li>
              ))}
            </ol>
          </div>
        ))}

        <p className="mt-5 text-[9px] font-bold md:mt-8 md:text-sm">End of Question Paper</p>

        {paper.answerKey && paper.answerKey.length > 0 && (
          <div className="mt-6 md:mt-10">
            <h2 className="text-[10px] font-bold md:text-base">Answer Key:</h2>
            <ol className="mt-2.5 space-y-1.5 text-[9px] md:mt-4 md:space-y-3 md:text-sm">
              {paper.answerKey.map((ans, i) => (
                <li key={i} className="flex gap-2">
                  <span className="min-w-[1.5rem] text-right tabular-nums">{ans.questionId}.</span>
                  <span className="flex-1 whitespace-pre-line leading-4 md:leading-6">{ans.answer}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </section>
    </div>
  );
}
