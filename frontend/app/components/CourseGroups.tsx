"use client";
import { getCourseGroups } from "@/app/lib/api";
import { IApiError } from "@/app/types/api-error.interface";
import Link from "next/link";
import { Users, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

interface Props {
    course: string;
}

export function CourseGroups({ course }: Props) {
    const { data: queryData, isLoading } = useQuery({
        queryKey: ['course-groups', course],
        queryFn: async () => {
            try {
                const data = await getCourseGroups(course);
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
        refetchOnMount: 'always',
    });

    const groups = queryData?.results ?? [];

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded mb-3 w-2/3" />
                        <div className="h-3 bg-gray-200 rounded w-1/3 mb-4" />
                        <div className="h-3 bg-gray-100 rounded w-full" />
                    </div>
                ))}
            </div>
        );
    }

    if (groups.length === 0) {
        return (
            <div className="text-center py-10 text-gray-400 text-sm">
                Групп по этому направлению пока нет
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
            {groups.map((group) => {
                return (
                    <div key={group.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col min-h-64">
                        <div className="flex items-start justify-between gap-3 mb-4">
                            <h3 className="text-[17px] font-bold text-gray-900 leading-snug">{group.name}</h3>
                            <span className={`flex items-center gap-1 text-[12px] font-medium rounded-full px-3 py-1 shrink-0 text-gray-500 bg-gray-100`}>
                                <Users size={13} />
                                {group.max_students}
                            </span>
                        </div>

                        {group.module_type && (
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                <span className="text-[11px] font-medium text-violet-600 bg-violet-50 rounded-full px-3 py-1 w-fit">
                                    {group.module_type === 'intro' ? 'Вводный модуль' :
                                     group.module_type === 'advanced' ? 'Углублённый модуль' :
                                     group.module_type === 'project' ? 'Проектный модуль' : group.module_type}
                                </span>
                            </div>
                        )}

                        <p className="text-[13px] text-gray-500 mb-2">
                            Руководитель: <span className="font-medium text-gray-700">{group.teacher}</span>
                        </p>

                        {(group.start_date || group.end_date) && (
                            <p className="text-xs text-gray-500 mb-6">
                                Период занятий:{' '}
                                {group.start_date ? new Date(group.start_date).toLocaleDateString('ru-RU') : '—'}
                                {' — '}
                                {group.end_date ? new Date(group.end_date).toLocaleDateString('ru-RU') : '—'}
                            </p>
                        )}

                        {group.start_time && (
                            <p className="text-xs text-gray-500 mb-6">
                                Время начала занятий:{' '}
                                {new Date(`1970-01-01T${group.start_time}`).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        )}

                        <div className="mt-auto pt-2">
                            <Link
                                href={`/groups/${group.slug}/`}
                                className="flex items-center justify-center gap-1.5 w-full text-[13px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl px-4 py-3 transition-colors"
                            >
                                Смотреть группу
                                <ArrowRight size={15} />
                            </Link>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}