"use client";
import { useState } from "react";
import Link from "next/link";
import { DeleteConfirmModal } from "../../components/DeleteConfirmModal";
import { PencilIcon, Trash2Icon, Users } from "lucide-react";
import { IGroup } from "@/app/types/group.interface";
import { deleteStudyGroup } from "@/app/lib/api";
import EditStudyGroupModal from "./EditStudyGroupModal";

const COURSE_LABELS: Record<string, string> = {
    it: 'IT', chess: 'Шахматы', 'hi-tech': 'Hi-Tech', english: 'English',
    mathematics: 'Mathematics', prom: 'Prom', 'vr-ar': 'VR/AR',
};

const MODULE_LABELS: Record<string, string> = {
    intro: 'Вводный модуль',
    advanced: 'Углублённый модуль',
    project: 'Проектный модуль',
};

interface Props {
    group: IGroup;
    fetch: () => Promise<void>;
}

export function StudyGroupCard({ group, fetch }: Props) {
    const members = group.students ?? [];
    const count = group.students_count ?? members.length;
    const isFull = !!group.max_students && count >= group.max_students;

    return (
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {group.name}
                        </h3>
                        <span className="text-xs text-[#656d78] shrink-0">
                            {group.created_at ? new Date(group.created_at).toLocaleDateString() : 'Нет даты'}
                        </span>
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
                        <span className={`flex items-center gap-1 text-[12px] font-medium rounded-full px-3 py-1 shrink-0 ${isFull ? 'text-red-600 bg-red-50' : 'text-gray-500 bg-gray-100'}`}>
                            <Users size={13} />
                            {group.max_students ? `${count}/${group.max_students}` : count}
                        </span>
                    </div>

                    <p className="text-sm text-gray-600">
                        Руководитель: <span className="font-medium text-gray-700">{group.teacher}</span>
                    </p>

                    {(group.start_date || group.end_date) && (
                        <p className="text-xs text-gray-500 mt-1">
                            Период занятий:{' '}
                            {group.start_date ? new Date(group.start_date).toLocaleDateString('ru-RU') : '—'}
                            {' — '}
                            {group.end_date ? new Date(group.end_date).toLocaleDateString('ru-RU') : '—'}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
                    <Link
                        href={group.slug ? `/groups/${group.slug}/` : (group.course ? `/courses/${group.course}/` : '/groups/')}
                        className="flex-1 md:flex-none text-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                        Просмотр группы
                    </Link>

                    <EditStudyGroupModal group={group} fetch={fetch}>
                        <button title="Редактировать"
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
                            <PencilIcon className="w-5 h-5" />
                        </button>
                    </EditStudyGroupModal>

                    <DeleteConfirmModal title={group.name} onConfirm={async () => await deleteStudyGroup(group.id)} fetch={fetch}>
                        <button
                            type="button"
                            title="Удалить"
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                            <Trash2Icon className="w-5 h-5" />
                        </button>
                    </DeleteConfirmModal>
                </div>
            </div>
        </div>
    );
}