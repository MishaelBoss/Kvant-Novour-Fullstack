import { Header } from "@/app/components/Header";
import MyProfile from "./profile";

export const metadata = {
    title: 'Мой профиль',
};

export default function Page() {
    return (
        <>
        <div className="bg-[#f2f5f9]">
            <Header/>
        </div>
        <MyProfile/>
        </>
    );
}