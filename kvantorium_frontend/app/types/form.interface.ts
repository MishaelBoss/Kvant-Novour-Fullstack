export type QuestionType = 'short_text' | 'long_text' | 'radio' | 'checkbox' | 'dropdown' | 'number';

export type FormStatus = 'draft' | 'active' | 'closed';

export interface Choice {
    id: string;
    text: string;
    is_correct: boolean;
    order: number;
}

export interface Question {
    id: string;
    text: string;
    type: QuestionType;
    is_required: boolean;
    points: number;
    order: number;
    choices: Choice[];
}

export interface FormCreate {
    title: string;
    description: string;
    deadline: string;
    status: FormStatus;
    questions: Question[];
}