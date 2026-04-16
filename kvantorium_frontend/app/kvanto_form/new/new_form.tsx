'use client';

import { FormCreate, FormSettings, Question } from "@/app/types/form.interface";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ModelConfirmAddForm } from "./_components/ModelConfirmAddForm";
import { Content } from "./_components/Content";
import { Settings } from "./_components/Settings";
import { QuestionCard } from "./_components/QuestionCard";
import { createForm } from "@/app/lib/api";

function generateId() {
    return Math.random().toString(36).slice(2, 9);
}

export default function NewForm() {
    const router = useRouter();

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'content' | 'settings'>('content');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);

    const [settings, setSettings] = useState<FormSettings>({
        timer_enabled: false,
        timer_seconds: 1800,
        one_question_per_page: true,
        show_results_after: true,
        require_profile: true,
    });

    const updateSettings = (patch: Partial<FormSettings>) => {
        setSettings(prev => ({ ...prev, ...patch }));
    };

    const addQuestion = () => {
        setQuestions(prev => [...prev, {
            id: generateId(),
            text: '',
            type: 'short_text',
            is_required: false,
            points: 0,
            order: prev.length,
            choices: [],
            media: null,
            correct_answer: '',
        }]);
    };

    const updateQuestion = (id: string, patch: Partial<Question>) => {
        setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...patch } : q));
    };

    const removeQuestion = (id: string) => {
        setQuestions(prev => prev.filter(q => q.id !== id));
    };

    const duplicateQuestion = (quest: Question) => {
        setQuestions(prev => [...prev, {
            id: generateId(),
            text: quest.text || '',
            type: quest.type || 'short_text',
            is_required: quest.is_required || false,
            points: quest.points || 0,
            order: quest.order || prev.length,
            choices: quest.choices || [],
            media: quest.media || null,
            correct_answer: quest.correct_answer || '',
        }]);
    };

    const addChoice = (questionId: string) => {
        setQuestions(prev => prev.map(q =>
            q.id === questionId
                ? { 
                    ...q, 
                    choices: [
                        ...q.choices, 
                        { 
                            id: generateId(), 
                            text: '', 
                            is_correct: false, 
                            order: q.choices.length
                        }
                    ] 
                }
                : q
        ));
    };

    const updateChoice = (questionId: string, choiceId: string, text: string) => {
        setQuestions(prev => prev.map(q =>
            q.id === questionId
                ? { ...q, choices: q.choices.map(c => c.id === choiceId ? { ...c, text } : c) }
                : q
        ));
    };

    const updateChoiceCorrect = (questionId: string, choiceId: string, is_correct: boolean) => {
        setQuestions(prev => prev.map(q => {
            if (q.id !== questionId) return q;

            const isRadioType = q.type === 'radio' || q.type === 'dropdown';
            return {
                ...q,
                choices: q.choices.map(c => ({
                    ...c,
                    is_correct: isRadioType
                        ? c.id === choiceId
                        : c.id === choiceId ? is_correct : c.is_correct,
                })),
            };
        }));
    };

    const removeChoice = (questionId: string, choiceId: string) => {
        setQuestions(prev => prev.map(q =>
            q.id === questionId
                ? { ...q, choices: q.choices.filter(c => c.id !== choiceId) }
                : q
        ));
    };

    const handleSave = async (status: 'draft' | 'active') => {
        if (!title.trim()) {
            setError('Введите название формы');
            return;
        }

        setError(null);
        setSaving(true);

        try {
            const formData: FormCreate = {
                title: title,
                description: description,
                deadline: deadline,
                status: status,
                questions: questions
            };
            
            const success = await createForm(formData, settings);

            setSaving(success);
            
            if (success) {
                if (status === 'active') {
                    router.push('/profile?tab=kvantoForm');
                }
            } else {
                alert('Ошибка сохранения формы');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f4f5f7] p-4 md:p-8">
            <div className="max-w-[860px] mx-auto flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <Link
                        href="#"
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors cursor-pointer">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Назад
                    </Link>
                    {error && (
                        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                            {error}
                        </div>
                    )}
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleSave('draft')}
                            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            {saving ? 'Сохранение...' : 'Сохранить'}
                        </button>
                        <ModelConfirmAddForm onPublish={() => handleSave('active')}>
                            <button
                                className="px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
                                Опубликовать
                            </button>
                        </ModelConfirmAddForm>
                    </div>
                </div>

                <div className="bg-white rounded-[24px] p-6 md:p-8 shadow-sm border border-gray-200/50 flex flex-col gap-6">
                    <div className="flex gap-6 border-b border-gray-100 -mt-2 mb-2">
                        <button 
                            onClick={() => setActiveTab('content')}
                            className={`pb-3 text-sm font-medium transition-all relative cursor-pointer ${
                                activeTab === 'content' ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'
                            }`}>
                            Контент
                            {activeTab === 'content' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
                            )}
                        </button>
                        <button 
                            onClick={() => setActiveTab('settings')}
                            className={`pb-3 text-sm font-medium transition-all relative cursor-pointer ${
                                activeTab === 'settings' ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'
                            }`}>
                            Настройки
                            {activeTab === 'settings' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
                            )}
                        </button>
                    </div>

                    {activeTab === 'content' ? (
                        <Content 
                            title={title} 
                            setTitle={setTitle} 
                            description={description} 
                            setDescription={setDescription}
                            deadline={deadline}
                            setDeadline={setDeadline}
                        />
                    ) : (
                        <Settings settings={settings} updateSettings={updateSettings}/>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    {questions.map((q, index) => (
                        <QuestionCard
                            key={q.id}
                            question={q}
                            index={index}
                            onUpdate={updateQuestion}
                            onRemove={removeQuestion}
                            onDuplicate={duplicateQuestion}
                            onAddChoice={addChoice}
                            onUpdateChoice={updateChoice}
                            onUpdateChoiceCorrect={updateChoiceCorrect}
                            onRemoveChoice={removeChoice}
                        />
                    ))}
                </div>
                <button
                    onClick={addQuestion}
                    className="flex items-center justify-center gap-2 w-full py-3 text-sm text-gray-500 border-2 border-dashed border-gray-200 rounded-[20px] hover:border-blue-300 hover:text-blue-500 transition-colors cursor-pointer">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Добавить вопрос
                </button>
            </div>
        </div>
    );
}