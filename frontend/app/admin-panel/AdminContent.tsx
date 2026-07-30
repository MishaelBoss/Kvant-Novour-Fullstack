"use client";

import Link from "next/link";
import { PAGES } from "../config/pages.config";
import { useRouter, useSearchParams } from "next/navigation";
import { UsersTab } from "./_components/tabs/UsersTab";
import { NewsTab } from "./_components/tabs/NewsTab";
import { FormsTab } from "./_components/tabs/FormsTab";
import { useAuth } from "../context/AuthContext";
import { AttendanceTab } from "./_components/tabs/AttendanceTab";
import { GroupsTab } from "./_components/tabs/GroupsTab";

export default function AdminContent() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const tabFromUrl = searchParams.get('tab') as 'users' | 'news' | 'forms' | 'groups' | 'attendance';
    const activeTab = tabFromUrl || 'users';
    const router = useRouter();

    const setActiveTab = (tab: string) => {
        router.push(`?tab=${tab}`, { scroll: false });
    };

    return (
        <div className="min-h-screen bg-white font-sans text-[#2B2E33]">
            <header className="max-w-354 mx-auto pt-8 px-4">
                <div className="mb-2">
                    <span className="text-[24px] font-black tracking-tight text-[#005BFF]">Kvantum <span className="font-medium">admin panel</span></span>
                </div>
                <p className="text-[13px] text-gray-500">Добро пожаловать {user?.username}</p>
            </header>
            <main className="max-w-354 mx-auto mt-12 px-4 flex gap-16">
                <aside className="w-64 bg-white rounded-2xl p-4 shadow-sm h-fit">
                    <Link 
                        href={PAGES.MY_PROFILE()} 
                        className="flex items-center gap-2 text-[#005BFF] text-[15px] mb-6 hover:opacity-80 transition-opacity group"
                    >
                        <span className="text-[20px] leading-none -mt-0.5">‹</span>
                        <span>Вернуться</span>
                    </Link>

                    <nav className="flex flex-col gap-3">
                        <div className="border-l-2 border-blue-500 pl-3">
                            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                                Статистика
                            </div>
                            <button 
                                onClick={() => setActiveTab('attendance')} 
                                className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg w-full transition-all cursor-pointer ${
                                    activeTab === 'attendance' 
                                    ? 'bg-blue-50 text-blue-600 font-medium shadow-sm' 
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                Посещаемость
                            </button>
                        </div>

                        <div className="border-t border-gray-100" />

                        <div className="border-l-2 border-emerald-500 pl-3">
                            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                                Создание и Редактирование
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <button 
                                    onClick={() => setActiveTab('users')} 
                                    className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg w-full transition-all cursor-pointer ${
                                        activeTab === 'users' 
                                        ? 'bg-emerald-50 text-emerald-600 font-medium shadow-sm' 
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    Пользователи
                                </button>
                                <button 
                                    onClick={() => setActiveTab('news')} 
                                    className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg w-full transition-all cursor-pointer ${
                                        activeTab === 'news' 
                                        ? 'bg-emerald-50 text-emerald-600 font-medium shadow-sm' 
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    Новости
                                </button>
                                <button 
                                    onClick={() => setActiveTab('forms')} 
                                    className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg w-full transition-all cursor-pointer ${
                                        activeTab === 'forms' 
                                        ? 'bg-emerald-50 text-emerald-600 font-medium shadow-sm' 
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    Формы
                                </button>
                                <button 
                                    onClick={() => setActiveTab('groups')} 
                                    className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg w-full transition-all cursor-pointer ${
                                        activeTab === 'groups' 
                                        ? 'bg-emerald-50 text-emerald-600 font-medium shadow-sm' 
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    Группы
                                </button>
                            </div>
                        </div>
                    </nav>
                </aside>

                {activeTab === 'attendance' && <AttendanceTab/>}
                {activeTab === 'users' && <UsersTab/>}
                {activeTab === 'news' && <NewsTab/>}
                {activeTab === 'forms' && <FormsTab/>}
                {activeTab === 'groups' && <GroupsTab/>}
            </main>
        </div>
    );
}