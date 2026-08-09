import { getListUsers } from "@/app/lib/api";
import { CreateUserModal } from "../CreateUserModal";
import { useAuth } from "@/app/context/AuthContext";
import { UserCard } from "../UserCard";
import toast from "react-hot-toast";
import { IApiError } from "@/app/types/api-error.interface";
import { useQuery } from "@tanstack/react-query";

export function UsersTab() {
    const { user } = useAuth();

    const { data: queryData, refetch } = useQuery({
        queryKey: ['admin-users'],
        queryFn: async () => {
            try {
                const data = await getListUsers();
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
    });

    const users = queryData?.results ?? [];
    const count = queryData?.count ?? 0;

    return (
        <main className="flex-1 bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-200/50">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold">Всего пользователей: {count}</h1>
                <CreateUserModal user={null} fetch={() => refetch().then(() => {})}>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                        Добавить
                    </button>
                </CreateUserModal>
            </div>

            <div className="flex flex-col gap-4">
                {users?.map((item) => (
                    <UserCard key={item.id} user={item} fetch={() => refetch().then(() => {})} />
                ))}
            </div>
        </main>
    );
}