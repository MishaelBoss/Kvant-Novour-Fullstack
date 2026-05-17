export type NotificationsType = 'system' | 'chat' | 'news';

export interface INotifications {
    id: number;
    type: NotificationsType;
    senderName: string;
    avatarUrl: string;
    title: string;
    description: string;
    groupDate: string; 
    time: string;
    isRead: boolean;
}