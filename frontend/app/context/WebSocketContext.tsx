"use client";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthContext';

export interface LiveNotification {
    id: number | null;
    type: string;
    title: string;
    description: string;
    isRead: boolean;
    time: string;
}

interface WebSocketContextType {
    isConnected: boolean;
    liveNotifications: LiveNotification[];
}

const WebSocketContext = createContext<WebSocketContextType>({ isConnected: false, liveNotifications: [] });

const RECONNECT_DELAY = 3000;
const MAX_RECONNECT_DELAY = 30000;

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
    const { user, setCountNotifications } = useAuth();
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
    const reconnectDelay = useRef(RECONNECT_DELAY);
    const mountedRef = useRef(true);
    const [isConnected, setIsConnected] = useState(false);
    const [liveNotifications, setLiveNotifications] = useState<LiveNotification[]>([]);

    useEffect(() => {
        if (!user) return;

        mountedRef.current = true;

        const connect = () => {
            if (reconnectTimer.current) clearTimeout(reconnectTimer.current);

            const wsBase = process.env.NEXT_PUBLIC_WS_URL || `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`;
            const url = wsBase.endsWith('/') ? `${wsBase}ws/notifications/` : `${wsBase}/ws/notifications/`;

            const ws = new WebSocket(url);
            wsRef.current = ws;

            ws.onopen = () => {
                if (!mountedRef.current) return;
                setIsConnected(true);
                reconnectDelay.current = RECONNECT_DELAY;
            };

            ws.onmessage = (event) => {
                if (!mountedRef.current) return;
                try {
                    const data = JSON.parse(event.data);
                    if (data && typeof data === 'object' && 'id' in data) {
                        setCountNotifications((prev: number) => prev + 1);
                        setLiveNotifications(prev => {
                            if (prev.some(n => n.id === data.id && n.id != null)) return prev;
                            const now = new Date();
                            const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                            const entry: LiveNotification = {
                                id: data.id,
                                type: data.type || 'system',
                                title: data.title || '',
                                description: data.description || '',
                                isRead: data.is_read ?? data.isRead ?? false,
                                time: timeStr,
                            };
                            return [entry, ...prev].slice(0, 20);
                        });
                    }
                } catch (error) {
                    if (process.env.NODE_ENV !== 'production') console.error('WS JSON Error:', error, 'Raw data:', event.data);
                }
            };

            ws.onclose = () => {
                if (!mountedRef.current) return;
                setIsConnected(false);
                wsRef.current = null;
                if (!user) return;
                reconnectTimer.current = setTimeout(connect, reconnectDelay.current);
                reconnectDelay.current = Math.min(reconnectDelay.current * 1.5, MAX_RECONNECT_DELAY);
            };

            ws.onerror = () => {
                ws.close();
            };
        };

        connect();

        return () => {
            mountedRef.current = false;
            clearTimeout(reconnectTimer.current);
            wsRef.current?.close();
            wsRef.current = null;
        };
    }, [user?.id, setCountNotifications]);

    return (
        <WebSocketContext.Provider value={{ isConnected, liveNotifications }}>
            {children}
        </WebSocketContext.Provider>
    );
}

export const useWebSocket = () => useContext(WebSocketContext);
