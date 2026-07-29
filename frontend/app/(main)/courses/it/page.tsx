import { Header } from "@/app/components/Header";
import ItContent from "./ItContent";

export const metadata = {
    title: 'ОБ It',
};


export default function Page() {
    return (
        <>
            <Header/>
            <ItContent/>
        </>
    )
};