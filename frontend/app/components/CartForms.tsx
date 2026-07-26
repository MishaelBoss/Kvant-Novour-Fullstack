import Link from "next/link";
import { deleteForm } from "../lib/api";
import { IFormItem } from "../types/form.interface";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { EyeIcon, MessageSquareIcon, PencilIcon, Trash2Icon } from "lucide-react";

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
        <div className="group flex items-center gap-4 px-5 py-4 bg-white border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-blue-500">
                    <rect x="2" y="2" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M5 6h8M5 9h6M5 12h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                    <Link
                        href={`/kvanto_form/${form.id}`}
                        className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors truncate">
                        {form.title || "Без названия"}
                    </Link>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        form.status === 'active'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-amber-50 text-amber-600'
                    }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${form.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {form.status === 'active' ? 'Опубликован' : 'Черновик'}
                    </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                    <p className="text-xs text-gray-400 truncate max-w-md">
                        {form.description || "Описание не заполнено..."}
                    </p>
                    <span className="text-[10px] text-gray-300">·</span>
                    <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
                        <MessageSquareIcon className="w-3 h-3" />
                        {form.responses_count} {getNoun(form.responses_count, 'ответ', 'ответа', 'ответов')}
                    </span>
                    <span className="text-[10px] text-gray-300">·</span>
                    <span className="text-[11px] text-gray-400">
                        {new Date(form.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link
                    href={`/kvanto_form/${form.id}/responses`}
                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                    title="Ответы">
                    <EyeIcon className="w-4 h-4"/>
                </Link>
                <Link
                    href={`/kvanto_form/edit/${form.id}`}
                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                    title="Редактировать">
                    <PencilIcon className="w-4 h-4"/>
                </Link>
                <DeleteConfirmModal title={form.title} onConfirm={async () => await handleDelete(form.id)}>
                    <button
                        type="button"
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                        title={`Удалить форму ${form.title}`}>
                        <Trash2Icon className="w-4 h-4"/>
                    </button>
                </DeleteConfirmModal>
            </div>
        </div>
    );
}
