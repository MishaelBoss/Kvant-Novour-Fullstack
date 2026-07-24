import { Header } from "@/app/components/Header";
import QuantumsContent from "./QuantumsContent";

export const metadata = {
    title: 'Квантумы',
};

export default function Page(){
    return (
        <>
        <Header/>
        <QuantumsContent/>
        </>
    );
}