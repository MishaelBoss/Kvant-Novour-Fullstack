'use client'
import { getPublicProfile } from "@/app/lib/api";
import { IPublicProfileData } from "@/app/types/profile.interface";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function ProfileContent(){
    const { username } = useParams();
    const [profile, setProfile] = useState<IPublicProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getProfile = useCallback(async () => {
        if(!username) return;

        getPublicProfile(username as string)
            .then(data => {
                setProfile(data); 
                setError(null);
            }).catch(() => {
                setError("Пользователь не найден");
            }).finally(() => {
                setLoading(false);
            });
    }, [username]);

    useEffect(() => {
        const handleFetchEvent = async() => await getProfile();

        handleFetchEvent();
    }, [getProfile]);

    if (loading) {
        return (
            <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg)' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 40, marginBottom: 12, animation: 'spin 1s linear infinite' }}>⚙️</div>
                        <p style={{ color: 'rgba(0,0,0,0.5)' }}>Загрузка профиля...</p>
                    </div>
                    <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
                </div>
            </>
        );
    }

    if (error || !profile) {
        return (
            <>
                <div style={{ textAlign: 'center', marginTop: 80, color: 'rgba(0,0,0,0.5)' }}>
                    <h2>Пользователь не найден</h2>
                </div>
            </>
        )
    };

    return (
        <>
        </>
    ); 
}