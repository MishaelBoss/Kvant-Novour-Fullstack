export type QuestionType = 'short_text' | 'long_text' | 'radio' | 'checkbox' | 'dropdown' | 'number';
export type MediaType = 'image' | 'audio' | 'video';

export type FormStatus = 'draft' | 'active' | 'closed';

export interface Choice {
    id: string;
    text: string;
    is_correct: boolean;
    order: number;
}

export interface QuestionMedia {
    type: MediaType;
    file: File;
    preview_url: string;
}

export interface Question {
    id: string;
    text: string;
    type: QuestionType;
    is_required: boolean;
    points: number;
    order: number;
    choices: Choice[];
    media: QuestionMedia | null;
}

export interface FormCreate {
    title: string;
    description: string;
    deadline: string;
    status: FormStatus;
    questions: Question[];
}

export interface FormSettings {
    timer_enabled: boolean;
    timer_seconds: number;
    one_question_per_page: boolean;
    show_results_after: boolean;
    require_profile: boolean;
}
