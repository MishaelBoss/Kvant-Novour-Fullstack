"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ResultContent() {
    const { slug } = useParams();
    const router = useRouter();
    
    const [result] = useState(() => {
        if (typeof window !== 'undefined') {
            const rawResult = sessionStorage.getItem(`quiz_result_${slug}`);
            return rawResult ? JSON.parse(rawResult) : null;
        }
        return null;
    });

    const [session] = useState(() => {
        if (typeof window !== 'undefined') {
            const rawSession = sessionStorage.getItem(`quiz_profile_${slug}`);
            return rawSession ? { profile: JSON.parse(rawSession), answers: [] } : null;
        }
        return null;
    });

    const percentage = result && result.max_score > 0
        ? Math.round((result.auto_score / result.max_score) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center p-4">
            <div className="w-full max-w-120 flex flex-col gap-6 text-center">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path d="M6 16l7 7 13-13" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>

                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-gray-800">Тест завершён!</h1>
                    {session?.profile.full_name && (
                        <p className="text-sm text-gray-500">
                            Спасибо, <span className="font-medium text-gray-700">{session.profile.full_name}</span>
                        </p>
                    )}
                </div>

                {result?.show_results_after && result.max_score > 0 && (
                    <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-200/50 flex flex-col gap-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Ваш результат</p>
                        <div className="flex items-center justify-center">
                            <div className="relative w-28 h-28">
                                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="#F3F4F6" strokeWidth="10"/>
                                    <circle
                                        cx="50" cy="50" r="40" fill="none"
                                        stroke="#3B82F6" strokeWidth="10"
                                        strokeDasharray={`${2 * Math.PI * 40}`}
                                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentage / 100)}`}
                                        strokeLinecap="round"
                                        className="transition-all duration-700"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-bold text-gray-800">{percentage}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center gap-8">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-2xl font-bold text-blue-500">{result.auto_score}</span>
                                <span className="text-xs text-gray-400">набрано</span>
                            </div>
                            <div className="w-px bg-gray-100"/>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-2xl font-bold text-gray-300">{result.max_score}</span>
                                <span className="text-xs text-gray-400">максимум</span>
                            </div>
                        </div>

                        <p className="text-xs text-gray-400">
                            Открытые вопросы проверяются вручную — итоговый балл может измениться
                        </p>
                    </div>
                )}
                
                {result && !result.show_results_after && (
                    <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-200/50">
                        <p className="text-sm text-gray-500">
                            Результаты будут доступны после проверки организатором
                        </p>
                    </div>
                )}

                <button
                    onClick={() => router.push('/')}
                    className="w-full py-2.5 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                    На главную
                </button>
            </div>
        </div>
    );
}