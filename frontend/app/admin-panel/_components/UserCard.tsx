"use client";
import Link from "next/link";
import { DeleteConfirmModal } from "../../components/DeleteConfirmModal";
import { deleteUser } from "@/app/lib/api";
import { PAGES } from "@/app/config/pages.config";
import { IUser } from "@/app/types/user.interface";
import { EditUserModel } from "./EditUserModel";
import { useAuth } from "@/app/context/AuthContext";
import { PencilIcon, Trash2Icon } from "lucide-react";

interface Props {
    user: IUser;
    fetch: () => Promise<void>;
}

export function UserCard({ user, fetch }: Props) {
    const { user: currentUser } = useAuth();

    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow gap-4">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-lg font-semibold text-gray-900 truncate">
                        {user.username}
                    </h2>
                    <span className="text-xs text-[#656d78] shrink-0">
                        {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'Нет даты'}
                    </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {user.email}
                </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
                {user.username && (
                    <Link title={`Открыть профиль ${user.username}`}
                        href={PAGES.PROFILE(user.username)}
                        className="flex-1 md:flex-none text-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                        Открыть
                    </Link>
                )}

                <EditUserModel user={user} fetch={fetch}>
                    <button title="Редактировать"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
                        <PencilIcon className="w-5 h-5" />
                    </button>
                </EditUserModel>

                {currentUser?.id !== user.id && (
                    <DeleteConfirmModal title={user.username} onConfirm={async () => await deleteUser(user.id)} fetch={fetch}>
                        <button title="Удалить"
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                            <Trash2Icon className="w-5 h-5" />
                        </button>
                    </DeleteConfirmModal>
                )}

                {currentUser?.id === user.id && (
                    <span className="text-[12px] text-gray-500 italic px-2">Это вы</span>
                )}
            </div>
        </div>
    );
}