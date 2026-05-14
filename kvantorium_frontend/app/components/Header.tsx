'use client';

import { useState } from 'react';
import "./header.css";
import Link from 'next/link';
import { PAGES } from '@/app/config/pages.config';
import { AuthModal } from '@/app/(auth)/_components/AuthModal';
import { DropdownMenu } from "radix-ui";
import { useAuth } from '../context/AuthContext';
import { HoverDropdown } from './HoverDropdown';

interface Props {
    className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
    const [countNotifications, setCountNotifications] = useState(0);
    const { user } = useAuth();

    return(
        <header className={`Header ${className || '' }`}>
            <div className="Header-container">
                <div className="Header-content-right">
                    <Link href={PAGES.HOME()} className="Header-item">
                        <div className="Icon-wrapper">
                            <svg color='rgba(0, 26, 52, 0.4)' xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
                                <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                            </svg>
                        </div>
                        <span className="Item-text">Главная</span>
                    </Link>
                    
                    <Link href={PAGES.NEWS()} className="Header-item">
                        <div className="Icon-wrapper">
                            <svg color='rgba(0, 26, 52, 0.4)' xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
                                <path fill="currentColor" d="M20 5H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 10H5v-2h6v2zm0-4H5V7h6v4zm9 4h-7v-2h7v2zm0-4h-7V7h7v4z"/>
                            </svg>
                        </div>
                        <span className="Item-text">Новости</span>
                    </Link>

                    <HoverDropdown
                        trigger={
                            <Link href={PAGES.MY_PROFILE()} className="Header-item focus-visible:outline-none outline-none">
                                <div className="Icon-wrapper">
                                    <svg color='rgba(0, 26, 52, 0.4)' xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                                    </svg>
                                </div>
                                <span className="Item-text">Программы</span>
                            </Link>
                        }
                    >
                        <div className="Ozon-Menu-Items">
                            <DropdownMenu.Item className="DropdownMenuItem" asChild>
                                <Link href={PAGES.QUANTS()}>
                                    <span className="ItemTitle">Основные</span>
                                </Link>
                            </DropdownMenu.Item>
                            <DropdownMenu.Item className="DropdownMenuItem" asChild>
                                <Link href={`${PAGES.QUANTS()}?tab=achievements`}>
                                    <span className="ItemTitle">Платные курсы</span>
                                </Link>
                            </DropdownMenu.Item>
                        </div>
                    </HoverDropdown>
                    
                    {user?.is_authenticated && user?.username ? (
                        <>
                        <HoverDropdown 
                            trigger={
                                <Link href={PAGES.MY_PROFILE()} className="Header-item focus-visible:outline-none outline-none">
                                    <div className="Icon-wrapper">
                                        <svg color='rgba(0, 26, 52, 0.4)' xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
                                            <path fill='currentColor' d="M7.5 14c1.5.005 1.5 1 4.5 1s3-1 4.5-1c1 0 3.5 2.5 3.5 3.5S17.483 21 11.991 21C6.5 21 4 18.5 4 17.5s2.5-3.503 3.5-3.5M12 3C9 3 7 5 7 8s2 5 5 5 5-2 5-5-2-5-5-5"/>
                                        </svg>
                                        {countNotifications > 0 && <span className="Badge">{countNotifications}</span>}
                                    </div>
                                    <span className="Item-text">{user.username}</span>
                                </Link>
                            }
                        >
                            <div className="Ozon-Menu-Items">
                                <DropdownMenu.Item className="DropdownMenuItem" asChild>
                                    <Link href={`${PAGES.MY_PROFILE()}?tab=personal`}>
                                        <span className="ItemTitle">Личный кабинет</span>
                                    </Link>
                                </DropdownMenu.Item>
                                <DropdownMenu.Item className="DropdownMenuItem" asChild>
                                    <Link href={`${PAGES.MY_PROFILE()}?tab=achievements`}>
                                        <span className="ItemTitle">Мои достижения</span>
                                    </Link>
                                </DropdownMenu.Item>
                                <DropdownMenu.Item className="DropdownMenuItem" asChild>
                                    <Link href={`${PAGES.MY_PROFILE()}?tab=notifications`}>
                                        <span className="ItemTitle">Сообщения</span>
                                    </Link>
                                </DropdownMenu.Item>
                                {user?.role === 'admin' &&  
                                <DropdownMenu.Item className="DropdownMenuItem" asChild>
                                    <Link href={PAGES.ADMINPANEL()}>
                                        <span className="ItemTitle">Админ панель</span>
                                    </Link>
                                </DropdownMenu.Item>
                                }
                            </div>
                        </HoverDropdown>
                        </>
                    ) : (
                        <AuthModal>
                            <Link href='#' className="Header-item">
                                <div className="Icon-wrapper">
                                    <svg color='rgba(0, 26, 52, 0.4)' xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
                                        <path fill='currentColor' d="M7.5 14c1.5.005 1.5 1 4.5 1s3-1 4.5-1c1 0 3.5 2.5 3.5 3.5S17.483 21 11.991 21C6.5 21 4 18.5 4 17.5s2.5-3.503 3.5-3.5M12 3C9 3 7 5 7 8s2 5 5 5 5-2 5-5-2-5-5-5"/>
                                    </svg>
                                </div>
                                <span className="Item-text">Авторизоавтся</span>
                            </Link>
                        </AuthModal>
                    )}
                </div>
            </div>
        </header>
    );
};