import { CartForms } from "@/app/components/CartForms";
import { PAGES } from "@/app/config/pages.config";
import { getAllFormsList } from "@/app/lib/api";
import { IFormItem } from "@/app/types/form.interface";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export function Forms() {
    const [forms, setForms] = useState<IFormItem[]>([]);
    const [count, setCountForm] = useState(0);

    const fetchForms = useCallback(async () => {
        const res = await getAllFormsList();

        if (Array.isArray(res?.results)) { 
            setForms(res.results);
            setCountForm(res.count ?? 0); 
        } else {
            setForms([]);
            setCountForm(0);
        }
    }, []);

    useEffect(() => {
        const handleFetchEvent = async() => await fetchForms();

        handleFetchEvent();

        window.addEventListener("fetchFormsList", handleFetchEvent);

        return () => {
            window.removeEventListener("fetchFormsList", handleFetchEvent);
        };
    }, [fetchForms]);

    if (forms.length === 0) {
        return (
            <main className="flex-1 bg-white rounded-[24px] p-6 md:p-10 shadow-sm border border-gray-200/50">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold">Всего форм: {count}</h1>
                    <Link href={PAGES.KVANTUM_FORM_NEW()} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                        Добавить
                    </Link>
                </div>

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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold">Всего форм: {count}</h1>
                <Link href={PAGES.KVANTUM_FORM_NEW()} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                    Добавить
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {forms.map((form) => (
                    <CartForms key={form.id} form={form}/>
                ))}
            </div>
        </main>
    );
}