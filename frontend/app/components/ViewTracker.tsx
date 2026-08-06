"use client";
import { useEffect } from "react";
import { viewNews, viewForm } from "@/app/lib/api";

type ViewKind = "news" | "form";

interface Props {
    slug: string;
    kind?: ViewKind;
    delay?: number;
    onTracked?: (data: unknown) => void;
}

const sentViews = new Set<string>();

export function trackView(slug: string, kind: ViewKind = "news"): Promise<unknown> {
    if (!slug || typeof slug !== "string" || slug === "undefined") {
        return Promise.resolve(undefined);
    }

    const key = `${kind}:${slug}`;
    if (sentViews.has(key)) return Promise.resolve(undefined);
    sentViews.add(key);

    const request = kind === "form" ? viewForm(slug) : viewNews(slug);

    return request.catch(() => {
        // tracking is best-effort and must never interrupt the page
        return undefined;
    });
}

export function ViewTracker({ slug, kind = "news", delay = 3000, onTracked }: Props) {
    useEffect(() => {
        const allowed = slug && typeof slug === "string" && slug !== "undefined";
        if (!allowed) return;

        const timer = setTimeout(() => {
            trackView(slug, kind).then((data) => {
                if (onTracked && data !== undefined) onTracked(data);
            });
        }, delay);

        return () => clearTimeout(timer);
    }, [slug, kind, delay, onTracked]);

    return null;
}