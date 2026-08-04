import { getListUsers } from "@/app/lib/api";
import { useCallback, useEffect, useState } from "react";
import { CreateUserModal } from "../CreateUserModal";
import { useAuth } from "@/app/context/AuthContext";
import { IUser } from "@/app/types/user.interface";
import { UserCard } from "../UserCard";
import toast from "react-hot-toast";
import { IApiError } from "@/app/types/api-error.interface";

export function UsersTab() {
    const [users, setUsers] = useState<IUser[]>([]);
    const [count, setCountNews] = useState(0);
    const { user } = useAuth();

    const fetchUsers = useCallback(async () => {
        try {
            const res = await getListUsers();

            setUsers(res.results);
            setCountNews(res.count);
        } catch (error) {
            const hasApiMarker = error !== null && typeof error === 'object' && 'isApiError' in error;
            
            if (hasApiMarker) {
                const apiError = error as IApiError;
                
                toast.error(apiError.message);
            } else toast.error("Произошла непредвиденная ошибка на клиенте");
            
            console.error("Ошибка", error);

            setUsers([]);
            setCountNews(0);
        }
    }, []);

    useEffect(() => {
        const handleFetchEvent = async() => await fetchUsers();
        handleFetchEvent();
    }, [fetchUsers])
    
    return (
        <main className="flex-1 bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-200/50">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold">Всего пользователей: {count}</h1>
                <CreateUserModal user={null} fetch={async () => fetchUsers()}>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                        Добавить
                    </button>
                </CreateUserModal>
            </div>

            <div className="flex flex-col gap-4">
                {users?.map((item) => (
                    <UserCard key={item.id} user={item} fetch={async () => await fetchUsers()} />
                ))}
            </div>
        </main>
    );
}