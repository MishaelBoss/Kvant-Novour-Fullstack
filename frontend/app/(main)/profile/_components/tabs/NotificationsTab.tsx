import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { NotificationSidebar } from "../NotificationSidebar";
import { SystemNotificationCard } from "../SystemNotificationCard";
import { ChatNotificationCard } from "../ChatNotificationCard";
import { getNotificationsList, readAllNotifications, readNotification } from "@/app/lib/api";
import { INotifications, NotificationsType } from "@/app/types/notifications.interface";
import { IApiError } from "@/app/types/api-error.interface";
import { NewsNotificationsCard } from "../NewsNotificationsCard";
import { useAuth } from "@/app/context/AuthContext";
import { useWebSocket, LiveNotification } from "@/app/context/WebSocketContext";
import { CalendarDaysIcon, MessageCircleMoreIcon, ShieldCheckIcon } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

export function NotificationsTab() {
    const { isLoading, setCountNotifications } = useAuth();
    const { liveNotifications } = useWebSocket();
    const [latestDates, setLatestDates] = useState({ system: '', chat: '', news: '' });
    const [notifications, setNotifications] = useState<INotifications[]>([]);
    const [activeFilter, setActiveFilter] = useState<'system' | 'chat' | 'news'>('system');

    const { data: queryData } = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            try {
                const data = await getNotificationsList();
                return data;
            } catch (error) {
                const hasApiMarker = error !== null && typeof error === 'object' && 'isApiError' in error;

                if (hasApiMarker) toast.error((error as IApiError).message);
                else toast.error("Произошла непредвиденная ошибка на клиенте");

                console.error("Ошибка", error);
                throw error;
            }
        },
        retry: false,
    });

    useEffect(() => {
        if (!queryData || !Array.isArray(queryData?.results)) return;

        setNotifications(prev => {
            const apiIds = new Set(queryData.results.map(item => item.id));
            const keptLive = prev.filter(item => !apiIds.has(item.id) && item.id < 0);
            return [...keptLive, ...queryData.results];
        });

        if (queryData.latest_dates) {
            setLatestDates(queryData.latest_dates);
        }
    }, [queryData]);

    useEffect(() => {
        if (liveNotifications.length === 0) return;
        setNotifications(prev => {
            const existingIds = new Set(prev.map(n => n.id));
            const newItems = liveNotifications
                .filter((n): n is LiveNotification & { id: number } => n.id != null)
                .filter(n => !existingIds.has(n.id))
                .map(n => ({
                    id: n.id ?? -(Date.now() + Math.random()),
                    type: n.type as NotificationsType,
                    title: n.title,
                    description: n.description,
                    is_read: n.isRead ?? false,
                    created_at: new Date().toISOString(),
                    time: n.time || 'Только что',
                    group_date: 'Только что',
                    sender_name: '',
                    avatar_url: '',
                    news: null as any,
                }));
            if (newItems.length === 0) return prev;
            return [...newItems, ...prev];
        });
    }, [liveNotifications]);

    const toggleRead = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        setCountNotifications(prev => Math.max(0, prev - 1));
        readNotification(id);
    };

    const markAllAsRead = () => {
        const unread = notifications.filter(n => !n.is_read).length;
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        if (unread > 0) setCountNotifications(prev => Math.max(0, prev - unread));
        readAllNotifications();
    };

    const filteredNotifications = useMemo(() => {
        return notifications.filter(n => n.type === activeFilter);
    }, [notifications, activeFilter]);

    const unreadCounts = useMemo(() => {
        return {
            all: notifications.filter(n => !n.is_read).length,
            system: notifications.filter(n => n.type === 'system' && !n.is_read).length,
            chat: notifications.filter(n => n.type === 'chat' && !n.is_read).length,
            news: notifications.filter(n => n.type === 'news' && !n.is_read).length,
        };
    }, [notifications]);

    useEffect(() => {
        const timer = setTimeout(() => {
            let readCount = 0;
            setNotifications(prev => {
                const updated = prev.map(notif => {
                    if (notif.type === activeFilter && !notif.is_read) {
                        readCount++;
                        readNotification(notif.id);
                        return { ...notif, is_read: true };
                    }
                    return notif;
                });
                if (readCount > 0) queueMicrotask(() => { setCountNotifications(c => Math.max(0, c - readCount)); });
                return updated;
            });
        }, 1500);

        return () => clearTimeout(timer);
    }, [activeFilter, setCountNotifications, readNotification]);

    const sidebarTabs = [
        {
            id: 'system' as const,
            title: 'Безопасность',
            text: 'Вход в аккаунт, безопасность',
            unread: unreadCounts.system,
            date: latestDates.system,
            bg: 'bg-gradient-to-b from-[#94a3b8] to-[#475569] shadow-[0_2px_6px_rgba(71,85,105,0.2),inset_0_1px_1px_rgba(255,255,255,0.2)]',
            icon: <ShieldCheckIcon className="w-5 h-5 text-white"/>
        },
        {
            id: 'chat' as const,
            title: 'Связь с преподавателем',
            text: 'Комментарии к проектам, чаты',
            unread: unreadCounts.chat,
            date: latestDates.chat,
            bg: 'bg-gradient-to-b from-[#60a5fa] to-[#2563eb] shadow-[0_2px_8px_rgba(37,99,235,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)]',
            icon: <MessageCircleMoreIcon className="w-5 h-5 text-white"/>
        },
        {
            id: 'news' as const,
            title: 'Мероприятия',
            text: 'Хакатоны, конкурсы',
            unread: unreadCounts.news,
            date: latestDates.news,
            bg: 'bg-gradient-to-b from-[#10b981] to-[#047857] shadow-[0_2px_8px_rgba(4,120,87,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)]',
            icon: <CalendarDaysIcon className="w-5 h-5 text-white"/>
        }
    ];

    if (isLoading) return <div className="p-8 text-center text-gray-500">Загрузка уведомлений...</div>;

    return (
        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-200/50 flex h-162.5 overflow-hidden font-sans antialiased">
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
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ 
                                opacity: 1, 
                                y: [0, -12, 0],
                            }}
                            transition={{
                                opacity: { duration: 0.6, ease: "easeOut" },
                                y: {
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }
                            }}
                            whileHover={{ scale: 1.03 }}
                        >
                            <Image src="/Digital nomad-rafiki.svg" alt="Пусто" width={220} height={220} loading="eager" />
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }} 
                            className="flex flex-col gap-1"
                        >
                            <p className="text-sm font-semibold text-gray-700">В этой категории пусто</p>
                            <p className="text-xs text-gray-400 max-w-xs">Новые оповещения появятся здесь сразу после их отправки.</p>
                        </motion.div>
                    </div>
                ) : (
                    filteredNotifications.map((notif, index) => {
                        const showDateGroup = index === 0 || filteredNotifications[index - 1].group_date !== notif.group_date;

                        return (
                            <motion.div 
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }} 
                                key={notif.id} 
                                className="w-full flex flex-col gap-4 shrink-0"
                            >
                                {showDateGroup && (
                                    <div className="w-full flex justify-center my-1">
                                        <span className="text-[12px] font-medium text-gray-400 select-none">
                                            {notif.group_date}
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
                                    <div className="w-[460] max-w-185 xl:max-w-none gap-6 auto-rows-fr">
                                        <NewsNotificationsCard
                                            notif={notif}
                                        />
                                    </div>
                                )}
                            </motion.div>
                        );
                    })
                )}
            </main>
        </div>
    );
}