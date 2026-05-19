"use client";

import { PAGES } from "@/app/config/pages.config";
import { editProfile } from "@/app/lib/api";
import { IEditProfile } from "@/app/types/user.interface";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { Achievements } from "./_components/Achievements";
import { PersonalData } from "./_components/PersonalData";
import { Notifications } from "./_components/Notifications";
import { KvantoForm } from "./_components/KvantoForm";
import { useAuth } from "@/app/context/AuthContext";
import { ProfileSkeleton } from "./_components/ProfileSkeleton";
import { useForm, FormProvider } from "react-hook-form";

export default function MyProfile() {
    const { user, isLoading: isAuthLoading, isAdmin, isTeacher } = useAuth(); 
    const searchParams = useSearchParams();
    const tabFromUrl = searchParams.get('tab') as 'personal' | 'achievements' | 'notifications' | 'kvantoForm';
    const activeTab = tabFromUrl || 'personal';
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const methods = useForm<IEditProfile>({
        defaultValues: {
            username: "",
            phone: "",
            middle_name: "",
            first_name: "",
            last_name: "",
            avatar: null
        }
    });

    useEffect(() => {
        if (user) {
            methods.reset({
                username: user?.username || '',
                first_name: user?.first_name || '',
                last_name: user?.last_name || '',
                middle_name: user?.middle_name || '',
                phone: user?.phone || '',
                email: user?.email || '',
                avatar: user?.avatar || null
            });
        }
    }, [user, methods]);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            await editProfile({ avatar: file } as IEditProfile);
        } catch (error) {
            console.error('Ошибка при загрузке аватара:', error);
        }
    };

    const setActiveTab = (tab: string) => {
        router.push(`?tab=${tab}`, { scroll: false });
    };

    if (isAuthLoading) {
        return <ProfileSkeleton />;
    }

    return (
        <FormProvider {...methods}>
            <div className="min-h-screen bg-[#f4f5f7] p-4 md:p-8">
                <div className="max-w-[1416px] mx-auto flex flex-col md:flex-row gap-8">
                    <aside className="w-64 bg-white rounded-2xl p-4 shadow-sm h-fit">
                        <div className="flex items-center gap-3 mb-6 px-2">
                            <div onClick={() => fileInputRef.current?.click()} className="relative w-[80px] h-[80px] aspect-square flex-shrink-0 rounded-full overflow-hidden bg-blue-500 cursor-pointer group">
                                <Image 
                                    src={user?.avatar?.replace('http://localhost', '') || '/default-avatar.png'}
                                    loading="eager" 
                                    fill 
                                    priority
                                    alt={user?.username || "Avatar"} 
                                    className="object-cover"
                                    sizes="80px"
                                    quality={75}
                                />

                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <svg color="#fff" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                                        <path fill="currentColor" d="M14.465 2a2 2 0 0 1 1.664.89L17.535 5H19a4 4 0 0 1 4 4v9a4 4 0 0 1-4 4H5a4 4 0 0 1-4-4V9a4 4 0 0 1 4-4h1.465L7.87 2.89A2 2 0 0 1 9.535 2zM7.832 6.555A1 1 0 0 1 7 7H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2a1 1 0 0 1-.832-.445L14.465 4h-4.93zM12 8a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6M6 8a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                                    </svg>
                                </div>
                            </div>

                            <input 
                                ref={fileInputRef}
                                type="file" 
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                aria-label="Выберите изображение для загрузки" 
                            />

                            <div>
                                <h1 className="text-[20px] font-bold text-sm leading-tight">
                                    {user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.username}
                                </h1>
                            </div>
                        </div>

                        <nav className="flex flex-col gap-1">
                            <p className="text-[11px] font-semibold text-gray-600 uppercase px-3 mb-2 tracking-wider">
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

                    {activeTab === 'personal' && <PersonalData user={user} />}
                    {activeTab === 'achievements' && <Achievements/>}
                    {activeTab === 'notifications' && <Notifications/>}
                    {activeTab === 'kvantoForm' && (isTeacher || isAdmin) && <KvantoForm/>}
                </div>
            </div>
        </FormProvider>
    );
}