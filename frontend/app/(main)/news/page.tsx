import { Header } from "@/app/components/Header";
import News from "./news";

export const metadata = {
    title: 'Новости',
};

export default function Page() {
    return (
        <>
        <div className="bg-[#f2f5f9]">
            <Header/>
        </div>
        <News/>
        </>
    );
};