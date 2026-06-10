"use client";

import React from 'react';
import Link from 'next/link';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useAuth } from '../context/AuthContext';
import { PAGES } from '../config/pages.config';
import { HoverDropdown } from './HoverDropdown';
import { AuthModal } from '../(auth)/_components/AuthModal';

interface Props {
    className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
    const { user, isAdmin, countNotifications } = useAuth();

    return (
        <div className="sticky top-0 z-1000 w-full bg-transparent px-4">
            <header className="relative w-full bg-white px-6 pb-3.5 pt-2 md:max-w-354 md:rounded-b-4xl mx-auto shadow-sm">
                <div className="mx-auto flex min-h-15 items-center justify-end px-6">
                    <div className="flex items-center gap-2">
                        <Link href={PAGES.HOME()} className="group flex min-w-17.5 flex-col items-center justify-center gap-1.5 rounded-xl border-none bg-transparent px-3 py-2 text-center no-underline outline-none transition-all duration-200 hover:bg-[#001a34]/5">
                            <div className="relative flex h-7 w-7 items-center justify-center">
                                <svg className="h-6 w-6 text-[#001a34]/40 transition-colors duration-200 group-hover:text-[#005bff]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                                </svg>
                            </div>
                            <span className="text-[13px] font-normal leading-4 text-[#001a34] whitespace-nowrap transition-colors duration-200 group-hover:text-[#005bff]">Главная</span>
                        </Link>
                        
                        <Link href={PAGES.NEWS()} className="group flex min-w-17.5 flex-col items-center justify-center gap-1.5 rounded-xl border-none bg-transparent px-3 py-2 text-center no-underline outline-none transition-all duration-200 hover:bg-[#001a34]/5">
                            <div className="relative flex h-7 w-7 items-center justify-center">
                                <svg className="h-6 w-6 text-[#001a34]/40 transition-colors duration-200 group-hover:text-[#005bff]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M20 5H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 10H5v-2h6v2zm0-4H5V7h6v4zm9 4h-7v-2h7v2zm0-4h-7V7h7v4z"/>
                                </svg>
                            </div>
                            <span className="text-[13px] font-normal leading-4 text-[#001a34] whitespace-nowrap transition-colors duration-200 group-hover:text-[#005bff]">Новости</span>
                        </Link>

                        <HoverDropdown
                            trigger={
                                <Link href={PAGES.QUANTS()} className="group flex min-w-17.5 flex-col items-center justify-center gap-1.5 rounded-xl border-none bg-transparent px-3 py-2 text-center no-underline outline-none transition-all duration-200 hover:bg-[#001a34]/5">
                                    <div className="relative flex h-7 w-7 items-center justify-center">
                                        <svg className="h-6 w-6 text-[#001a34]/40 transition-colors duration-200 group-hover:text-[#005bff]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                                        </svg>
                                    </div>
                                    <span className="text-[13px] font-normal leading-4 text-[#001a34] whitespace-nowrap transition-colors duration-200 group-hover:text-[#005bff]">Программы</span>
                                </Link>
                            }
                        >
                            <div className="min-w-70 rounded-lg bg-white py-3 shadow-[0_10px_38px_-10px_rgba(22,23,24,0.35),0_10px_20px_-15px_rgba(22,23,24,0.2)] z-100">
                                <DropdownMenu.Item className="flex flex-col px-5 py-2.5 text-sm text-[#001a34] cursor-pointer outline-none transition-colors duration-200 data-highlighted:bg-[#f5f7f9]" asChild>
                                    <Link href={PAGES.QUANTS()}>
                                        <span className="text-[15px] font-medium">Основные</span>
                                    </Link>
                                </DropdownMenu.Item>
                                <DropdownMenu.Item className="flex flex-col px-5 py-2.5 text-sm text-[#001a34] cursor-pointer outline-none transition-colors duration-200 data-highlighted:bg-[#f5f7f9]" asChild>
                                    <Link href={PAGES.PAID_COURSES()}>
                                        <span className="text-[15px] font-medium">Платные курсы</span>
                                    </Link>
                                </DropdownMenu.Item>
                            </div>
                        </HoverDropdown>

                        {user?.is_authenticated && user?.username ? (
                            <HoverDropdown 
                                trigger={
                                    <Link href={PAGES.MY_PROFILE()} className="group flex min-w-17.5 flex-col items-center justify-center gap-1.5 rounded-xl border-none bg-transparent px-3 py-2 text-center no-underline outline-none transition-all duration-200 hover:bg-[#001a34]/5">
                                        <div className="relative flex h-7 w-7 items-center justify-center">
                                            <svg className="h-6 w-6 text-[#001a34]/40 transition-colors duration-200 group-hover:text-[#005bff]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                <path fill='currentColor' d="M7.5 14c1.5.005 1.5 1 4.5 1s3-1 4.5-1c1 0 3.5 2.5 3.5 3.5S17.483 21 11.991 21C6.5 21 4 18.5 4 17.5s2.5-3.503 3.5-3.5M12 3C9 3 7 5 7 8s2 5 5 5 5-2 5-5-2-5-5-5"/>
                                            </svg>
                                            {countNotifications > 0 && (
                                                <span className="absolute -top-1.5 -right-2 bg-[#f91155] text-white text-[12px] font-semibold min-w-4.5 h-5 rounded-full flex items-center justify-center px-1.5 font-mono leading-none">
                                                    {countNotifications}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-[13px] font-normal leading-4 text-[#001a34] whitespace-nowrap transition-colors duration-200 group-hover:text-[#005bff]">{user.username}</span>
                                    </Link>
                                }
                            >
                                <div className="min-w-70 rounded-lg bg-white py-3 shadow-[0_10px_38px_-10px_rgba(22,23,24,0.35),0_10px_20px_-15px_rgba(22,23,24,0.2)] z-100">
                                    <DropdownMenu.Item className="flex flex-col px-5 py-2.5 text-sm text-[#001a34] cursor-pointer outline-none transition-colors duration-200 data-highlighted:bg-[#f5f7f9]" asChild>
                                        <Link href={`${PAGES.MY_PROFILE()}?tab=personal`}>
                                            <span className="text-[15px] font-medium">Личный кабинет</span>
                                        </Link>
                                    </DropdownMenu.Item>
                                    <DropdownMenu.Item className="flex flex-col px-5 py-2.5 text-sm text-[#001a34] cursor-pointer outline-none transition-colors duration-200 data-highlighted:bg-[#f5f7f9]" asChild>
                                        <Link href={`${PAGES.MY_PROFILE()}?tab=achievements`}>
                                            <span className="text-[15px] font-medium">Мои достижения</span>
                                        </Link>
                                    </DropdownMenu.Item>
                                    <DropdownMenu.Item className="flex flex-col px-5 py-2.5 text-sm text-[#001a34] cursor-pointer outline-none transition-colors duration-200 data-highlighted:bg-[#f5f7f9]" asChild>
                                        <Link href={`${PAGES.MY_PROFILE()}?tab=notifications`}>
                                            <span className="text-[15px] font-medium">Сообщения</span>
                                        </Link>
                                    </DropdownMenu.Item>
                                    {isAdmin &&  
                                        <DropdownMenu.Item className="flex flex-col px-5 py-2.5 text-sm text-[#001a34] cursor-pointer outline-none transition-colors duration-200 data-highlighted:bg-[#f5f7f9]" asChild>
                                            <Link href={PAGES.ADMINPANEL()}>
                                                <span className="text-[15px] font-medium">Админ панель</span>
                                            </Link>
                                        </DropdownMenu.Item>
                                    }
                                </div>
                            </HoverDropdown>
                        ) : (
                            <AuthModal>
                                <Link href='#' className="group flex min-w-17.5 flex-col items-center justify-center gap-1.5 rounded-xl border-none bg-transparent px-3 py-2 text-center no-underline outline-none transition-all duration-200 hover:bg-[#001a34]/5">
                                    <div className="relative flex h-7 w-7 items-center justify-center">
                                        <svg className="h-6 w-6 text-[#001a34]/40 transition-colors duration-200 group-hover:text-[#005bff]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                            <path fill='currentColor' d="M7.5 14c1.5.005 1.5 1 4.5 1s3-1 4.5-1c1 0 3.5 2.5 3.5 3.5S17.483 21 11.991 21C6.5 21 4 18.5 4 17.5s2.5-3.503 3.5-3.5M12 3C9 3 7 5 7 8s2 5 5 5 5-2 5-5-2-5-5-5"/>
                                        </svg>
                                    </div>
                                    <span className="text-[13px] font-normal leading-4 text-[#001a34] whitespace-nowrap transition-colors duration-200 group-hover:text-[#005bff]">Авторизоваться</span>
                                </Link>
                            </AuthModal>
                        )}
                    </div>
                </div>
            </header>
        </div>
    );
};