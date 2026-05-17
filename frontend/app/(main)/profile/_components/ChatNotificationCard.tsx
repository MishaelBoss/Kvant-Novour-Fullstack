import Image from "next/image";

interface IChatNotificationProps {
    notif: {
        id: number;
        senderName: string;
        avatarUrl: string;
        description: string;
        time: string;
        isRead: boolean;
    };
    onRead: (id: number) => void;
}

export function ChatNotificationCard({ notif, onRead }: IChatNotificationProps) {
    return (
        <div 
            onClick={() => onRead(notif.id)}
            className="flex items-end gap-2.5 max-w-2xl shrink-0 cursor-pointer self-start"
        >
            <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 shadow-sm border border-gray-200 bg-gray-100">
                <Image 
                    src={notif.avatarUrl || '/default-avatar.png'} 
                    alt={notif.senderName} 
                    fill 
                    className="object-cover" 
                />
            </div>

            <div className="flex flex-col bg-[#f0f2f5] px-4 py-2.5 rounded-[18px] rounded-bl-none relative">
                {!notif.isRead && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-600 rounded-full" />
                )}

                <span className="text-[13px] font-medium text-gray-500 leading-tight mb-1">
                    {notif.senderName}
                </span>

                <div className="relative pb-3 pr-4">
                    <p className="text-[14px] text-gray-900 leading-relaxed font-normal whitespace-pre-line">
                        {notif.description}
                    </p>
                    
                    <span className="absolute bottom-0 right-0 text-[11px] text-gray-400 font-medium select-none pl-1">
                        {notif.time}
                    </span>
                </div>
            </div>
        </div>
    );
}