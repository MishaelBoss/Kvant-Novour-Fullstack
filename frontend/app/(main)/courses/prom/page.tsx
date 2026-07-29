import { Header } from "@/app/components/Header";
import PromContent from "./PromContent";

export const metadata = {
    title: 'ОБ Prom',
};


export default function Page() {
    return (
        <>
            <Header/>
            <PromContent/>
        </>
    )
};