"use client";

import { PAGES } from "@/app/config/pages.config";
import { getProfile } from "@/app/lib/api";
import { User } from "@/app/types/user.interface";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Achievements } from "./_components/Achievements";
import { PersonalData } from "./_components/PersonalData";
import { Notifications } from "./_components/Notifications";
import { KvantoForm } from "./_components/KvantoForm";
import { useAuth } from "@/app/context/AuthContext";
import { ProfileSkeleton } from "./_components/profile-skeleton";

export default function MyProfile() {
    const { user, isLoading: isAuthLoading, isAdmin, isTeacher } = useAuth(); 
    const searchParams = useSearchParams();
    const [profile, setProfile] = useState<User | null>(null);
    const tabFromUrl = searchParams.get('tab') as 'personal' | 'achievements' | 'notifications' | 'kvantoForm';
    const activeTab = tabFromUrl || 'personal';
    const router = useRouter();

    const setActiveTab = (tab: string) => {
        router.push(`?tab=${tab}`, { scroll: false });
    };

    useEffect(() => {
        if (user) {
            getProfile().then(setProfile);
        }
    }, [user]);

    if (isAuthLoading) {
        return <ProfileSkeleton />;
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#f4f5f7] p-4 md:p-8">
            <div className="max-w-[1416px] mx-auto flex flex-col md:flex-row gap-8">
                <aside className="w-64 bg-white rounded-2xl p-4 shadow-sm h-fit">
                    <div className="flex items-center gap-3 mb-6 px-2">
                        <div className="relative w-[80px] h-[80px] aspect-square flex-shrink-0 rounded-full overflow-hidden bg-blue-500">
                            <Image src={profile?.avatar?.replace('http://localhost', '') || '/default-avatar.png'} loading="eager" fill alt={profile?.username || "Avatar"} className="object-cover"/>
                        </div>

                        <div>
                            <p className="text-[20px] font-bold text-sm leading-tight">{profile?.first_name && profile?.last_name ? `${profile.first_name} ${profile.last_name}` : profile?.username}</p>
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

                        {(isTeacher || isAdmin) && <button onClick={() => setActiveTab('kvantoForm')} className={`flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer ${activeTab === 'kvantoForm' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}>
                            Кванто форм (beta)
                        </button>}

                        <Link href={PAGES.KVANTUMID()} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
                            Моя учетная запись
                        </Link>

                        {isAdmin && <Link href={PAGES.ADMINPANEL()} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
                            Админ панель
                        </Link>}
                    </nav>
                </aside>

                {activeTab === 'personal' && <PersonalData user={profile} />}
                {activeTab === 'achievements' && <Achievements user={profile} />}
                {activeTab === 'notifications' && <Notifications/>}
                {activeTab === 'kvantoForm' && (isTeacher || isAdmin) && <KvantoForm/>}
            </div>
        </div>
    );
}