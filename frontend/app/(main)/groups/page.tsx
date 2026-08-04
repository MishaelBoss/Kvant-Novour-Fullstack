import { Header } from "@/app/components/Header";
import GroupsContent from "./GroupsContent";

export const metadata = {
    title: 'Группы',
};

export default function GroupsPage() {
    return (
        <>
            <Header />
            <GroupsContent />
        </>
    );
}