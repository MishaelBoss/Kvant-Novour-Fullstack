"use client";

import Link from "next/link";
import { PAGES } from "../config/page";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User } from "../types/user.interface";
import { getProfile } from "../lib/api";
import { Users } from "./_components/Users";
import { News } from "./_components/News";
import { Events } from "./_components/Events";

interface AdminProps {
    currentUser: User | null;
}

export default function Admin({currentUser}: AdminProps) {
    const [user, setUser] = useState<User | null>(null);
    const searchParams = useSearchParams();
    const tabFromUrl = searchParams.get('tab') as 'users' | 'news' | 'events';
    const activeTab = tabFromUrl || 'users';
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
        };
    
        fetchUser();
    }, [router]);
    
    return (
        <div className="min-h-screen bg-white font-sans text-[#2B2E33]">
            <header className="max-w-[1416px] mx-auto pt-8 px-4">
                <div className="mb-2">
                    <span className="text-[24px] font-black tracking-tight text-[#005BFF]">Kvantum <span className="font-medium">admin panel</span></span>
                </div>
                <p className="text-[13px] text-gray-500">Добро пожаловать {user?.username}</p>
            </header>
            <main className="max-w-[1416px] mx-auto mt-12 px-4 flex gap-16">
                <aside className="w-64 bg-white rounded-2xl p-4 shadow-sm h-fit">
                    <Link href={PAGES.MY_PROFILE()} className="flex items-center gap-2 text-[#005BFF] text-[15px] mb-10 hover:opacity-80 transition-opacity group">
                        <span className="text-[20px] leading-none -mt-[2px]">‹</span> 
                        <span>Вернуться</span>
                    </Link>

                    <nav className="flex flex-col gap-1">
                        
                        <button onClick={() => setActiveTab('users')} className={`flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer ${activeTab === 'users' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}>
                            Пользователи
                        </button>

                        <button onClick={() => setActiveTab('news')} className={`flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer ${activeTab === 'news' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}>
                            Новости
                        </button>

                        <button onClick={() => setActiveTab('events')} className={`flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer ${activeTab === 'events' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}>
                            Ивенты
                        </button>
                    </nav>
                </aside>

                {activeTab === 'users' && <Users currentAdminId={currentUser}/>}
                {activeTab === 'news' && <News/>}
                {activeTab === 'events' && <Events/>}
            </main>
        </div>
    );
}