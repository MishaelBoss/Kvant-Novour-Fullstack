import { useCallback, useEffect, useState } from "react";
import { CreateNewsModal } from "./CreateNewsModal"
import { deleteNews, getListNews } from "@/app/lib/api";
import Link from "next/link";
import { DeleteConfirmModal } from "../../components/DeleteConfirmModal";
import { INews } from "@/app/types/news.interface";

export function News() {
    const [news, setNews] = useState<INews[]>([]);
    const [count, setCountNews] = useState(0);

    const fetchNews = useCallback(async () => {
        const res = await getListNews();

        if (Array.isArray(res?.results)) {
            setNews(res.results);
            setCountNews(res.count ?? 0);
        } else {
            setNews([]);
        }
    }, []);

    useEffect(() => {
        fetchNews();

        const handleCustomEvent = () => {
            fetchNews();
        };

        window.addEventListener("fetchListNews", handleCustomEvent);

        return () => {
            window.removeEventListener("fetchListNews", handleCustomEvent);
        };
    }, [fetchNews]);

    return (
        <main className="flex-1 bg-white rounded-[24px] p-6 md:p-10 shadow-sm border border-gray-200/50">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold">Всего новостей: {count}</h1>
                <CreateNewsModal news={null}>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                        Добавить
                    </button>
                </CreateNewsModal>
            </div>

            <div className="flex flex-col gap-4">
                {news?.map((item) => (
                    <div 
                        key={item.id} 
                        className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow gap-4"
                    >
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                    {item.title}
                                </h3>
                                <span className="text-xs text-[#656d78] shrink-0">
                                    {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Нет даты'}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                {item.content}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
                            <Link 
                                href={`/news/${item.id}`}
                                className="flex-1 md:flex-none text-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                            >
                                Открыть
                            </Link>
                            
                            <button title="Редактировать"
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
                                <svg xmlns="http://w3.org" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>
                                </svg>
                            </button>
                            
                            <DeleteConfirmModal title={item.title} onConfirm={async () => await deleteNews(item.id)}>
                                <button 
                                    type="button" 
                                    title="Удалить" 
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                                    <svg xmlns="http://w3.org" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
                                    </svg>
                                </button>
                            </DeleteConfirmModal>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}