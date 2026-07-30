import { INews } from "./news.interface";

export type NotificationsType = 'system' | 'chat' | 'news';

export interface INotifications {
    id: number;
    type: NotificationsType;
    title: string;
    description: string;
    is_read: boolean;
    news: INews;
    created_at: string; 
    time: string;
    sender_name: string | null; 
    avatar_url: string | null;
    group_date: string | null; 
}

export interface INotificationsResponse {
    results: INotifications[];
    latest_dates?: any;
}