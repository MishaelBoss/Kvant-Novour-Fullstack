"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getResponseDetail, gradeAnswer } from "@/app/lib/api";

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

export default function ResponseDetailPage() {
    const { responseId } = useParams();
    const [data, setData] = useState<FullResponseDetail | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (responseId) getResponseDetail(Number(responseId)).then(setData);
    }, [responseId]);

    const handleSaveGrade = async (ansId: number, score: number) => {
        const success = await gradeAnswer(ansId, score);
        if (success) {
            setData((prev: FullResponseDetail | null) => {
                if (!prev) return null;

                return {
                    ...prev,
                    answers: prev.answers.map((a: AnswerDetail) => 
                        a.id === ansId 
                            ? { ...a, manual_score: score, is_reviewed: true } 
                            : a
                    )
                };
            });
        }
    };

    if (!data) return <div className="p-8 text-center text-gray-400">Загрузка данных...</div>;

    return (
        <div className="min-h-screen bg-[#f4f5f7] p-4 md:p-8">
            <div className="max-w-[720px] mx-auto flex flex-col gap-6">
                <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-800 cursor-pointer">
                    ← Назад к списку
                </button>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200/50">
                    <h1 className="text-xl font-bold text-gray-800">{data.respondent_name}</h1>
                    <p className="text-sm text-gray-400">{data.school}, {data.grade}</p>
                </div>

                {data.answers.map((ans: AnswerDetail) => (
                    <div key={ans.id} className={`bg-white p-6 rounded-3xl border ${ans.is_reviewed ? 'border-gray-200/50' : 'border-amber-200 bg-amber-50/20'}`}>
                        <p className="text-sm font-semibold text-gray-700 mb-3">{ans.question_text}</p>
                        
                        <div className="p-4 bg-gray-50 rounded-2xl text-sm text-gray-600 mb-4">
                            {ans.text_value || ans.selected_choices.join(', ') || "Нет ответа"}
                        </div>

                        {ans.max_points > 0 && (
                            <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                                <span className="text-xs font-bold text-gray-400 uppercase">Баллы за ответ:</span>
                                <input 
                                    type="number" 
                                    min={0}
                                    defaultValue={ans.manual_score}
                                    id={`score-${ans.id}`}
                                    max={ans.max_points}
                                    className="w-20 px-3 py-1.5 border border-gray-200 rounded-xl outline-none focus:border-blue-400 text-center text-sm"
                                />
                                <button 
                                    type="button"
                                    onClick={() => {
                                        const input = document.getElementById(`score-${ans.id}`) as HTMLInputElement;
                                        let val = Number(input.value);

                                        if (val > ans.max_points) {
                                            alert(`Максимальный балл за этот вопрос: ${ans.max_points}`);
                                            val = ans.max_points;
                                            input.value = String(ans.max_points);
                                        }
                                        if (val < 0) {
                                            val = 0;
                                            input.value = "0";
                                        }
                                        handleSaveGrade(ans.id, val);
                                    }}
                                    className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg cursor-pointer">
                                    Сохранить балл
                                </button>
                                <span className="text-xs text-gray-400">из {ans.max_points}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}