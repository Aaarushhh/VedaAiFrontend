import { create } from 'zustand';

export interface QuestionType {
  type: string;
  count: number;
  marks: number;
}

export interface Assignment {
  _id: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalQuestions: number;
  totalMarks: number;
  createdAt: string;
  generatedPaper?: any;
}

interface AssignmentStore {
  assignments: Assignment[];
  currentPaper: any | null;
  isGenerating: boolean;
  generationMessage: string;
  setAssignments: (assignments: Assignment[]) => void;
  addAssignment: (assignment: Assignment) => void;
  removeAssignment: (id: string) => void;
  setCurrentPaper: (paper: any) => void;
  setIsGenerating: (val: boolean) => void;
  setGenerationMessage: (msg: string) => void;
}

export const useAssignmentStore = create<AssignmentStore>((set) => ({
  assignments: [],
  currentPaper: null,
  isGenerating: false,
  generationMessage: '',
  setAssignments: (assignments) => set({ assignments }),
  addAssignment: (assignment) =>
    set((state) => ({ assignments: [assignment, ...state.assignments] })),
  removeAssignment: (id) =>
    set((state) => ({ assignments: state.assignments.filter((a) => a._id !== id) })),
  setCurrentPaper: (paper) => set({ currentPaper: paper }),
  setIsGenerating: (val) => set({ isGenerating: val }),
  setGenerationMessage: (msg) => set({ generationMessage: msg }),
}));