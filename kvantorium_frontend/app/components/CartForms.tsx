import Link from "next/link";
import { FormItem } from "../types/form.interface";

interface CartFormsProps {
    form: FormItem;
}

export function CartForms({form}: CartFormsProps) {
    return (
        <div className="relative group bg-white border border-gray-100 rounded-3xl p-6 transition-all hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1">
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
                        href={`/kvanto_form/edit/${form.id}`}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                        title="Редактировать">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                    </Link>
                    
                    <Link 
                        href={`/kvanto_form/${form.id}`}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                        title="Предпросмотр">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
};