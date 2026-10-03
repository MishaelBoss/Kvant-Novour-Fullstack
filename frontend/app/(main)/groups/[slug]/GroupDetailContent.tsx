"use client";
import { useState } from "react";
import Link from "next/link";
import { getGroupBySlug, getListUsers, deleteStudyGroup } from "@/app/lib/api";
import { IApiError } from "@/app/types/api-error.interface";
import { DeleteConfirmModal } from "@/app/components/DeleteConfirmModal";
import EditStudyGroupModal from "@/app/admin-panel/_components/EditStudyGroupModal";
import { ChevronLeft, Users, CalendarDays, Clock, GraduationCap, MoveLeftIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const COURSE_LABELS: Record<string, string> = {
    it: 'IT', chess: 'Шахматы', 'hi-tech': 'Hi-Tech', english: 'English',
    mathematics: 'Mathematics', prom: 'Prom', 'vr-ar': 'VR/AR',
};

const MODULE_LABELS: Record<string, string> = {
    intro: 'Вводный модуль',
    advanced: 'Углублённый модуль',
    project: 'Проектный модуль',
};

export default function GroupDetailContent({ slug }: { slug: string }) {
    const queryClient = useQueryClient();

    const [notFound, setNotFound] = useState(false);

    const { data: group, isLoading } = useQuery({
        queryKey: ['group', slug],
        queryFn: async () => {
            try {
                setNotFound(false);
                const data = await getGroupBySlug(slug);
                return data;
            } catch (error) {
                const hasApiMarker = error !== null && typeof error === 'object' && 'isApiError' in error;

                if (hasApiMarker && (error as IApiError).status === 404) setNotFound(true);
                else if (hasApiMarker) toast.error((error as IApiError).message);
                else toast.error("Произошла непредвиденная ошибка на клиенте");

                console.error("Ошибка", error);
                throw error;
            }
        },
        retry: false, 
    });

    const isAdminView = !!group?.is_admin;

    const onDeleteGroup = async () => {
        if (!group) return;
        await deleteStudyGroup(group.id);
        toast.success("Группа удалена");
        window.location.href = '/groups/';
    };

    if (isLoading) {
        return (
            <div className="w-full p-4 md:p-8">
                <div className="max-w-354 mx-auto">
                    <div className="h-5 bg-gray-200 rounded w-32 mb-6 animate-pulse" />
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 animate-pulse">
                        <div className="h-7 bg-gray-200 rounded w-2/3 mb-4" />
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-6" />
                        <div className="space-y-3">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-14 bg-gray-100 rounded-xl" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (notFound || !group) {
        return (
            <div className="w-full p-4 md:p-8">
                <div className="max-w-354 mx-auto flex flex-col items-center justify-center text-center py-20">
                    <GraduationCap size={48} className="text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg mb-4">Группа не найдена</p>
                    <Link href="/groups/" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                        <MoveLeftIcon width={16} height={16}/> Вернуться к списку групп
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full p-4 md:p-8">
            <div className="max-w-354 mx-auto">
                <Link
                    href="/groups/"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors mb-6"
                >
                    <ChevronLeft size={16} />
                    Все группы
                </Link>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="min-w-0">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{group.name}</h1>

                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                {group.course && (
                                    <span className="text-[11px] font-medium text-blue-600 bg-blue-50 rounded-full px-3 py-1">
                                        {COURSE_LABELS[group.course] ?? group.course}
                                    </span>
                                )}
                                {group.module_type && (
                                    <span className="text-[11px] font-medium text-violet-600 bg-violet-50 rounded-full px-3 py-1">
                                        {MODULE_LABELS[group.module_type] ?? group.module_type}
                                    </span>
                                )}
                                <span className={`flex items-center gap-1 text-[12px] font-medium rounded-full px-3 py-1 text-gray-500 bg-gray-100`}>
                                    <Users size={13} />
                                    {group.max_students}
                                </span>
                            </div>

                            <p className="text-[13px] text-gray-500">
                                Руководитель: <span className="font-medium text-gray-700">{group.teacher}</span>
                            </p>

                            {(group.start_date || group.end_date) && (
                                <p className="text-[13px] text-gray-500 mt-1 flex items-center gap-1.5">
                                    <CalendarDays size={14} className="text-gray-400" />
                                    {group.start_date ? new Date(group.start_date).toLocaleDateString('ru-RU') : '—'}
                                    {' — '}
                                    {group.end_date ? new Date(group.end_date).toLocaleDateString('ru-RU') : '—'}
                                </p>
                            )}

                            {group.start_time && (
                                <p className="text-[13px] text-gray-500 mt-1 flex items-center gap-1.5">
                                    <Clock size={14} className="text-gray-400" />
                                    {new Date(`1970-01-01T${group.start_time}`).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            )}
                        </div>

                        {isAdminView && (
                            <div className="flex items-center gap-2 shrink-0">
                                <EditStudyGroupModal group={group} fetch={() => queryClient.invalidateQueries({ queryKey: ['group', slug] })}>
                                    <button
                                        type="button"
                                        title="Редактировать группу"
                                        className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                                    >
                                        Редактировать
                                    </button>
                                </EditStudyGroupModal>

                                <DeleteConfirmModal title={group.name} onConfirm={onDeleteGroup}>
                                    <button
                                        type="button"
                                        title="Удалить группу"
                                        className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                                    >
                                        Удалить
                                    </button>
                                </DeleteConfirmModal>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
