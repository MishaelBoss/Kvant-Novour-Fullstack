import { Header } from "@/app/components/Header";
import Quants from "./quants";

export const metadata = {
    title: 'Квантумы',
};

export default function Page(){
    return (
        <>
        <div className="bg-[#f2f5f9]">
            <Header/>
        </div>
        <Quants/>
        </>
    );
}