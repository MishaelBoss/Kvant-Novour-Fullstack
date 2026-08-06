"use client";
import { useCallback, useEffect, useState } from "react";
import { ViewTracker } from "@/app/components/ViewTracker";
import { getListNews } from "@/app/lib/api";
import { IApiError } from "@/app/types/api-error.interface";
import { INews } from "@/app/types/news.interface";
import Image from "next/image";
import { useParams } from "next/navigation";
import { EyeIcon } from "lucide-react";
import toast from "react-hot-toast";

export function DetailNewsContent() {
    const params = useParams();
    const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

    const [news, setNews] = useState<INews | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleTracked = useCallback((data: unknown) => {
        const raw = data as { views?: number; is_viewed?: boolean };
        setNews(prev => prev ? {
            ...prev,
            views: typeof raw?.views === 'number' ? raw.views : prev.views,
            is_viewed: typeof raw?.is_viewed === 'boolean' ? raw.is_viewed : prev.is_viewed,
        } : prev);
    }, []);

    const fetchNews = useCallback(async () => {
        if (!slug || slug === "undefined") return;

        try {
            const res = await getListNews();
            const item = res.results.find((n) => n.slug === slug) ?? null;
            setNews(item);
            if (!item) setError("Новость не найдена");
        } catch (error) {
            const hasApiMarker = error !== null && typeof error === 'object' && 'isApiError' in error;

            if (hasApiMarker) {
                const apiError = error as IApiError;
                setError(apiError.message);
                toast.error(apiError.message);
            } else {
                setError("Произошла непредвиденная ошибка на клиенте");
                toast.error("Произошла непредвиденная ошибка на клиенте");
            }

            console.error("Ошибка", error);
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        const init = async() => await fetchNews();
        if (slug && slug !== "undefined") init();
    }, [slug, fetchNews]);

    if (loading) {
        return <div className="w-full p-4 md:p-8 text-gray-400">Загрузка...</div>;
    }

    if (error || !news) {
        return (
            <div className="w-full p-4 md:p-8 text-center py-16">
                <p className="text-gray-500">{error ?? "Новость не найдена"}</p>
            </div>
        );
    }

    const imageUrl = news.image?.toString().replace('http://localhost', '');

    return (
        <>
            <ViewTracker slug={typeof slug === 'string' ? slug : ''} kind="news" delay={5000} onTracked={handleTracked} />

            <div className="w-full p-4 md:p-8">
                <article className="max-w-300 mx-auto bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                    {imageUrl && (
                        <div className="relative h-72 md:h-96 w-full">
                            <Image
                                src={imageUrl}
                                alt={news.title}
                                fill
                                priority
                                className="object-cover"
                            />
                        </div>
                    )}

                    <div className="p-6 md:p-10">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                <EyeIcon size={14} />
                                {news.views} просмотров
                            </span>
                        </div>

                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{news.title}</h1>
                        <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {news.content}
                        </div>
                    </div>
                </article>
            </div>
        </>
    );
}