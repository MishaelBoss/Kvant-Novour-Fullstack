import Link from "next/link";
import { deleteForm } from "../lib/api";
import { IFormItem } from "../types/form.interface";
import { DeleteConfirmModal } from "./DeleteConfirmModal";

interface CartFormsProps {
    form: IFormItem;
}

export function CartForms({form}: CartFormsProps) {
    const handleDelete = async (id: number) => {
        const success = await deleteForm(id);
        if (success) {
            window.dispatchEvent(new Event("fetchFormsList"));
        };
    };

    function getNoun(number: number, one: string, two: string, five: string) {
        let n = Math.abs(number);
        n %= 100;
        if (n >= 5 && n <= 20) return five;
        n %= 10;
        if (n === 1) return one;
        if (n >= 2 && n <= 4) return two;
        return five;
    }

    return (
        <div className="relative group bg-white border border-gray-100 rounded-3xl p-6 transition-all hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${
                    form.status === 'active' 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : 'bg-amber-50 text-amber-600'
                }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${form.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <span className="text-[10px] text-[#656d78] font-bold uppercase tracking-wider">
                        {form.status === 'active' ? 'Опубликован' : 'Черновик'}
                    </span>
                </div>
                <span className="text-[12px] text-[#656d78] font-medium">
                    {new Date(form.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                </span>
            </div>

            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {form.title || "Без названия"}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed h-10">
                    {form.description || "Описание не заполнено..."}
                </p>
            </div>

            <Link 
                href={`/kvanto_form/${form.id}/responses`}
                className="flex items-center justify-center gap-2 w-full py-2.5 mb-5 bg-gray-50 text-gray-600 rounded-xl text-sm font-semibold hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                Посмотреть ответы
            </Link>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex items-center gap-1.5 text-gray-400">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span className="text-[11px] font-bold text-[#595e68] uppercase tracking-tight">
                        {form.responses_count} {getNoun(form.responses_count, 'ответ', 'ответа', 'ответов')}
                    </span>
                </div>

                <div className="flex gap-1">
                    <Link 
                        href={`/kvanto_form/${form.id}`}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                        title="Предпросмотр">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                        </svg>
                    </Link>

                    <Link 
                        href={`/kvanto_form/edit/${form.id}`}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                        title="Редактировать">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                        </svg>
                    </Link>

                    <DeleteConfirmModal title={form.title} onConfirm={async () => await handleDelete(form.id)}>
                        <button 
                            type="button"
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                            title={`Удалить форму ${form.title}`}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                        </button>
                    </DeleteConfirmModal>
                </div>
            </div>
        </div>
    );
};