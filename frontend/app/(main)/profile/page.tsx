import { Header } from "@/app/components/Header";
import ProfileContent from "./ProfileContent";
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
            <ProfileContent/>
        </Suspense>
        </>
    );
}