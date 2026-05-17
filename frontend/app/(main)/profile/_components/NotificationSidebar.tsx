import React from "react";

interface ISidebarTab {
    id: 'system' | 'chat' | 'news';
    title: string;
    text: string;
    unread: number;
    bg: string;
    icon: React.ReactNode;
    date?: string;
}

interface INotificationSidebarProps {
    activeFilter: 'system' | 'chat' | 'news';
    setActiveFilter: (filter: 'system' | 'chat' | 'news') => void;
    sidebarTabs: ISidebarTab[];
    totalUnread: number;
    onMarkAllAsRead: () => void;
}

export function NotificationSidebar({
    activeFilter,
    setActiveFilter,
    sidebarTabs,
    totalUnread,
    onMarkAllAsRead
}: INotificationSidebarProps) {
    return (
        <aside className="w-[340px] border-r border-[#e2e8f0] flex flex-col shrink-0 bg-white h-full p-2">
             <div className="p-4 pb-2 flex items-center justify-between h-[44px]">
                <h1 className="text-[20px] font-bold text-[#111827]">Уведомления</h1>
                
                <button 
                    onClick={totalUnread > 0 ? onMarkAllAsRead : undefined} 
                    style={{ 
                        color: '#001a3466',
                    }}
                    className={`text-[12px] font-semibold p-1.5 rounded-full transition-all duration-200 flex items-center justify-center ${
                        totalUnread > 0 
                            ? 'hover:bg-[#001a3466] cursor-pointer opacity-100' 
                            : 'opacity-0 cursor-default pointer-events-none'
                    }`}
                    aria-label="Прочитать все"
                >
                    <svg xmlns="http://w3.org" width="24" height="24">
                        <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M10 5c-6 0-7 1.5-7 7.5 0 3 0 8.5 2 8.5 1.178 0 2.308-.975 3-2h6c6 0 7-.664 7-6.5 0-6-1-7.5-7-7.5zm5.707 5.707a1 1 0 0 0-1.414-1.414L11 12.586l-1.293-1.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0z"/>
                    </svg>
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-2 pt-1 pb-2 flex flex-col gap-1">
                {sidebarTabs.map((tab) => {
                    const isActive = activeFilter === tab.id;
                    return (
                        <div
                            key={tab.id}
                            onClick={() => setActiveFilter(tab.id)}
                            className={`flex gap-3.5 px-3 py-3 items-center transition-all cursor-pointer select-none relative rounded-2xl ${
                                isActive ? 'bg-[#f0f7ff]' : 'hover:bg-[#f8fafc]'
                            }`}
                        >
                            <div className={`w-[44px] h-[44px] rounded-[14px] flex items-center justify-center shrink-0 ${tab.bg}`}>
                                {tab.icon}
                            </div>

                            <div className="flex-1 min-w-0 flex flex-col justify-between h-[40px]">
                                <div className="flex items-center justify-between">
                                    <span className={`font-bold text-[14px] truncate leading-tight ${isActive ? 'text-[#005bff]' : 'text-[#111827]'}`}>
                                        {tab.title}
                                    </span>
                                    
                                    {tab.date && tab.date !== "" && (
                                        <span className="text-[11px] font-normal text-gray-400 shrink-0 select-none ml-2">
                                            {tab.date}
                                        </span>
                                    )}
                                </div>
                                <p className="text-[12px] text-gray-400 truncate leading-tight">
                                    {tab.text}
                                </p>
                            </div>

                            {tab.unread > 0 && (
                                <span 
                                    style={{
                                        backgroundColor: 'rgba(255, 121, 140, 0.078)',
                                        color: '#f91155'
                                    }}
                                    className="text-[10px] font-bold px-[8px] py-[2px] rounded-full min-w-[16px] text-center shrink-0 absolute right-3 bottom-3"
                                >
                                    {tab.unread}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </aside>
    );
}