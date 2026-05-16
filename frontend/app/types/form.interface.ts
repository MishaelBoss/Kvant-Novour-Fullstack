export type QuestionType = 'short_text' | 'long_text' | 'radio' | 'checkbox' | 'dropdown' | 'number';
export type MediaType = 'image' | 'audio' | 'video';

export type FormStatus = 'draft' | 'active' | 'closed';

export interface IChoice {
    id: string;
    text: string;
    is_correct: boolean;
    order: number;
}

export interface IQuestionMedia {
    type: MediaType;
    file: File;
    preview_url: string;
}

export interface IQuestion {
    id: string;
    text: string;
    type: QuestionType;
    is_required: boolean;
    points: number;
    order: number;
    choices: IChoice[];
    media: IQuestionMedia | null;
    correct_answer: string;
}

export interface IFormCreate {
    title: string;
    description: string;
    deadline: string;
    status: FormStatus;
    questions: IQuestion[];
}

export interface IFormSettings {
    timer_enabled: boolean;
    timer_seconds: number;
    one_question_per_page: boolean;
    show_results_after: boolean;
    require_profile: boolean;
    survey_for_authorized_users: boolean;
    one_time_participation_survey: boolean;
}

export interface IFormItem {
    id: number;
    title: string;
    description: string;
    status: 'draft' | 'active';
    created_at: string;
    responses_count: number;
}

export interface IParticipantProfile {
    full_name: string;
    school: string;
    grade: string;
    birth_year: number;
    participated_before: boolean;
}

export interface IFormDetail {
    id: number;
    title: string;
    description: string;
    slug: string;
    status: FormStatus;
    deadline: string | null;
    settings: IFormSettings;
    questions: IQuestion[];
}

export interface IQuestionAnswer {
    question_id: string;
    text_value: string;
    selected_choice_ids: string[];
}

export interface IQuizSession {
    profile: IParticipantProfile;
    answers: IQuestionAnswer[];
}

export interface IFormResponseSummary {
    id: number;
    full_name: string;
    submitted_at: string;
    total_score: number;
    needs_review: boolean;
    school: string;
    grade: string;
}