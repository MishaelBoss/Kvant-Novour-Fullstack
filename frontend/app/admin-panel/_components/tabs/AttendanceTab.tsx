"use client";
import toast from "react-hot-toast";
import { IApiError } from "@/app/types/api-error.interface";
import { useQuery } from "@tanstack/react-query";

export function AttendanceTab() {
    const { data: queryData, isLoading } = useQuery({
        queryKey: ['admin-attendance'],
        queryFn: async () => {
            try {
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

    if (isLoading) {
        return (
            <main className="flex-1 bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 flex items-center justify-center">
                <div className="text-gray-400">Загрузка...</div>
            </main>
        );
    }

    return (
        <main className="flex-1 bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Посещаемость</h2>
            </div>

            <p className="text-lg">Нет записей посещаемости</p>
        </main>
    );
}
