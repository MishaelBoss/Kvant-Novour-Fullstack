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
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow gap-4">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-lg font-semibold text-gray-900 truncate">
                        {form.title || "Без названия"}
                    </h2>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        form.status === 'active'
                        ? 'bg-emerald-950 text-emerald-200 border border-emerald-800'
                        : 'bg-amber-950 text-amber-200 border border-amber-800'
                    }`}>
                        {form.status === 'active' ? 'Опубликована' : 'Черновик'}
                    </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                    <p className="text-sm text-gray-500 truncate">
                        {form.description || "Описание не заполнено..."}
                    </p>
                    <span className="text-[10px] text-gray-300">·</span>
                    <span className="text-xs text-gray-600 flex items-center gap-1">
                        <MessageSquareIcon className="w-3.5 h-3.5" />
                        {form.responses_count} {getNoun(form.responses_count, 'ответ', 'ответа', 'ответов')}
                    </span>
                    <span className="text-[10px] text-gray-300">·</span>
                    <span className="text-xs text-gray-600 shrink-0">
                        {new Date(form.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
                <Link
                    href={`/kvanto_form/${form.id}`}
                    className="flex-1 md:flex-none text-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <EyeIcon className="w-3.5 h-3.5 inline mr-1" />
                    Предпросмотр
                </Link>
                <Link
                    href={`/kvanto_form/${form.id}/responses`}
                    className="flex-1 md:flex-none text-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    Ответы
                </Link>
                <Link
                    href={`/kvanto_form/edit/${form.id}`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Редактировать">
                    <PencilIcon className="w-5 h-5"/>
                </Link>
                <DeleteConfirmModal title={form.title} onConfirm={async () => await handleDelete(form.id)}>
                    <button
                        type="button"
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title={`Удалить форму ${form.title}`}>
                        <Trash2Icon className="w-5 h-5"/>
                    </button>
                </DeleteConfirmModal>
            </div>
        </div>
    );
}
