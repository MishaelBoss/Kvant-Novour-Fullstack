"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getResponseDetail, gradeAnswer } from "@/app/lib/api";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export interface AnswerDetail {
    id: number;
    question_text: string;
    question_type: string;
    max_points: number;
    text_value: string;
    selected_choices: string[];
    manual_score: number;
    is_reviewed: boolean;
}

export interface FullResponseDetail {
    id: number;
    respondent_name: string;
    school: string;
    grade: string;
    submitted_at: string;
    total_score: number;
    answers: AnswerDetail[];
}

const TYPE_LABELS: Record<string, string> = {
    short_text: 'Короткий текст',
    long_text: 'Длинный текст',
    radio: 'Один вариант',
    checkbox: 'Несколько вариантов',
    dropdown: 'Выпадающий список',
    number: 'Число',
};

export default function ResponseDetailPage() {
    const { responseId} = useParams();
    const [data, setData] = useState<FullResponseDetail | null>(null);
    const [saving, setSaving] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (responseId) getResponseDetail(Number(responseId)).then(setData);
    }, [responseId]);

    const handleSaveGrade = async (ansId: number, score: number, maxPoints: number) => {
        const clamped = Math.min(Math.max(0, score), maxPoints);
        setSaving(ansId);
        const success = await gradeAnswer(ansId, clamped);
        if (success) {
            setData(prev => {
                if (!prev) return null;
                const newAnswers = prev.answers.map(a =>
                    a.id === ansId ? { ...a, manual_score: clamped, is_reviewed: true } : a
                );
                const newTotal = newAnswers.reduce((sum, a) => sum + (a.manual_score || 0), 0);
                return { ...prev, answers: newAnswers, total_score: newTotal };
            });
        }
        setSaving(null);
    };

    if (!data) return (
        <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center">
            <p className="text-gray-400 text-sm">Загрузка...</p>
        </div>
    );

    const manualAnswers = data.answers.filter(a =>
        ['short_text', 'long_text'].includes(a.question_type) && a.max_points > 0
    );
    const reviewedCount = manualAnswers.filter(a => a.is_reviewed).length;
    const allReviewed = manualAnswers.length === 0 || reviewedCount === manualAnswers.length;

    return (
        <div className="min-h-screen bg-[#f4f5f7] p-4 md:p-8">
            <div className="max-w-[720px] mx-auto flex flex-col gap-6">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors cursor-pointer w-fit">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Назад к списку
                </button>

                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-200/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                <span className="text-lg font-bold text-blue-500">
                                    {data.respondent_name?.charAt(0).toUpperCase() || '?'}
                                </span>
                            </div>
                            <div>
                                <p className="text-base font-bold text-gray-800">{data.respondent_name}</p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {[data.school, data.grade && `${data.grade} кл.`].filter(Boolean).join(' • ') || 'Данные не заполнены'}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-blue-500">{data.total_score}</p>
                            <p className="text-xs text-gray-400">баллов</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-400">
                            {format(new Date(data.submitted_at), 'd MMMM yyyy, HH:mm', { locale: ru })}
                        </p>
                        {allReviewed ? (
                            <span className="px-2.5 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-bold uppercase">
                                Проверено
                            </span>
                        ) : (
                            <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold uppercase">
                                Проверено {reviewedCount} из {manualAnswers.length}
                            </span>
                        )}
                    </div>
                </div>

                {data.answers.map((ans, index) => {
                    const needsManual = ['short_text', 'long_text'].includes(ans.question_type) && ans.max_points > 0;

                    return (
                        <div
                            key={ans.id}
                            className={`bg-white rounded-[20px] p-6 shadow-sm border transition-colors ${
                                needsManual && !ans.is_reviewed
                                    ? 'border-amber-200'
                                    : 'border-gray-200/50'
                            }`}>
                            <div className="flex items-start justify-between gap-3 mb-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Вопрос {index + 1} · {TYPE_LABELS[ans.question_type] || ans.question_type}
                                    </span>
                                    <p className="text-sm font-medium text-gray-800">{ans.question_text}</p>
                                </div>
                                {ans.max_points > 0 && (
                                    <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                                        до {ans.max_points} б.
                                    </span>
                                )}
                            </div>

                            <div className="px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-700">
                                {ans.text_value || ans.selected_choices.join(', ') || (
                                    <span className="text-gray-300 italic">Нет ответа</span>
                                )}
                            </div>

                            {needsManual && (
                                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                                    <span className="text-xs text-gray-400 flex-1">
                                        {ans.is_reviewed ? 'Балл выставлен' : 'Выставьте балл'}
                                    </span>
                                    <input
                                        type="number"
                                        min={0}
                                        max={ans.max_points}
                                        defaultValue={ans.manual_score}
                                        id={`score-${ans.id}`}
                                        className="w-20 px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors text-center"
                                    />
                                    <span className="text-xs text-gray-400">из {ans.max_points}</span>
                                    <button
                                        type="button"
                                        disabled={saving === ans.id}
                                        onClick={() => {
                                            const input = document.getElementById(`score-${ans.id}`) as HTMLInputElement;
                                            handleSaveGrade(ans.id, Number(input.value), ans.max_points);
                                        }}
                                        className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg cursor-pointer transition-colors disabled:opacity-50">
                                        {saving === ans.id ? 'Сохраняю...' : 'Сохранить'}
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}

            </div>
        </div>
    );
}