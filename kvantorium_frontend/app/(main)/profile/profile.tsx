'use client'
import { PAGES } from "@/app/config/page";
import { getProfile } from "@/app/lib/api";
import { User } from "@/app/types/user.interface";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Skeleton } from "@radix-ui/themes";
import { Achievements } from "./_components/Achievements";
import { PersonalData } from "./_components/PersonalData";
import { Notifications } from "./_components/Notifications";

export default function MyProfile() {
    const [user, setUser] = useState<User | null>(null);
    const searchParams = useSearchParams();
    const tabFromUrl = searchParams.get('tab') as 'personal' | 'achievements' | 'notifications';
    const activeTab = tabFromUrl || 'personal';
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const setActiveTab = (tab: string) => {
        router.push(`?tab=${tab}`, { scroll: false });
    };

    useEffect(() => {
        const fetchUser = async () => {
            const data: User = await getProfile();

            if (data?.is_authenticated) {
                setUser(data);
            } else{
                router.push(PAGES.HOME());
            }
            
            setLoading(false);
        };

        fetchUser();
    }, [router]);

    if (loading) {
        return (
            <Skeleton>
            </Skeleton>
        );
    }

    return (
        <div className="min-h-screen bg-[#f4f5f7] p-4 md:p-8">
            <div className="max-w-[1416px] mx-auto flex flex-col md:flex-row gap-8">
                <aside className="w-64 bg-white rounded-2xl p-4 shadow-sm h-fit">
                    <div className="flex items-center gap-3 mb-6 px-2">
                        <div className="relative w-[80px] h-[80px] aspect-square flex-shrink-0 rounded-full overflow-hidden bg-blue-500">
                            <Image src={user?.avatar || '/default-avatar.png'} fill alt={user?.username || "Avatar"} className="object-cover"/>
                        </div>

                        <div>
                            <p className="text-[20px] font-bold text-sm leading-tight">{user?.first_name} {user?.last_name}</p>
                        </div>
                    </div>

                    <nav className="flex flex-col gap-1">
                        <p className="text-[11px] font-semibold text-gray-400 uppercase px-3 mb-2 tracking-wider">
                            Личная информация
                        </p>
                        
                        <button onClick={() => setActiveTab('personal')} className={`flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer ${activeTab === 'personal' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}>
                            Главная
                        </button>

                        <button onClick={() => setActiveTab('achievements')} className={`flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer ${activeTab === 'achievements' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}>
                            Достижения
                        </button>

                        <button onClick={() => setActiveTab('notifications')} className={`flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer ${activeTab === 'notifications' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}>
                            Сообщения
                        </button>

                        <Link href={PAGES.KVANTUMID()} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
                            Моя учетная запись
                        </Link>

                        {user?.role?.toLowerCase() === "admin" && <Link href={PAGES.ADMINPANEL()} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
                            Админ панель
                        </Link>}
                    </nav>
                </aside>

                {activeTab === 'personal' && <PersonalData user={user} />}
                {activeTab === 'achievements' && <Achievements user={user} />}
                {activeTab === 'notifications' && <Notifications/>}
            </div>
        </div>
    );
}