import { useCallback, useEffect, useState } from "react";
import { CreateNewsModal } from "../CreateNewsModal"
import { deleteNews, getListNews } from "@/app/lib/api";
import Link from "next/link";
import { DeleteConfirmModal } from "../../../components/DeleteConfirmModal";
import { INews } from "@/app/types/news.interface";
import { PencilIcon, Trash2Icon } from "lucide-react";
import toast from "react-hot-toast";
import { IApiError } from "@/app/types/api-error.interface";

export function NewsTab() {
    const [news, setNews] = useState<INews[]>([]);
    const [count, setCountNews] = useState(0);

    const fetchNews = useCallback(async () => {
        try {
            const res = await getListNews();

            setNews(res.results);
            setCountNews(res.count);
        } catch (error) {
            const hasApiMarker = error !== null && typeof error === 'object' && 'isApiError' in error;
            
            if (hasApiMarker) {
                const apiError = error as IApiError;
                
                toast.error(apiError.message);
            } else toast.error("Произошла непредвиденная ошибка на клиенте");
            
            console.error("Ошибка", error);

            setNews([]);
            setCountNews(0);
        }
    }, []);

    useEffect(() => {
        const handleFetchEvent = async() => await fetchNews();
        handleFetchEvent();
    }, [fetchNews]);

    if (news.length == 0) {
        return (
            <main className="flex-1 bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-200/50">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold">Всего новостей: {count}</h1>
                    <CreateNewsModal news={null} fetch={async () => fetchNews()}>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                            Добавить
                        </button>
                    </CreateNewsModal>
                </div>

                <div className="flex flex-col items-center justify-center h-full min-h-100 gap-4 text-center">
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
                        <p className="text-base font-semibold text-gray-800">В списке ещё нет новостей</p>
                        <p className="text-sm text-gray-500 max-w-xs">
                            Создайте свою первую новость с нуля
                        </p>
                    </div>

                    <CreateNewsModal news={null} fetch={async () => fetchNews()}>
                        <button className="mt-1 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            Создать новость
                        </button>
                    </CreateNewsModal>
                </div>
            </main>
        )
    };

    return (
        <main className="flex-1 bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-200/50">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold">Всего новостей: {count}</h1>
                <CreateNewsModal news={null} fetch={async () => fetchNews()}>
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
                                <PencilIcon className="w-5 h-5"/>
                            </button>
                            
                            <DeleteConfirmModal title={item.title} onConfirm={async () => await deleteNews(item.id)} fetch={async () => await fetchNews()}>
                                <button 
                                    type="button" 
                                    title="Удалить" 
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                                    <Trash2Icon className="w-5 h-5"/>
                                </button>
                            </DeleteConfirmModal>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}