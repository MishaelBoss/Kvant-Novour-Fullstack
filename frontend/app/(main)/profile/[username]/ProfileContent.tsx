'use client'
import { getPublicProfile } from "@/app/lib/api";
import { IPublicProfileData } from "@/app/types/profile.interface";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PAGES } from "@/app/config/pages.config";
import { PublicProfileSkeleton } from "../_components/ProfileSkeleton";

const ROLE_LABELS: Record<string, string> = {
    student: 'Ученик',
    parent: 'Родитель',
    user: 'Пользователь',
    teacher: 'Преподаватель',
    admin: 'Администратор',
};

export default function ProfileContent(){
    const { username } = useParams();
    const [profile, setProfile] = useState<IPublicProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getProfile = useCallback(async () => {
        if(!username) return;

        getPublicProfile(username as string)
            .then(data => {
                setProfile(data); 
                setError(null);
            }).catch(() => {
                setError("Пользователь не найден");
            }).finally(() => {
                setLoading(false);
            });
    }, [username]);

    useEffect(() => {
        const handleFetchEvent = async() => await getProfile();

        handleFetchEvent();
    }, [getProfile]);

    if (loading) {
        return <PublicProfileSkeleton/>;
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen bg-white font-sans text-[#2B2E33] flex items-center justify-center">
                <div className="text-center max-w-sm">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
                        </svg>
                    </div>
                    <h2 className="text-[20px] font-bold mb-2">Пользователь не найден</h2>
                    <p className="text-[14px] text-gray-400 mb-6">Такого пользователя не существует или ссылка неверна</p>
                    <Link 
                        href={PAGES.HOME()} 
                        className="inline-flex items-center gap-2 text-[15px] text-[#005BFF] mb-10 hover:opacity-80 transition-opacity font-medium group"
                    >
                        <span className="text-[20px] leading-none -mt-[2px]">‹</span>
                        <span>На главную</span>
                    </Link>
                </div>
            </div>
        )
    };

    const roleLabel = ROLE_LABELS[profile.role] || profile.role || 'Пользователь';

    const roleBadgeColor: Record<string, string> = {
        student: 'bg-blue-50 text-blue-600',
        parent: 'bg-purple-50 text-purple-600',
        user: 'bg-gray-50 text-gray-500',
        teacher: 'bg-green-50 text-[#00B856]',
        admin: 'bg-amber-50 text-amber-600',
    };

    return (
        <div className="min-h-screen font-sans text-[#2B2E33]">
            <header className="max-w-300 mx-auto pt-8 px-4">
                <Link 
                    href={PAGES.HOME()} 
                    className="inline-flex items-center gap-2 text-[#005BFF] text-[15px] mb-2 hover:opacity-80 transition-opacity"
                >
                    <span className="text-[20px] leading-none -mt-0.5">‹</span>
                    <span>На главную</span>
                </Link>
            </header>

            <main className="max-w-300 mx-auto mt-6 px-4 pb-16">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-10">
                    <div className="flex items-start gap-6">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden shrink-0 bg-gray-100">
                            {profile.avatar ? (
                                <Image 
                                    src={profile.avatar.replace('http://localhost', '')}
                                    fill
                                    priority
                                    alt={profile.username}
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <circle cx="12" cy="8" r="4" />
                                        <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 pt-1">
                            <div className="flex items-center gap-3 mb-3">
                                <h1 className="text-[24px] font-bold">
                                    {profile.first_name || profile.username}
                                </h1>
                                <span className={`text-[12px] font-medium px-3 py-1 rounded-full ${roleBadgeColor[profile.role] || 'bg-gray-50 text-gray-500'}`}>
                                    {roleLabel}
                                </span>
                            </div>
                            <p className="text-[15px] text-gray-600">
                                На сайте с {new Date(profile.date_joined).toLocaleDateString('ru-RU', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-10">
                    <h2 className="text-[20px] font-bold mb-6">Достижения</h2>
                    <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 text-center">
                        <Image 
                            src="/Achievement-rafiki.svg" 
                            alt="Достижения" 
                            width={240} 
                            height={240}
                            loading="eager"
                            className="opacity-90"
                        />
                        <div className="flex flex-col gap-1">
                            <p className="text-[16px] font-semibold text-gray-800">Пока достижений нет</p>
                            <p className="text-[14px] text-gray-600 max-w-sm">
                                Достижения появятся автоматически, когда вы будете их зарабатывать. 
                                Просто продолжайте использовать сайт и достигать новых высот!
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    ); 
}
