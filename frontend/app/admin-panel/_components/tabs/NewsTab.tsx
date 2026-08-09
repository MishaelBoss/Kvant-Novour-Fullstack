import { CreateNewsModal } from "../CreateNewsModal"
import { getListNews } from "@/app/lib/api";
import { NewsCard } from "../NewsCard";
import toast from "react-hot-toast";
import { IApiError } from "@/app/types/api-error.interface";
import { useQuery } from "@tanstack/react-query";

export function NewsTab() {
    const { data: queryData, refetch } = useQuery({
        queryKey: ['admin-news'],
        queryFn: async () => {
            try {
                const data = await getListNews();
                return data;
            } catch (error) {
                const hasApiMarker = error !== null && typeof error === 'object' && 'isApiError' in error;

                if (hasApiMarker) toast.error((error as IApiError).message);
                else toast.error("Произошла непредвиденная ошибка на клиенте");

                console.error("Ошибка", error);
                throw error;
            }
        },
        retry: false,
    });

    const news = queryData?.results ?? [];
    const count = queryData?.count ?? 0;

    if (news.length == 0) {
        return (
            <main className="flex-1 bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-200/50">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold">Всего новостей: {count}</h1>
                    <CreateNewsModal news={null} fetch={() => refetch().then(() => {})}>
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

                    <CreateNewsModal news={null} fetch={() => refetch().then(() => {})}>
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
                <CreateNewsModal news={null} fetch={() => refetch().then(() => {})}>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                        Добавить
                    </button>
                </CreateNewsModal>
            </div>

            <div className="flex flex-col gap-4">
                {news?.map((item) => (
                    <NewsCard key={item.id} news={item} fetch={() => refetch().then(() => {})} />
                ))}
            </div>
        </main>
    );
}