"use client";

import { PAGES } from '@/app/config/page';
import { getProfile } from '@/app/lib/api';
import { User } from '@/app/types/user.interface';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { EditProfileModal } from './_components/EditModal';
import Link from 'next/link';
import { FormatPhoneNumber } from '@/app/utils/FormatPhoneNumber';
import { Separator } from "radix-ui";
import { DropdownMenu } from '@radix-ui/themes';
import { LogoutConfirmModel } from './_components/LogoutConfirmModel';
import { DeleteConfirmModal } from './_components/DeleteConfirmModel';

export default function KvantumID() {
    const [user, setUser] = useState<User | null>(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const router = useRouter();

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
            <header className="max-w-[1200px] mx-auto pt-8 px-4">
                <div className="mb-2">
                    <span className="text-[24px] font-black tracking-tight text-[#005BFF]">Kvantum <span className="font-medium">ID</span></span>
                </div>
                <p className="text-[13px] text-gray-500">Ваш единый аккаунт на Kvantum</p>
            </header>
            <main className="max-w-[1200px] mx-auto mt-12 px-4 flex gap-16">
                <aside className="w-64 flex-shrink-0">
                    <Link href={PAGES.MY_PROFILE()} className="flex items-center gap-2 text-[#005BFF] text-[15px] mb-10 hover:opacity-80 transition-opacity group">
                        <span className="text-[20px] leading-none -mt-[2px]">‹</span> 
                        <span>Вернуться</span>
                    </Link>
                </aside>
                <section className="flex-1 max-w-[800px]">
                    <div className="flex items-start gap-8 mb-12">
                        <div className="relative w-[120px] h-[120px] rounded-full overflow-hidden">
                            <Image src={user?.avatar?.replace('http://localhost', '') || '/default-avatar.png'} fill loading="eager" alt={user?.username || "Avatar"} className="object-cover"/>
                        </div>
                        
                        <div className="flex-1 pt-2">
                            <h1 className="text-[32px] font-bold mb-6">{user?.last_name} {user?.first_name} {user?.middle_name}</h1>
                            
                            <div className="flex gap-16">
                                <div>
                                    <p className="text-[12px] text-gray-400 mb-1">Телефон</p>
                                    <p className="text-[14px]">{FormatPhoneNumber(user?.phone)}</p>
                                    <EditProfileModal user={user}>
                                        <Link href="#" className="text-[13px] text-[#005BFF] mt-2 hover:underline" style={{ cursor: "pointer" }}>Изменить</Link>
                                    </EditProfileModal>
                                </div>
                                <div>
                                    <p className="text-[12px] text-gray-400 mb-1">Почта</p>
                                    <p className="text-[14px]">{user?.email || 'не указанно'}</p>
                                    <EditProfileModal user={user}>
                                        <Link href="#" className="text-[13px] text-[#005BFF] mt-2 hover:underline" style={{ cursor: "pointer" }}>Изменить</Link>
                                    </EditProfileModal>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12">
                        <Separator.Root className="!zw-full mb-8 h-[1px] bg-[rgba(204,214,228,0.6)]" />
                        
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-[20px] font-bold mb-2">Управление аккаунтом</h2>
                                {user?.date_joined && (
                                    <p className="text-[15px] text-gray-400 mb-6">
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
                                        className="text-[#FF005C] text-[15px] hover:underline transition-all cursor-pointer">
                                        Выйти из аккаунта
                                    </button>
                                </LogoutConfirmModel>
                            </div>

                            <DropdownMenu.Root>
                                <DropdownMenu.Trigger>
                                    <button type="button" className="text-gray-300 hover:text-gray-500 !cursor-pointer pt-1 focus-visible:outline-none outline-none" aria-label="Настройки аккаунта">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                        </svg>
                                    </button>
                                </DropdownMenu.Trigger>
                                <DropdownMenu.Content>
                                    <DropdownMenu.Item color="red" className="!cursor-pointer focus:outline-none" onSelect={() => setDeleteModalOpen(true)}>
                                        Удалить аккаунт
                                    </DropdownMenu.Item>
                                </DropdownMenu.Content>
                            </DropdownMenu.Root>

                            <DeleteConfirmModal open={isDeleteModalOpen} onOpenChange={setDeleteModalOpen} />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}