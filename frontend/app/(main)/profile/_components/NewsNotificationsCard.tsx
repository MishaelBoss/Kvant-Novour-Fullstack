import Image from "next/image";
import Link from "next/link";

interface ISystemNotificationProps {
    notif: {
        id: number;
        image?: string;
        slug?: string;
        isQuiz?: boolean;
        title: string;
        description: string;
        time: string;
        isRead: boolean;
    };
}

export function NewsNotificationsCard({ notif }: ISystemNotificationProps){
    const truncateText = (text: string, limit = 150) => {
        return text.length > limit ? text.substring(0, limit) + "..." : text;
    };

    return (
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full border border-gray-100">
            <div className="h-48 relative overflow-hidden"> 
                {notif.image && (
                    <Image 
                        src={notif.image.toString()} 
                        alt={notif.title} 
                        fill
                        className="object-cover"/>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
            
            <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold mb-2 leading-tight text-[#2B2E33]">
                    {notif.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    {truncateText(notif.description, 110)}
                </p>
                
                <div className="mt-auto">
                    <Link 
                        href={notif.isQuiz ? `/kvanto_form/${notif.slug}` : `/news/${notif.slug}`}
                        className="block w-full text-center bg-[#106fff] hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all active:scale-[0.98] text-sm">
                        {notif.isQuiz ? 'Принять участие' : 'Подробнее'}
                    </Link>
                </div>
            </div>
        </div>
    );
}