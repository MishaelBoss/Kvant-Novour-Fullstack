import { Header } from "@/app/components/Header";
import TeamContent from "./TeamContent";

export const metadata = {
    title: 'Наш персонал',
};

export default function TeamPage() {
    return (
        <>
            <Header />
            <TeamContent/>
        </>
    );
}
