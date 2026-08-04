"use client";
import { useCallback, useEffect, useState } from "react";
import { getCourseGroups } from "@/app/lib/api";
import { IApiError } from "@/app/types/api-error.interface";
import { IGroup } from "@/app/types/group.interface";
import { ChevronDown, Users } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
    course: string;
}

export function CourseGroups({ course }: Props) {
    const [groups, setGroups] = useState<IGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<Record<number, boolean>>({});

    const fetchGroups = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getCourseGroups(course);
            setGroups(res.results);
        } catch (error) {
            const hasApiMarker = error !== null && typeof error === 'object' && 'isApiError' in error;

            if (hasApiMarker) {
                const apiError = error as IApiError;
                toast.error(apiError.message);
            } else toast.error("Произошла непредвиденная ошибка на клиенте");

            console.error("Ошибка", error);
            setGroups([]);
        } finally {
            setLoading(false);
        }
    }, [course]);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 3 }).map((_, i) => (
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

    const toggle = (id: number) => setExpanded(s => ({ ...s, [id]: !s[id] }));

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {groups.map((group) => {
                const members = group.students ?? [];
                const isOpen = !!expanded[group.id];

                return (
                    <div key={group.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
                        <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="text-[17px] font-bold text-gray-900 leading-snug">{group.name}</h3>
                            <span className="flex items-center gap-1 text-[12px] font-medium text-gray-500 bg-gray-100 rounded-full px-3 py-1 shrink-0">
                                <Users size={13} />
                                {group.students_count ?? members.length}
                            </span>
                        </div>

                        <p className="text-[13px] text-gray-500 mb-4">
                            Руководитель: <span className="font-medium text-gray-700">{group.teacher}</span>
                        </p>

                        <div className="mt-auto">
                            <button
                                type="button"
                                onClick={() => toggle(group.id)}
                                className="flex items-center gap-1.5 text-[13px] font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                            >
                                {isOpen ? 'Скрыть состав' : 'Состав группы'}
                                <ChevronDown size={15} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isOpen && (
                                <ul className="mt-3 grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto">
                                    {members.length ? members.map((m) => (
                                        <li key={m.id} className="text-[13px] text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
                                            {m.full_name}
                                        </li>
                                    )) : (
                                        <li className="text-[13px] text-gray-400">Состав пока не заполнен</li>
                                    )}
                                </ul>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}