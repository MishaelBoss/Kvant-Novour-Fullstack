"use client";
import { getMyGroups } from "@/app/lib/api";
import { IApiError } from "@/app/types/api-error.interface";
import Link from "next/link";
import { Users, GraduationCap, BookOpen, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

export function MyGroupsTab() {
    const { data: queryData, isLoading } = useQuery({
        queryKey: ['my-groups'],
        queryFn: async () => {
            try {
                const data = await getMyGroups();
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

    const groups = queryData?.results ?? [];

    return (
        <main className="flex-1 bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-200/50">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold">Мои группы</h1>
            </div>

            {isLoading ? (
                <div className="text-gray-400 text-sm">Загрузка...</div>
            ) : groups.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full min-h-70 gap-4 text-center">
                    <GraduationCap size={48} className="text-gray-300" />
                    <p className="text-gray-500">Вы пока не состоите ни в одной группе</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {groups.map((group) => {
                        const members = group.students ?? [];

                        return (
                            <div key={group.id} className="border border-gray-100 rounded-2xl p-5 flex flex-col">
                                <div className="flex items-start justify-between gap-3 mb-2">
                                    <h3 className="text-[16px] font-bold text-gray-900 leading-snug">{group.name}</h3>
                                    <span className="flex items-center gap-1 text-[12px] font-medium text-gray-500 bg-gray-100 rounded-full px-3 py-1 shrink-0">
                                        <Users size={13} />
                                        {group.students_count ?? members.length}
                                    </span>
                                </div>

                                <p className="text-[13px] text-gray-500 mb-4 flex items-center gap-1.5">
                                    <BookOpen size={14} className="text-blue-500" />
                                    Руководитель: <span className="font-medium text-gray-700">{group.teacher}</span>
                                </p>

                                <div className="mt-auto">
                                    <Link
                                        href={`/groups/${group.slug}/`}
                                        className="flex items-center justify-center gap-1.5 w-full text-[13px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl px-4 py-2.5 transition-colors"
                                    >
                                        Смотреть группу
                                        <ArrowRight size={15} />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </main>
    );
}