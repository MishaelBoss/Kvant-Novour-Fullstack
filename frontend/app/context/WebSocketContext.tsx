"use client";
import { createContext, useContext, useEffect, useRef, useCallback, useState } from 'react';
import { useAuth } from './AuthContext';

interface WebSocketContextType {
    isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType>({ isConnected: false });

const RECONNECT_DELAY = 3000;
const MAX_RECONNECT_DELAY = 30000;

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
    const { user, setCountNotifications } = useAuth();
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
    const reconnectDelay = useRef(RECONNECT_DELAY);
    const mountedRef = useRef(true);
    const userRef = useRef(user);
    const [isConnected, setIsConnected] = useState(false);

    const connectRef = useRef<() => void>(() => {});

    useEffect(() => {
        userRef.current = user;
    }, [user]);

    const connect = useCallback(() => {
        if (!userRef.current) return;

        if (reconnectTimer.current) clearTimeout(reconnectTimer.current);

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        const url = `${protocol}//${host}/ws/notifications/`;

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
                }
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') console.error('WS JSON Error:', error, 'Raw data:', event.data);
            }
        };

        ws.onclose = () => {
            if (!mountedRef.current) return;
            setIsConnected(false);
            wsRef.current = null;
            if (!userRef.current) return;
            reconnectTimer.current = setTimeout(() => {
                if (mountedRef.current && userRef.current) {
                    connectRef.current();
                }
            }, reconnectDelay.current);
            reconnectDelay.current = Math.min(reconnectDelay.current * 1.5, MAX_RECONNECT_DELAY);
        };

        ws.onerror = () => {
            ws.close();
        };
    }, [setCountNotifications]);

    useEffect(() => {
        connectRef.current = connect;
    }, [connect]);

    useEffect(() => {
        mountedRef.current = true;
        if (user) {
            connect();
        }
        return () => {
            mountedRef.current = false;
            clearTimeout(reconnectTimer.current);
            wsRef.current?.close();
            wsRef.current = null;
        };
    }, [user, connect]);

    return (
        <WebSocketContext.Provider value={{ isConnected }}>
            {children}
        </WebSocketContext.Provider>
    );
}

export const useWebSocket = () => useContext(WebSocketContext);
