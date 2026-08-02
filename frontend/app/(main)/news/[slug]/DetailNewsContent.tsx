"use client";
import { useCallback, useEffect, useState } from "react"
import { viewNews as newsNewsApi } from "@/app/lib/api";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import { IApiError } from "@/app/types/api-error.interface";

export function DetailNewsContent() {
    const params = useParams();
    const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

    const [loading, setLoading] = useState(true);

    const handleViewNews = useCallback(async () => {
        if (!slug || slug === "undefined") return;

        setLoading(true);

        try{
            await newsNewsApi(slug as string);
        } catch (error) {
            const hasApiMarker = error !== null && typeof error === 'object' && 'isApiError' in error;
            
            if (hasApiMarker) {
                const apiError = error as IApiError;
                
                toast.error(apiError.message);
            } else toast.error("Произошла непредвиденная ошибка на клиенте");
            
            console.error("Ошибка", error);
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        const init = async () => await handleViewNews();
        if (slug && slug !== "undefined") {
            const timer = setTimeout(() => init(), 5000);
            return () => clearTimeout(timer);
        }
    }, [slug, handleViewNews]);

    if (loading) {
        return <div>Загрузка...</div>; 
    }

    return (
        <>
        </>
    )
}