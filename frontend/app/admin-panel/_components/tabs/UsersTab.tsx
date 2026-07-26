import { deleteUser, getListUsers } from "@/app/lib/api";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { DeleteConfirmModal } from "../../../components/DeleteConfirmModal";
import { PAGES } from "@/app/config/pages.config";
import { CreateUserModal } from "../CreateUserModal";
import { useAuth } from "@/app/context/AuthContext";
import { IUser } from "@/app/types/user.interface";
import { EditUserModel } from "../EditUserModel";
import { PencilIcon, Trash2Icon } from "lucide-react";

export function UsersTab() {
    const [users, setUsers] = useState<IUser[]>([]);
    const [count, setCountNews] = useState(0);
    const { user } = useAuth();

    const fetchUsers = useCallback(async () => {
        const res = await getListUsers();

        if (Array.isArray(res?.results)) {
            setUsers(res.results);
            setCountNews(res.count ?? 0);
        } else {
            setUsers([]);
        }
    }, []);

    useEffect(() => {
        const handleFetchEvent = async() => await fetchUsers();

        handleFetchEvent();

        window.addEventListener("fetchListUsers", handleFetchEvent);

        return () => {
            window.removeEventListener("fetchListUsers", handleFetchEvent);
        };
    }, [fetchUsers])
    
    return (
        <main className="flex-1 bg-white rounded-[24px] p-6 md:p-10 shadow-sm border border-gray-200/50">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold">Всего пользователей: {count}</h1>
                <CreateUserModal user={null}>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                        Добавить
                    </button>
                </CreateUserModal>
            </div>

            <div className="flex flex-col gap-4">
                {users?.map((item) => (
                    <div 
                        key={item.id} 
                        className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow gap-4"
                    >
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-lg font-semibold text-gray-900 truncate">
                                    {item.username}
                                </h2>
                                <span className="text-xs text-[#656d78] shrink-0">
                                    {item.date_joined ? new Date(item.date_joined).toLocaleDateString() : 'Нет даты'}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                {item.email}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
                            {item.username && (
                                <Link title={`Открыть профиль ${item.username}`}
                                    href={PAGES.PROFILE(item.username)}
                                    className="flex-1 md:flex-none text-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                                >
                                    Открыть
                                </Link>
                            )}
                            
                            <EditUserModel user={item}>
                                <button title="Редактировать"
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
                                    <PencilIcon className="w-5 h-5"/>
                                </button>
                            </EditUserModel>

                            {user?.id !== item.id && (
                                <DeleteConfirmModal title={item.username} onConfirm={async () => deleteUser(item.id)}>
                                    <button title="Удалить" 
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                                        <Trash2Icon className="w-5 h-5"/>
                                    </button>
                                </DeleteConfirmModal>
                            )}

                            {user?.id === item.id && (
                                <span className="text-[12px] text-gray-500 italic px-2">Это вы</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}