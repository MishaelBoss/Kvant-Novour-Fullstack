"use client";

import { PAGES } from '@/app/config/pages.config';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { EditProfileModal } from './_components/EditModal';
import Link from 'next/link';
import { FormatPhoneNumber } from '@/app/utils/FormatPhoneNumber';
import { Separator } from "radix-ui";
import { DropdownMenu } from '@radix-ui/themes';
import { LogoutConfirmModel } from './_components/LogoutConfirmModel';
import { DeleteConfirmModal } from './_components/DeleteConfirmModel';
import { useAuth } from '@/app/context/AuthContext';
import { KvantumIDSkeleton } from './_components/KvantumIDSkeleton';
import { Monitor, Laptop, Smartphone } from 'lucide-react';
import { getActiveSessions } from '@/app/lib/api';
import { DeleteSessionModel } from './_components/DeleteSessionModel';
import { DeleteAllSessionModel } from './_components/DeleteAllSessionModel';

export default function KvantumIdContent() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isDeleteAllSessionsModalOpen, setDeleteAllSessionsModalOpen] = useState(false);
    const [sessions, setSessions] = useState<any[]>([]);
    const [showAllSessions, setShowAllSessions] = useState(false);

    const fetchSessions = useCallback(async () => {
        await getActiveSessions().then((res) => {
            let data: any[] = [];
            if (Array.isArray(res?.results)) {
                data = res.results;
            } else if (Array.isArray(res)) {
                data = res;
            }
            const seen = new Set<number>();
            setSessions(data.filter(s => {
                if (seen.has(s.id)) return false;
                seen.add(s.id);
                return true;
            }));
        });
    }, []);

    useEffect(() => {
        fetchSessions();

        const handleCustomEvent = () => {
            fetchSessions();
        };

        window.addEventListener("fetchSessions", handleCustomEvent);
        return () => {
            window.removeEventListener("fetchSessions", handleCustomEvent);
        };
    }, [fetchSessions]);

    const getDeviceIcon = (os: string) => {
        const platform = os.toLowerCase();
        if (platform.includes('win')) return <Monitor size={20} strokeWidth={2} />;
        if (platform.includes('mac') || platform.includes('linux')) return <Laptop size={20} strokeWidth={2} />;
        return <Smartphone size={20} strokeWidth={2} />;
    };

    if (isAuthLoading) {
        return <KvantumIDSkeleton />;
    }

    const visibleSessions = showAllSessions ? sessions : sessions.slice(0, 2);

    return (
        <div className="min-h-screen bg-white font-sans text-[#2B2E33]">
            <header className="max-w-300 mx-auto pt-8 px-4">
                <div className="mb-2">
                    <span className="text-[24px] font-black tracking-tight text-[#005BFF]">Kvantum <span className="font-medium">ID</span></span>
                </div>
                <p className="text-[13px] text-gray-500">Ваш единый аккаунт на Kvantum</p>
            </header>
            <main className="max-w-300 mx-auto mt-12 px-4 flex gap-16">
                <aside className="w-64 shrink-0">
                    <Link href={PAGES.MY_PROFILE()} className="flex items-center gap-2 text-[#005BFF] text-[15px] mb-10 hover:opacity-80 transition-opacity group">
                        <span className="text-[20px] leading-none -mt-0.5">‹</span> 
                        <span>Вернуться</span>
                    </Link>
                </aside>
                <section className="flex-1 max-w-200">
                    <div className="flex items-start gap-8 mb-12">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden">
                            <Image src={user?.avatar?.replace('http://localhost', '') || '/undraw_finance-guy-avatar_vhop.svg'} fill loading="eager" alt={user?.username || "Avatar"} className="object-cover"/>
                        </div>
                        
                        <div className="flex-1 pt-2">
                            <h1 className="text-[32px] font-bold mb-6">{user?.last_name} {user?.first_name} {user?.middle_name}</h1>
                            
                            <div className="flex gap-16">
                                <div>
                                    <p className="text-[12px] text-gray-600 mb-1">Телефон</p>
                                    <p className="text-[14px]">{FormatPhoneNumber(user?.phone)}</p>
                                    <EditProfileModal user={user}>
                                        <Link href="#" className="text-[13px] text-[#005BFF] mt-2 hover:underline" style={{ cursor: "pointer" }}>Изменить</Link>
                                    </EditProfileModal>
                                </div>
                                <div>
                                    <p className="text-[12px] text-gray-600 mb-1">Почта</p>
                                    <p className="text-[14px]">{user?.email || 'не указанно'}</p>
                                    <EditProfileModal user={user}>
                                        <Link href="#" className="text-[13px] text-[#005BFF] mt-2 hover:underline" style={{ cursor: "pointer" }}>Изменить</Link>
                                    </EditProfileModal>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12">
                        <Separator.Root className="!zw-full mb-8 h-px bg-[rgba(204,214,228,0.6)]" />
                        
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-[20px] font-bold mb-2">Управление аккаунтом</h2>
                                {user?.date_joined && (
                                    <p className="text-[15px] text-[#6b7280] mb-6">
                                        Вы с нами с {new Date(user?.date_joined).toLocaleDateString('ru-RU', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })} года
                                    </p>
                                )}
                                
                                <LogoutConfirmModel>
                                    <button 
                                        type="button" 
                                        className="text-[#e60053] text-[15px] hover:underline transition-all cursor-pointer">
                                        Выйти из аккаунта
                                    </button>
                                </LogoutConfirmModel>
                            </div>

                            <DropdownMenu.Root>
                                <DropdownMenu.Trigger>
                                    <button type="button" className="text-gray-300 hover:text-gray-500 cursor-pointer! pt-1 focus-visible:outline-none outline-none" aria-label="Настройки аккаунта">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                        </svg>
                                    </button>
                                </DropdownMenu.Trigger>
                                <DropdownMenu.Content>
                                    <DropdownMenu.Item color="red" className="cursor-pointer! focus:outline-none" onSelect={() => setDeleteModalOpen(true)}>
                                        Удалить аккаунт
                                    </DropdownMenu.Item>
                                </DropdownMenu.Content>
                            </DropdownMenu.Root>

                            <DeleteConfirmModal open={isDeleteModalOpen} onOpenChange={setDeleteModalOpen} />
                        </div>

                        <div className="mt-12 pt-8 border-t border-[rgba(204,214,228,0.4)] space-y-6">
                            <div className="flex justify-between items-center">
                                <div className="space-y-1">
                                    <h2 className="text-[20px] font-bold text-[#2B2E33]">Сеансы и устройства</h2>
                                    <p className="text-[13px] text-gray-400">Вы уже заходили в профиль на этих устройствах</p>
                                </div>

                                <DropdownMenu.Root>
                                    <DropdownMenu.Trigger>
                                        <button type="button" className="text-gray-300 hover:text-gray-500 cursor-pointer! pt-1 focus-visible:outline-none outline-none" aria-label="Настройки аккаунта">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                            </svg>
                                        </button>
                                    </DropdownMenu.Trigger>
                                    <DropdownMenu.Content>
                                        <DropdownMenu.Item color="red" className="cursor-pointer! focus:outline-none" onSelect={() => setDeleteAllSessionsModalOpen(true)}>
                                            Выйти из всех сеансов
                                        </DropdownMenu.Item>
                                    </DropdownMenu.Content>
                                </DropdownMenu.Root>

                                <DeleteAllSessionModel open={isDeleteAllSessionsModalOpen} onOpenChange={setDeleteAllSessionsModalOpen} />
                            </div>

                            <div className="space-y-3">
                                {visibleSessions.length > 0 ? (
                                    visibleSessions.map((session) => (
                                        <div 
                                            key={session.id} 
                                            className="group relative flex items-center gap-4 bg-white border rounded-2xl p-4 shadow-sm transition-colors border-gray-100 hover:border-gray-200"
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                                session.is_current ? 'bg-green-50 text-[#00B856]' : 'bg-gray-50 text-gray-500'
                                            }`}>
                                                {getDeviceIcon(session.os)}
                                            </div>

                                            <div className="flex-1 min-w-0 text-xs text-gray-400">
                                                <p className="text-[14px] font-bold text-gray-800 mb-0.5">
                                                    {session.os} · {session.browser}
                                                </p>
                                                <p className="truncate">
                                                    {new Date(session.created_at).toLocaleDateString('ru-RU', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })} в {new Date(session.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                                                    {' · '}{session.location}
                                                    {' · '}{session.ip_address}
                                                    {session.is_current && (
                                                        <>
                                                            {' · '}<span className="text-[#00B856] font-medium">Текущий сеанс</span>
                                                        </>
                                                    )}
                                                </p>
                                            </div>

                                            {!session.is_current && (
                                                <DeleteSessionModel session_id={session.id}>
                                                    <button
                                                        type="button"
                                                        className="absolute right-4 opacity-0 group-hover:opacity-100 text-10 font-semibold text-[#005bff] hover:underline bg-white pl-2 transition-opacity duration-150 cursor-pointer focus:outline-none"
                                                    >
                                                        Выйти
                                                    </button>
                                                </DeleteSessionModel>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-[14px] text-gray-400">Активные сессии не найдены.</p>
                                )}
                            </div>

                            {sessions.length > 2 && (
                                <div className="pt-2">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowAllSessions(!showAllSessions)}
                                        className="text-[#005BFF] text-[15px] font-bold hover:text-[#004ae6] transition-colors cursor-pointer"
                                    >
                                        {showAllSessions ? 'Скрыть сторонние' : 'Показать все'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}