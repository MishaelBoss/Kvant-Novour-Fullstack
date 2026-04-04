import Image from "next/image";
import { Category } from "../types/category.interface";

interface Props {
    image?: string | File | null;
    title: string;
    content: string;
    categories?: Category[];
}

export function CartNews({image, title, content, categories}: Props){
    const truncateText = (text: string, limit = 150) => {
        return text.length > limit ? text.substring(0, limit) + "..." : text;
    };
    
    return (
        <>
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full border border-gray-100">
            <div className="h-48 relative overflow-hidden"> 
                {image && (
                    <Image 
                        src={image.toString()} 
                        alt={title} 
                        fill
                        className="object-cover"
                        priority/>
                )}

                <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
                    {categories?.map((item) => (
                        <span
                            key={item.id} 
                            className="badge-custom px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm border border-white/30">
                            {item.name}
                        </span>
                    ))}
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
            
            <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold mb-2 leading-tight text-[#2B2E33]">
                    {title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    {truncateText(content, 110)}
                </p>
                
                <div className="mt-auto">
                    <button className="w-full bg-[#106fff] hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all active:scale-[0.98] text-sm cursor-pointer">
                        Подробнее
                    </button>
                </div>
            </div>
        </div>
        </>
    );
}