import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { NotificationSidebar } from "./NotificationSidebar";
import { SystemNotificationCard } from "./SystemNotificationCard";
import { ChatNotificationCard } from "./ChatNotificationCard";
import { getNotificationsList, readAllNotifications, readNotification } from "@/app/lib/api";
import { INotifications } from "@/app/types/notifications.interface";
import { NewsNotificationsCard } from "./NewsNotificationsCard";
import { useAuth } from "@/app/context/AuthContext";

export function Notifications() {
    const { isLoading } = useAuth();
    const [latestDates, setLatestDates] = useState({ system: '', chat: '', news: '' });
    const [notifications, setNotifications] = useState<INotifications[]>([]);
    const [activeFilter, setActiveFilter] = useState<'system' | 'chat' | 'news'>('system');

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await getNotificationsList();
                if (res && res.notifications) {
                    const formattedData = res.notifications.map((n: any) => ({
                        ...n,
                        isRead: n.is_read !== undefined ? n.is_read : n.isRead
                    }));

                    setNotifications(formattedData);
                    
                    if (res.latest_dates) {
                        setLatestDates(res.latest_dates);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchNotifications();
    }, []);

    const toggleRead = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        readNotification(id);
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        readAllNotifications();
    };

    const filteredNotifications = useMemo(() => {
        return notifications.filter(n => n.type === activeFilter);
    }, [notifications, activeFilter]);

    const unreadCounts = useMemo(() => {
        return {
            all: notifications.filter(n => !n.isRead).length,
            system: notifications.filter(n => n.type === 'system' && !n.isRead).length,
            chat: notifications.filter(n => n.type === 'chat' && !n.isRead).length,
            news: notifications.filter(n => n.type === 'news' && !n.isRead).length,
        };
    }, [notifications]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setNotifications(prev =>
                prev.map(notif => {
                    if (notif.type === activeFilter && !notif.isRead) {
                        readNotification(notif.id);
                        return { ...notif, isRead: true };
                    }
                    return notif;
                })
            );
        }, 1500);

        return () => clearTimeout(timer);
    }, [activeFilter]);

    const sidebarTabs = [
        {
            id: 'system' as const,
            title: 'Безопасность',
            text: 'Вход в аккаунт, безопасность',
            unread: unreadCounts.system,
            date: latestDates.system,
            bg: 'bg-gradient-to-b from-[#94a3b8] to-[#475569] shadow-[0_2px_6px_rgba(71,85,105,0.2),inset_0_1px_1px_rgba(255,255,255,0.2)]',
            icon: <Image src='/buyer_security_chat_icon.png' width={100} height={100} alt="Системная иконка" className="rounded-2xl"/>
        },
        {
            id: 'chat' as const,
            title: 'Связь с преподавателем',
            text: 'Комментарии к проектам, чаты',
            unread: unreadCounts.chat,
            date: latestDates.chat,
            bg: 'bg-gradient-to-b from-[#60a5fa] to-[#2563eb] shadow-[0_2px_8px_rgba(37,99,235,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)]',
            icon: <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
        },
        {
            id: 'news' as const,
            title: 'Мероприятия',
            text: 'Хакатоны, конкурсы',
            unread: unreadCounts.news,
            date: latestDates.news,
            bg: 'bg-gradient-to-b from-[#10b981] to-[#047857] shadow-[0_2px_8px_rgba(4,120,87,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)]',
            icon: <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        }
    ];

    if (isLoading) return <div className="p-8 text-center text-gray-500">Загрузка уведомлений...</div>;

    return (
        <div className="flex-1 bg-white rounded-[24px] shadow-sm border border-gray-200/50 flex h-[650px] overflow-hidden font-sans antialiased">
            <NotificationSidebar 
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                sidebarTabs={sidebarTabs}
                totalUnread={unreadCounts.all}
                onMarkAllAsRead={markAllAsRead}
            />

            <main className="flex-1 p-6 bg-[#fafafa] flex flex-col gap-5 overflow-y-auto h-full scroll-smooth">
                {filteredNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                        <Image src="/Digital nomad-rafiki.svg" alt="Пусто" width={220} height={220} loading="eager" />
                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-semibold text-gray-700">В этой категории пусто</p>
                            <p className="text-xs text-gray-400 max-w-xs">Новые оповещения появятся здесь сразу после их отправки.</p>
                        </div>
                    </div>
                ) : (
                    filteredNotifications.map((notif, index) => {
                        const showDateGroup = index === 0 || filteredNotifications[index - 1].groupDate !== notif.groupDate;

                        return (
                            <div key={notif.id} className="w-full flex flex-col gap-4 shrink-0">
                                {showDateGroup && (
                                    <div className="w-full flex justify-center my-1">
                                        <span className="text-[12px] font-medium text-gray-400 select-none">
                                            {notif.groupDate}
                                        </span>
                                    </div>
                                )}

                                {notif.type === 'system' && (
                                    <SystemNotificationCard 
                                        notif={notif}
                                    />
                                )}

                                {notif.type === 'chat' && (
                                    <ChatNotificationCard 
                                        notif={notif} 
                                        onRead={toggleRead} 
                                    />
                                )}

                                {notif.type === 'news' && (
                                    <div className="w-[460] max-w-[460px] max-w-[740px] xl:max-w-none gap-6 auto-rows-fr">
                                        <NewsNotificationsCard
                                            notif={notif}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </main>
        </div>
    );
}