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

    if (loading) return <div className="p-8 text-center text-gray-400">Загрузка данных...</div>;

    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Участник</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Данные</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Дата</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Баллы</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Статус</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {responses.map((res) => (
                        <tr 
                            key={res.id} 
                            onClick={() => router.push(`/kvanto_form/${slug}/responses/${res.id}`)}
                            className="hover:bg-gray-50/50 cursor-pointer transition-colors">
                            <td className="px-6 py-4">
                                <p className="text-sm font-semibold text-gray-800">{res.full_name}</p>
                            </td>
                            <td className="px-6 py-4">
                                <p className="text-xs text-gray-500">{res.school}, {res.grade}</p>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                                {format(new Date(res.submitted_at), 'd MMM HH:mm', { locale: ru })}
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-blue-600">
                                {res.total_score}
                            </td>
                            <td className="px-6 py-4 text-right">
                                {res.needs_review ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold uppercase">
                                        Нужна проверка
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-bold uppercase">
                                        Проверено
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}