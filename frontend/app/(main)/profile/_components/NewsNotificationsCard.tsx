import { INews } from "@/app/types/news.interface";
import Image from "next/image";
import Link from "next/link";

interface ISystemNotificationProps {
    notif: {
        id: number;
        title: string;
        description: string;
        time: string;
        isRead: boolean;
        news: INews;
    };
}

export function NewsNotificationsCard({ notif }: ISystemNotificationProps){
    const truncateText = (text: string, limit = 150) => {
        return text.length > limit ? text.substring(0, limit) + "..." : text;
    };

    return (
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full border border-gray-100">
            <div className="h-48 relative overflow-hidden"> 
                {notif.news.image && (
                    <Image 
                        src={notif.news.image.toString().replace("http://localhost", "")} 
                        alt={notif.title} 
                        fill
                        loading="eager"
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
                        href={`/kvanto_form/${notif.news.form_slug}`}
                        className="block w-full text-center bg-[#106fff] hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all active:scale-[0.98] text-sm">
                        Принять участие
                    </Link>
                </div>
            </div>
        </div>
    );
}