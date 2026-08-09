"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getGroupBySlug, getListUsers, addStudentToGroup, removeStudentFromGroup, createAttendance, updateGroupMembershipStatus, deleteStudyGroup } from "@/app/lib/api";
import { IApiError } from "@/app/types/api-error.interface";
import { IUser } from "@/app/types/user.interface";
import { ModuleStatusConfirmModal } from "@/app/components/ModuleStatusConfirmModal";
import { DeleteConfirmModal } from "@/app/components/DeleteConfirmModal";
import EditStudyGroupModal from "@/app/admin-panel/_components/EditStudyGroupModal";
import { ChevronLeft, Users, UserPlus, UserMinus, CheckCircle2, XCircle, CalendarDays, GraduationCap } from "lucide-react";
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

const ATTENDANCE_OPTIONS = [
    { value: 'present', label: 'Присутствовал' },
    { value: 'absent', label: 'Отсутствовал' },
    { value: 'late', label: 'Опоздал' },
];

const ATTENDANCE_LABELS: Record<string, string> = {
    present: 'Присутствовал',
    absent: 'Отсутствовал',
    late: 'Опоздал',
};

const today = () => new Date().toISOString().slice(0, 10);

export default function GroupDetailContent({ slug }: { slug: string }) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [notFound, setNotFound] = useState(false);
    const [busy, setBusy] = useState<Record<string, boolean>>({});

    const [users, setUsers] = useState<IUser[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState<number | ''>('');

    const [dates, setDates] = useState<Record<number, string>>({});
    const [attendance, setAttendance] = useState<Record<string, string>>({});

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

    useEffect(() => {
        if (!group?.is_admin) return;
        getListUsers()
            .then((res) => setUsers(res.results.filter((u) => u.role === 'user')))
            .catch(() => {});
    }, [group?.is_admin]);

    const isAdminView = !!group?.is_admin;
    const canManage = !!group?.can_manage;
    const members = group?.students ?? [];
    const count = group?.students_count ?? members.length;
    const isFull = !!group?.max_students && count >= group.max_students;

    const notInGroup = users.filter((u) => !members.some((m) => m.id === u.id));

    const setStatus = async (membershipId: number, status: 'completed' | 'failed', fullName: string) => {
        if (!membershipId) return;

        const key = `status-${membershipId}`;
        setBusy((b) => ({ ...b, [key]: true }));

        try {
            await updateGroupMembershipStatus(membershipId, status);
            toast.success(`${fullName}: ${status === 'completed' ? 'прошёл модуль' : 'не прошёл модуль'}`);
            await queryClient.invalidateQueries({ queryKey: ['group', slug] });
        } catch (error) {
            const hasApiMarker = error !== null && typeof error === 'object' && 'isApiError' in error;
            if (hasApiMarker) toast.error((error as IApiError).message);
            else toast.error("Произошла непредвиденная ошибка на клиенте");
            console.error("Ошибка", error);
        } finally {
            setBusy((b) => ({ ...b, [key]: false }));
        }
    };

    const markAttendance = async (studentId: number, fullName: string) => {
        if (!group) return;

        const date = dates[studentId] || today();
        const status = attendance[`${group.id}-${studentId}`] || 'present';
        const key = `att-${group.id}-${studentId}`;

        setBusy((b) => ({ ...b, [key]: true }));
        try {
            await createAttendance({ student: studentId, group: group.id, date, status });
            toast.success(`${fullName}: посещаемость за ${date} отмечена`);
            await queryClient.invalidateQueries({ queryKey: ['group', slug] });
        } catch (error) {
            const hasApiMarker = error !== null && typeof error === 'object' && 'isApiError' in error;

            if (hasApiMarker) toast.error((error as IApiError).message);
            else toast.error("Произошла непредвиденная ошибка на клиенте");

            console.error("Ошибка", error);
        } finally {
            setBusy((b) => ({ ...b, [key]: false }));
        }
    };

    const addStudent = async () => {
        if (!group || selectedStudentId === '') {
            toast.error("Выберите ученика");
            return;
        }
        setBusy((b) => ({ ...b, add: true }));
        try {
            await addStudentToGroup(group.slug!, Number(selectedStudentId));
            toast.success("Ученик добавлен в группу");
            setSelectedStudentId('');
            await queryClient.invalidateQueries({ queryKey: ['group', slug] });
        } catch (error) {
            const hasApiMarker = error !== null && typeof error === 'object' && 'isApiError' in error;

            if (hasApiMarker) toast.error((error as IApiError).message);
            else toast.error("Произошла непредвиденная ошибка на клиенте");

            console.error("Ошибка", error);
        } finally {
            setBusy((b) => ({ ...b, add: false }));
        }
    };

    const removeStudent = async (studentId: number, fullName: string) => {
        if (!group) return;
        const key = `remove-${studentId}`;
        setBusy((b) => ({ ...b, [key]: true }));
        try {
            await removeStudentFromGroup(group.slug!, studentId);
            toast.success(`${fullName} убран из группы`);
            await queryClient.invalidateQueries({ queryKey: ['group', slug] });
        } catch (error) {
            const hasApiMarker = error !== null && typeof error === 'object' && 'isApiError' in error;

            if (hasApiMarker) toast.error((error as IApiError).message);
            else toast.error("Произошла непредвиденная ошибка на клиенте");

            console.error("Ошибка", error);
        } finally {
            setBusy((b) => ({ ...b, [key]: false }));
        }
    };

    const onDeleteGroup = async () => {
        if (!group) return;
        await deleteStudyGroup(group.id);
        toast.success("Группа удалена");
        router.push('/groups/');
    };

    const userName = (u: IUser) => `${u.last_name || ''} ${u.first_name || ''} ${u.middle_name || ''}`.trim() || u.username || `Пользователь #${u.id}`;

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
                        ← Вернуться к списку групп
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
                                <span className={`flex items-center gap-1 text-[12px] font-medium rounded-full px-3 py-1 ${isFull ? 'text-red-600 bg-red-50' : 'text-gray-500 bg-gray-100'}`}>
                                    <Users size={13} />
                                    {group.max_students ? `${count}/${group.max_students}` : count}
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

                {isAdminView && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                        <h2 className="text-[15px] font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <UserPlus size={18} className="text-blue-600" />
                            Добавить ученика
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <select
                                value={selectedStudentId}
                                onChange={(e) => setSelectedStudentId(e.target.value === '' ? '' : Number(e.target.value))}
                                className="flex-1 bg-[#f4f5f7] border-none rounded-xl px-4 py-3 text-sm cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="">Выберите ученика...</option>
                                {notInGroup.map((u) => (
                                    <option key={u.id} value={u.id}>{userName(u)}</option>
                                ))}
                            </select>
                            <button
                                type="button"
                                disabled={busy.add}
                                onClick={addStudent}
                                className="px-5 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {busy.add ? 'Добавление...' : 'Добавить'}
                            </button>
                        </div>
                        {isFull && (
                            <p className="text-xs text-red-500 mt-2">Группа заполнена — новых учеников добавить нельзя.</p>
                        )}
                    </div>
                )}

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-[15px] font-bold text-gray-900 mb-4">Участники группы ({members.length})</h2>

                    {members.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center py-12">
                            <GraduationCap size={40} className="text-gray-300 mb-3" />
                            <p className="text-gray-500 text-sm">Участники пока не добавлены</p>
                        </div>
                    ) : (
                        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                            {members.map((m) => {
                                const attKey = `att-${group.id}-${m.id}`;
                                const stKey = `status-${m.membership_id}`;
                                const attHistory = m.attendance ?? [];

                                return (
                                    <li key={m.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50 flex flex-col">
                                        <div className="flex items-center justify-between gap-2 mb-2">
                                            <span className="text-[14px] font-medium text-gray-800 truncate">{m.full_name}</span>
                                            <div className="flex items-center gap-1 shrink-0">
                                                {canManage && (
                                                    <>
                                                        <ModuleStatusConfirmModal
                                                            studentName={m.full_name}
                                                            status="completed"
                                                            onConfirm={() => setStatus(m.membership_id ?? 0, 'completed', m.full_name)}
                                                        >
                                                            <button
                                                                type="button"
                                                                title="Прошёл модуль"
                                                                disabled={busy[stKey ?? ''] || !m.membership_id}
                                                                className="p-1.5 text-green-600 hover:bg-green-100 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                <CheckCircle2 size={16} />
                                                            </button>
                                                        </ModuleStatusConfirmModal>
                                                        <ModuleStatusConfirmModal
                                                            studentName={m.full_name}
                                                            status="failed"
                                                            onConfirm={() => setStatus(m.membership_id ?? 0, 'failed', m.full_name)}
                                                        >
                                                            <button
                                                                type="button"
                                                                title="Не прошёл модуль"
                                                                disabled={busy[stKey ?? ''] || !m.membership_id}
                                                                className="p-1.5 text-red-500 hover:bg-red-100 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                <XCircle size={16} />
                                                            </button>
                                                        </ModuleStatusConfirmModal>
                                                    </>
                                                )}
                                                {isAdminView && (
                                                    <button
                                                        type="button"
                                                        title="Убрать из группы"
                                                        disabled={busy[`remove-${m.id}`]}
                                                        onClick={() => removeStudent(m.id, m.full_name)}
                                                        className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <UserMinus size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {attHistory.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mb-3">
                                                {attHistory.map((a) => (
                                                    <span
                                                        key={a.id}
                                                        className={`text-[11px] px-2 py-0.5 rounded-full ${a.status === 'present' ? 'bg-green-50 text-green-700' : a.status === 'late' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}
                                                    >
                                                        {new Date(a.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                                                        : {ATTENDANCE_LABELS[a.status] ?? a.status}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {canManage && (
                                            <div className="flex items-center gap-2 mt-auto">
                                                <input
                                                    type="date"
                                                    value={dates[m.id] || today()}
                                                    onChange={(e) => setDates((d) => ({ ...d, [m.id]: e.target.value }))}
                                                    className="border border-gray-200 rounded-lg px-2 py-1.5 text-[12px] bg-white"
                                                />
                                                <select
                                                    value={attendance[`${group.id}-${m.id}`] || 'present'}
                                                    onChange={(e) => setAttendance((a) => ({ ...a, [`${group.id}-${m.id}`]: e.target.value }))}
                                                    className="flex-1 bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-[12px]"
                                                >
                                                    {ATTENDANCE_OPTIONS.map((o) => (
                                                        <option key={o.value} value={o.value}>{o.label}</option>
                                                    ))}
                                                </select>
                                                <button
                                                    type="button"
                                                    disabled={busy[attKey]}
                                                    onClick={() => markAttendance(m.id, m.full_name)}
                                                    className="text-[12px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-3 py-1.5 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                                                >
                                                    {busy[attKey] ? '...' : 'Отметить'}
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
