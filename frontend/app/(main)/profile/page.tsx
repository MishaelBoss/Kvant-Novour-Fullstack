import { Header } from "@/app/components/Header";
import MyProfile from "./profile";
import { Suspense } from "react";
import { Skeleton } from "@radix-ui/themes";

export const metadata = {
    title: 'Мой профиль',
};

export default function Page() {
    return (
        <>
        <Header/>
        <Suspense fallback={<div className="p-8"><Skeleton /></div>}>
            <MyProfile/>
        </Suspense>
        </>
    );
}