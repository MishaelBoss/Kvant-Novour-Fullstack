"use client";
import { useState } from "react";
import Link from "next/link";
import { DeleteConfirmModal } from "../../components/DeleteConfirmModal";
import { PencilIcon, Trash2Icon, ChevronDown, BookOpen, Users } from "lucide-react";
import { IGroup } from "@/app/types/group.interface";
import { deleteStudyGroup } from "@/app/lib/api";
import EditStudyGroupModal from "./EditStudyGroupModal";

const COURSE_LABELS: Record<string, string> = {
    it: 'IT', chess: 'Шахматы', 'hi-tech': 'Hi-Tech', english: 'English',
    mathematics: 'Mathematics', prom: 'Prom', 'vr-ar': 'VR/AR',
};

interface Props {
    group: IGroup;
    fetch: () => Promise<void>;
}

export function StudyGroupCard({ group, fetch }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const members = group.students ?? [];

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
                        <span className="flex items-center gap-1 text-[12px] font-medium text-gray-500 bg-gray-100 rounded-full px-3 py-1 shrink-0">
                            <Users size={13} />
                            {group.students_count ?? members.length}
                        </span>
                    </div>

                    <p className="text-sm text-gray-600 flex items-center gap-1.5 leading-relaxed">
                        <BookOpen size={14} className="text-blue-500" />
                        Руководитель: <span className="font-medium text-gray-700">{group.teacher}</span>
                    </p>

                    <div className="mt-3">
                        <button
                            type="button"
                            onClick={() => setIsOpen(o => !o)}
                            className="flex items-center gap-1.5 text-[13px] font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                        >
                            {isOpen ? 'Скрыть состав' : 'Состав группы'}
                            <ChevronDown size={15} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isOpen && (
                            <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-52 overflow-y-auto">
                                {members.length ? members.map((m) => (
                                    <li key={m.id} className="text-[13px] text-gray-700 bg-white border border-gray-100 rounded-lg px-3 py-2">
                                        {m.full_name}
                                    </li>
                                )) : (
                                    <li className="text-[13px] text-gray-400">Состав пока не заполнен</li>
                                )}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
                    <Link
                        href={group.course ? `/courses/${group.course}/` : '/groups/'}
                        className="flex-1 md:flex-none text-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                        Открыть
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