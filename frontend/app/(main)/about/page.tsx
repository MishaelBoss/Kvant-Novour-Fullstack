import { Header } from "@/app/components/Header";
import { AboutContent } from "./AboutContent";

export const metadata = {
    title: 'О нас',
};

export default function Page() {
    return (
        <>
            <Header/>
            <AboutContent/>
        </>
    );
}