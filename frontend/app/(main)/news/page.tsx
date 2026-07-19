import { Header } from "@/app/components/Header";
import NewsContent from "./NewsContent";

export const metadata = {
    title: 'Новости',
};

export default function NewsPage() {
    return (
        <>
        <Header/>
        <NewsContent/>
        </>
    );
};