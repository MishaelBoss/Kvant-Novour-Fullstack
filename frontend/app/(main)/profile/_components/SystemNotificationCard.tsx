import { PAGES } from "@/app/config/pages.config";

interface ISystemNotificationProps {
    notif: {
        id: number;
        title: string;
        description: string;
        time: string;
        isRead: boolean;
    };
}

export function SystemNotificationCard({ notif }: ISystemNotificationProps) {
    return (
        <div 
            onClick={() => window.open(PAGES.KVANTUMID(), '_blank', 'noopener,noreferrer')}
            className={`w-full bg-white px-4 py-3 rounded-[16px] flex flex-col relative transition-all border border-gray-100 shadow-sm cursor-pointer shrink-0 ${
                !notif.isRead ? 'ring-1 ring-blue-300' : ''
            }`}
        >
            {!notif.isRead && (
                <span className="absolute top-3.5 right-4 w-2 h-2 bg-blue-600 rounded-full shadow-[0_0_6px_#2563eb]" />
            )}

            <h1 className="text-[14px] font-bold text-gray-900 leading-tight mb-1">
                {notif.title}
            </h1>
            
            <div className="relative pb-3">
                <p className="text-[14px] text-gray-800 leading-relaxed font-normal whitespace-pre-line tracking-wide">
                    {notif.description}
                </p>

                <span className="absolute bottom-0 right-0 text-[11px] text-gray-400 font-medium select-none pl-1">
                    {notif.time}
                </span>
            </div>
        </div>
    );
}