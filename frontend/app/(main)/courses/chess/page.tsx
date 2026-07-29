import { Header } from "@/app/components/Header";
import ChessContent from "./ChessContent";

export const metadata = {
    title: 'ОБ Chess',
};


export default function Page() {
    return (
        <>
            <Header/>
            <ChessContent/>
        </>
    )
};