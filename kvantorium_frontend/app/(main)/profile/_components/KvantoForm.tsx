"use client";

import { PAGES } from "@/app/config/page";
import { getMyFormsList } from "@/app/lib/api";
import { FormItem } from "@/app/types/form.interface";
import Link from "next/link";
import { useEffect, useState } from "react";

export function KvantoForm(){
    const [forms, setForms] = useState<FormItem[]>([]);

    useEffect(() => {
        const fetchForms = async () => {
            const res = await getMyFormsList();

            if(Array.isArray(res)){ 
                setForms(res);
            }
            else {
                setForms([]);
            }
        }

        fetchForms();
    }, []);

    if (forms.length === 0) {
        return (
            <main className="flex-1 bg-white rounded-[24px] p-6 md:p-10 shadow-sm border border-gray-200/50">
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4 text-center">
                    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="42" y="10" width="30" height="30" rx="6" stroke="#9CA3AF" strokeWidth="2.5"/>
                        <rect x="42" y="46" width="30" height="30" rx="6" stroke="#9CA3AF" strokeWidth="2.5"/>
                        <rect x="6" y="46" width="30" height="30" rx="6" stroke="#9CA3AF" strokeWidth="2.5"/>
                        <ellipse cx="20" cy="24" rx="14" ry="14" stroke="#9CA3AF" strokeWidth="2.5" strokeDasharray="5 3"/>
                        <rect x="6" y="10" width="30" height="30" rx="6" fill="#4F7EF7" opacity="0.15" stroke="#4F7EF7" strokeWidth="2"/>
                        <circle cx="22" cy="27" r="8" fill="#4F7EF7"/>
                        <path d="M18 27 L26 21 L26 33 Z" fill="white" transform="rotate(0 22 27) translate(1, 0)"/>
                    </svg>

                    <div className="flex flex-col gap-1">
                        <p className="text-base font-semibold text-gray-800">В списке ещё нет форм</p>
                        <p className="text-sm text-gray-500 max-w-xs">
                            Создайте свою первую форму с нуля или из шаблона вверху страницы
                        </p>
                    </div>

                    <Link href={PAGES.KVANTUM_FORM_NEW()} className="mt-1 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        Создать форму
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1 bg-white rounded-[24px] p-6 md:p-10 shadow-sm border border-gray-200/50">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-800">Мои формы</h2>
                <Link href={PAGES.KVANTUM_FORM_NEW()} className="px-4 py-2 text-sm text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition-all shadow-sm shadow-blue-200">
                    + Новая форма
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {forms.map((form) => (
                    <div key={form.id} className="relative group bg-white border border-gray-100 rounded-3xl p-6 transition-all hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${
                                form.status === 'active' 
                                ? 'bg-emerald-50 text-emerald-600' 
                                : 'bg-gray-100 text-gray-500'
                            }`}>
                                <span className="text-[11px] font-bold uppercase tracking-tight">
                                    {form.status === 'active' ? 'Опубликован' : 'Черновик'}
                                </span>
                            </div>
                            <span className="text-[12px] text-gray-400 font-medium">
                                {new Date(form.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                            </span>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                                {form.title || "Без названия"}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                                {form.description || "Описание не заполнено..."}
                            </p>
                        </div>

                        <div className="flex items-center justify-between pt-5 border-t border-gray-50">
                            <div className="flex -space-x-2">
                                <div className="flex items-center gap-1 text-gray-400">
                                    <span className="text-xs font-semibold">0 ответов</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Link 
                                    href={`/forms/edit/${form.id}`}
                                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                                    title="Редактировать"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                    </svg>
                                </Link>
                                
                                <Link 
                                    href={`/forms/preview/${form.id}`}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                                    title="Предпросмотр"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                        <circle cx="12" cy="12" r="3"/>
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}