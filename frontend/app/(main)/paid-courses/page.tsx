import { Header } from "@/app/components/Header";
import PaidCoursesContent from "./PaidCoursesContent";

export const metadata = {
    title: 'Платные курсы',
};

export default function Page(){
    return (
        <>
        <Header/>
        <PaidCoursesContent/>
        </>
    );
}