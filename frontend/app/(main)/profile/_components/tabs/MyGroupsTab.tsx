"use client";
import { useCallback, useEffect, useState } from "react";
import { getMyGroups } from "@/app/lib/api";
import { IApiError } from "@/app/types/api-error.interface";
import { IGroup } from "@/app/types/group.interface";
import { ChevronDown, Users, GraduationCap, BookOpen } from "lucide-react";
import toast from "react-hot-toast";

export function MyGroupsTab() {
    const [groups, setGroups] = useState<IGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<Record<number, boolean>>({});

    const fetchGroups = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getMyGroups();
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
    }, []);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    const toggle = (id: number) => setExpanded(s => ({ ...s, [id]: !s[id] }));

    return (
        <main className="flex-1 bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-200/50">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold">Мои группы</h1>
            </div>

            {loading ? (
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
                        const isOpen = !!expanded[group.id];

                        return (
                            <div key={group.id} className="border border-gray-100 rounded-2xl p-5">
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
                        );
                    })}
                </div>
            )}
        </main>
    );
}