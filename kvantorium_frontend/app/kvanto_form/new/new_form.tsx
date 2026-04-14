'use client'
import { Question, QuestionType } from "@/app/types/form.interface";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ModelConfirmAddForm } from "./_components/ModelConfirmAddForm";
import { DropdownMenu } from "@radix-ui/themes";

const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
    short_text: 'Короткий текст',
    long_text: 'Длинный текст',
    radio: 'Один вариант',
    checkbox: 'Несколько вариантов',
    dropdown: 'Выпадающий список',
    number: 'Число',
};

const WITH_CHOICES: QuestionType[] = ['radio', 'checkbox', 'dropdown'];

function generateId() {
    return Math.random().toString(36).slice(2, 9);
}

export default function NewForm() {
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);

    const addQuestion = () => {
        setQuestions(prev => [...prev, {
            id: generateId(),
            text: '',
            type: 'short_text',
            is_required: false,
            points: 0,
            order: prev.length,
            choices: [],
        }]);
    };

    const updateQuestion = (id: string, patch: Partial<Question>) => {
        setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...patch } : q));
    };

    const removeQuestion = (id: string) => {
        setQuestions(prev => prev.filter(q => q.id !== id));
    };

    const changeType = (id: string, type: QuestionType) => {
        updateQuestion(id, {
            type,
            choices: WITH_CHOICES.includes(type)
                ? [{ id: generateId(), text: '', is_correct: false, order: 0 }]
                : [],
        });
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

    const removeChoice = (questionId: string, choiceId: string) => {
        setQuestions(prev => prev.map(q =>
            q.id === questionId
                ? { ...q, choices: q.choices.filter(c => c.id !== choiceId) }
                : q
        ));
    };

    const handleSave = (status: 'draft' | 'active') => {
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
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleSave('draft')}
                            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            Сохранить
                        </button>
                        <ModelConfirmAddForm>
                            <button
                                onClick={() => handleSave('active')}
                                className="px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
                                Опубликовать
                            </button>
                        </ModelConfirmAddForm>
                    </div>
                </div>
                <div className="bg-white rounded-[24px] p-6 md:p-8 shadow-sm border border-gray-200/50 flex flex-col gap-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Основное</p>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-600">Название формы</label>
                        <input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Новая форма"
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors"/>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-600">Описание</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Коротко о форме..."
                            rows={3}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors resize-none"/>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="deadline-input" className="text-sm text-gray-600">Дедлайн (необязательно)</label>
                        <input
                            id="deadline-input"
                            type="datetime-local"
                            value={deadline}
                            onChange={e => setDeadline(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors"/>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    {questions.map((q, index) => (
                        <div key={q.id} className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-200/50 flex flex-col gap-4">
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Вопрос {index + 1}
                                </span>
                                <DropdownMenu.Root>
                                    <DropdownMenu.Trigger>
                                        <button type="button" className="text-gray-300 hover:text-gray-500 !cursor-pointer pt-1 focus-visible:outline-none outline-none" aria-label="Настройки вопроса">
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fill="currentColor" fillRule="evenodd" d="M3 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M9.5 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" clipRule="evenodd"></path>
                                            </svg>
                                        </button>
                                    </DropdownMenu.Trigger>
                                    <DropdownMenu.Content>
                                        <DropdownMenu.Item className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-600 focus:bg-red-50 focus:text-red-700 outline-none !cursor-pointer">
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path fill="currentColor" fillRule="evenodd" d="M12 2.5H8A1.5 1.5 0 0 0 6.5 4v1H8a3 3 0 0 1 3 3v1.5h1A1.5 1.5 0 0 0 13.5 8V4A1.5 1.5 0 0 0 12 2.5M11 11h1a3 3 0 0 0 3-3V4a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v1H4a3 3 0 0 0-3 3v4a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3zM4 6.5h4A1.5 1.5 0 0 1 9.5 8v4A1.5 1.5 0 0 1 8 13.5H4A1.5 1.5 0 0 1 2.5 12V8A1.5 1.5 0 0 1 4 6.5" clipRule="evenodd"></path>
                                            </svg>
                                            Дублировать
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Item onClick={() => removeQuestion(q.id)} className="flex items-center gap-2 px-2 py-1.5 text-sm text-red-600 focus:bg-red-50 focus:text-red-700 outline-none !cursor-pointer">
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path fill="currentColor" fillRule="evenodd" d="M2 4h12M6 4V2h4v2M5 4v9a1 1 0 001 1h4a1 1 0 001-1V4H5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            Удалить
                                        </DropdownMenu.Item>
                                    </DropdownMenu.Content>
                                </DropdownMenu.Root>
                            </div>
                            <input
                                value={q.text}
                                onChange={e => updateQuestion(q.id, { text: e.target.value })}
                                placeholder="Текст вопроса..."
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors"/>
                            <div className="flex items-center gap-3 flex-wrap">
                                <select
                                    value={q.type}
                                    onChange={e => changeType(q.id, e.target.value as QuestionType)}
                                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors cursor-pointer bg-white"
                                    aria-label="Тип вопроса">
                                    {Object.entries(QUESTION_TYPE_LABELS).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={q.is_required}
                                        onChange={e => updateQuestion(q.id, { is_required: e.target.checked })}
                                        className="w-4 h-4 accent-blue-500 cursor-pointer"/>
                                    Обязательный
                                </label>
                            </div>
                            {WITH_CHOICES.includes(q.type) && (
                                <div className="flex flex-col gap-2 pl-1">
                                    {q.choices.map((choice, ci) => (
                                        <div key={choice.id} className="flex items-center gap-2">
                                            <span className="text-xs text-gray-400 w-4">{ci + 1}.</span>
                                            <input
                                                value={choice.text}
                                                onChange={e => updateChoice(q.id, choice.id, e.target.value)}
                                                placeholder={`Вариант ${ci + 1}`}
                                                className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors"/>
                                            <button
                                                onClick={() => removeChoice(q.id, choice.id)}
                                                className="text-gray-300 hover:text-red-400 transition-colors cursor-pointer"
                                                aria-label={`Удалить вариант ${ci + 1}`}>
                                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                    <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                    <button 
                                        onClick={() => addChoice(q.id)}
                                        className="self-start mt-1 text-sm text-blue-500 hover:text-blue-600 transition-colors cursor-pointer">
                                        + Добавить вариант
                                    </button>
                                </div>
                            )}
                        </div>
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