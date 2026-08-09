"use client";
import { getPublicProfile } from "@/app/lib/api";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PAGES } from "@/app/config/pages.config";
import { PublicProfileSkeleton } from "../_components/ProfileSkeleton";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { IApiError } from "@/app/types/api-error.interface";
import { useQuery } from "@tanstack/react-query";

const ROLE_LABELS: Record<string, string> = {
    user: 'Пользователь',
    teacher: 'Преподаватель',
    admin: 'Администратор',
};

const MODULE_LABELS: Record<string, string> = {
    intro: 'Вводный модуль',
    advanced: 'Углублённый модуль',
    project: 'Проектный модуль',
};

const STATUS_LABELS: Record<string, string> = {
    active: 'Активен',
    completed: 'Прошёл модуль',
    left: 'Покинул',
};

const STATUS_COLORS: Record<string, string> = {
    active: 'text-green-600 bg-green-50',
    completed: 'text-blue-600 bg-blue-50',
    left: 'text-gray-500 bg-gray-100',
};

export default function ProfileContent(){
    const { username } = useParams();

    const { data: profile, isLoading } = useQuery({
        queryKey: ['profile', username],
        queryFn: async () => {
            try {
                const data = await getPublicProfile(username as string);
                return data;
            } catch (error) {
                const hasApiMarker = error !== null && typeof error === 'object' && 'isApiError' in error;
                const isNotFound = hasApiMarker && (error as IApiError).status === 404;

                if (!isNotFound) {
                    if (hasApiMarker) toast.error((error as IApiError).message);
                    else toast.error("Произошла непредвиденная ошибка на клиенте");
                }

                console.error("Ошибка", error);
                throw error;
            }
        },
        retry: false,
        enabled: !!username && typeof username === 'string',
    });

    if (isLoading) {
        return <PublicProfileSkeleton/>;
    }

    if (!profile) {
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
                        <span className="text-[20px] leading-none -mt-0.5">‹</span>
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
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-10">
                    <div className="flex items-start gap-6">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden shrink-0 bg-gray-100">
                            <Image 
                                src={profile?.avatar?.replace('http://localhost', '') || '/undraw_finance-guy-avatar_vhop.svg'}
                                loading="eager" 
                                fill 
                                priority
                                alt={profile?.username || "Avatar"} 
                                className="object-cover"
                                sizes="80px"
                                quality={75}
                            />
                        </div>

                        <div className="flex-1 pt-1">
                            <div className="flex items-start gap-4 mb-3">
                                <div className="flex-1">
                                    <h1 className="text-[28px] font-bold leading-tight">
                                        {profile.last_name || profile.first_name ? (
                                            <>
                                                {profile.last_name && <span>{profile.last_name}</span>}
                                                {profile.last_name && profile.first_name && <span> </span>}
                                                {profile.first_name && <span>{profile.first_name}</span>}
                                                {profile.middle_name && <span className="text-gray-400 font-normal"> {profile.middle_name}</span>}
                                            </>
                                        ) : (
                                            <span>{profile.username}</span>
                                        )}
                                    </h1>
                                    <p className="text-[14px] text-gray-600 mt-1">@{profile.username}</p>
                                </div>
                                <span className={`shrink-0 text-[12px] font-medium px-3 py-1 rounded-full mt-1 ${roleBadgeColor[profile.role] || 'bg-gray-50 text-gray-500'}`}>
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

                {(profile.current_groups?.length ?? 0) > 0 || (profile.group_history?.length ?? 0) > 0 ? (
                    <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-10">
                        <h2 className="text-[20px] font-bold mb-6">Группы и курсы</h2>

                        {profile.current_groups && profile.current_groups.length > 0 && (
                            <>
                                <h3 className="text-[13px] font-semibold uppercase text-gray-400 tracking-wider mb-3">
                                    Состоит в группах
                                </h3>
                                <div className="flex flex-col gap-3 mb-8">
                                    {profile.current_groups.map((m) => (
                                        <div key={m.id} className="flex items-center justify-between gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <div className="min-w-0">
                                                <p className="font-semibold text-gray-900 truncate">{m.group_name}</p>
                                                <p className="text-[13px] text-gray-500 mt-0.5">
                                                    {MODULE_LABELS[m.module_type ?? ''] ?? m.module_type}
                                                    {m.joined_at ? ` · с ${new Date(m.joined_at).toLocaleDateString('ru-RU')}` : ''}
                                                </p>
                                            </div>
                                            <span className="shrink-0 text-[12px] font-medium text-green-600 bg-green-50 rounded-full px-3 py-1">
                                                Активен
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {profile.group_history && profile.group_history.length > 0 && (
                            <>
                                <h3 className="text-[13px] font-semibold uppercase text-gray-400 tracking-wider mb-3">
                                    История групп
                                </h3>
                                <div className="flex flex-col gap-3">
                                    {profile.group_history.map((m) => (
                                        <div key={m.id} className="flex items-center justify-between gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <div className="min-w-0">
                                                <p className="font-semibold text-gray-900 truncate">{m.group_name}</p>
                                                <p className="text-[13px] text-gray-500 mt-0.5">
                                                    {MODULE_LABELS[m.module_type ?? ''] ?? m.module_type}
                                                    {m.joined_at ? ` · с ${new Date(m.joined_at).toLocaleDateString('ru-RU')}` : ''}
                                                    {m.completed_at ? ` · до ${new Date(m.completed_at).toLocaleDateString('ru-RU')}` : ''}
                                                </p>
                                            </div>
                                            <span className={`shrink-0 text-[12px] font-medium rounded-full px-3 py-1 ${STATUS_COLORS[m.status] ?? 'text-gray-500 bg-gray-100'}`}>
                                                {STATUS_LABELS[m.status] ?? m.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                ) : null}

                <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-10">
                    <h2 className="text-[20px] font-bold mb-6">Достижения</h2>
                    <div className="flex flex-col items-center justify-center min-h-75 gap-4 text-center">
                        <Image 
                            src="/Achievement-rafiki.svg" 
                            alt="Достижения" 
                            width={240} 
                            height={240}
                            priority
                            className="opacity-90"
                        />
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }} 
                            className="flex flex-col gap-1"
                        >
                            <p className="text-[16px] font-semibold text-gray-800">Пока достижений нет</p>
                            <p className="text-[14px] text-gray-600 max-w-sm">
                                Достижения появятся автоматически, когда вы будете их зарабатывать. 
                                Просто продолжайте использовать сайт и достигать новых высот!
                            </p>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    ); 
}
