"use client";
import Link from "next/link";
import { DeleteConfirmModal } from "../../components/DeleteConfirmModal";
import { deleteNews } from "@/app/lib/api";
import { INews } from "@/app/types/news.interface";
import { PencilIcon, Trash2Icon } from "lucide-react";

interface Props {
    news: INews;
    fetch: () => Promise<void>;
}

export function NewsCard({ news, fetch }: Props) {
    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow gap-4">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {news.title}
                    </h3>
                    <span className="text-xs text-[#656d78] shrink-0">
                        {news.created_at ? new Date(news.created_at).toLocaleDateString() : 'Нет даты'}
                    </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {news.content}
                </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
                <Link
                    href={`/news/${news.id}`}
                    className="flex-1 md:flex-none text-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                    Открыть
                </Link>

                <button title="Редактировать"
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
                    <PencilIcon className="w-5 h-5" />
                </button>

                <DeleteConfirmModal title={news.title} onConfirm={async () => await deleteNews(news.id)} fetch={fetch}>
                    <button
                        type="button"
                        title="Удалить"
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                        <Trash2Icon className="w-5 h-5" />
                    </button>
                </DeleteConfirmModal>
            </div>
        </div>
    );
}