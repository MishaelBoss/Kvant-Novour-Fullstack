import { Header } from "@/app/components/Header";
import PaidCourses from "./paid-courses";

export const metadata = {
    title: 'Платные курсы',
};

export default function Page(){
    return (
        <>
        <div className="bg-[#f2f5f9]">
            <Header/>
        </div>
        <PaidCourses/>
        </>
    );
}