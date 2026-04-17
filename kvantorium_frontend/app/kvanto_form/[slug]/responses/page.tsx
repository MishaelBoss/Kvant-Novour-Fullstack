"use client";

import { useEffect, useState } from "react";
import { getFormResponses } from "@/app/lib/api";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { FormResponseSummary } from "@/app/types/form.interface";
import { useParams, useRouter } from "next/navigation";

export default function ResponsesList() {
    const [responses, setResponses] = useState<FormResponseSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const params = useParams();
    const slug = params?.slug;

    useEffect(() => {
        if (!slug) return;
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await getFormResponses(slug as string);
                setResponses(data);
            } catch (err) {
                console.error("Ошибка загрузки результатов:", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [slug]);

    const needsReviewCount = responses.filter(r => r.needs_review).length;

    return (
        <div className="min-h-screen bg-[#f4f5f7] p-4 md:p-8">
            <div className="max-w-[860px] mx-auto flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => router.push('/profile?tab=kvantoForm')}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors cursor-pointer">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        К списку форм
                    </button>
                </div>

                {!loading && responses.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: 'Всего ответов', value: responses.length, color: 'text-gray-800' },
                            { label: 'Нужна проверка', value: needsReviewCount, color: 'text-amber-500' },
                            { label: 'Проверено', value: responses.length - needsReviewCount, color: 'text-green-500' },
                        ].map(stat => (
                            <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200/50 flex flex-col gap-1">
                                <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                                <span className="text-xs text-gray-400">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="bg-white rounded-[24px] shadow-sm border border-gray-200/50 overflow-hidden">

                    {loading ? (
                        <div className="flex flex-col gap-3 p-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse"/>
                            ))}
                        </div>
                    ) : responses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M10 6v4M10 12v.5M3 10a7 7 0 1014 0A7 7 0 003 10z" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                            </div>
                            <p className="text-sm font-medium text-gray-600">Ответов пока нет</p>
                            <p className="text-xs text-gray-400">Участники ещё не прошли эту форму</p>
                        </div>
                    ) : (
                        <>

                            <div className="grid grid-cols-[1fr_1fr_100px_80px_120px] px-6 py-3 bg-gray-50 border-b border-gray-100">
                                {['Участник', 'Данные', 'Дата', 'Баллы', 'Статус'].map(h => (
                                    <span key={h} className="text-xs font-semibold text-gray-400 uppercase tracking-wider last:text-right">{h}</span>
                                ))}
                            </div>
                            
                            <div className="divide-y divide-gray-50">
                                {responses.map(res => {
                                    const school = res.school && !['-', '—', ''].includes(res.school.trim()) ? res.school : null;
                                    const grade = res.grade && !['-', '—', ''].includes(res.grade.trim()) ? res.grade : null;

                                    return (
                                        <div
                                            key={res.id}
                                            onClick={() => router.push(`/kvanto_form/${slug}/responses/${res.id}`)}
                                            className="grid grid-cols-[1.5fr_1fr_100px_80px_120px] gap-4 items-center px-6 py-4 hover:bg-gray-50/50 cursor-pointer transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-xs font-semibold text-blue-500">
                                                        {res.full_name?.charAt(0).toUpperCase() || '?'}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-medium text-gray-800 truncate">{res.full_name}</p>
                                            </div>

                                            <div>
                                                {school || grade ? (
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {school}{school && grade && ' • '}{grade && `${grade} кл.`}
                                                    </p>
                                                ) : (
                                                    <span className="text-xs text-gray-300 italic">Не заполнено</span>
                                                )}
                                            </div>

                                            <p className="text-xs text-gray-400">
                                                {format(new Date(res.submitted_at), 'd MMM HH:mm', { locale: ru })}
                                            </p>

                                            <p className="text-sm font-bold text-blue-500">{res.total_score}</p>

                                            <div className="flex justify-end">
                                                {res.needs_review ? (
                                                    <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold uppercase">
                                                        Проверка
                                                    </span>
                                                ) : (
                                                    <span className="px-2.5 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-bold uppercase">
                                                        Готово
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
}