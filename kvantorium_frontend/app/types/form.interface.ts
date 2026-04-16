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
    correct_answer: string;
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

export interface FormItem {
    id: number;
    title: string;
    description: string;
    status: 'draft' | 'active';
    created_at: string;
}

export interface ParticipantProfile {
    full_name: string;
    school: string;
    grade: string;
    birth_year: number;
    participated_before: boolean;
}

export interface FormDetail {
    id: number;
    title: string;
    description: string;
    slug: string;
    status: FormStatus;
    deadline: string | null;
    settings: FormSettings;
    questions: Question[];
}

export interface QuestionAnswer {
    question_id: string;
    text_value: string;
    selected_choice_ids: string[];
}

export interface QuizSession {
    profile: ParticipantProfile;
    answers: QuestionAnswer[];
}