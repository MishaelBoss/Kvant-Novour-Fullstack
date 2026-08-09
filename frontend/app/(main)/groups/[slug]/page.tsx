import { Header } from "@/app/components/Header";
import GroupDetailContent from "./GroupDetailContent";

export const metadata = {
    title: 'Группа',
};

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function GroupDetailPage({ params }: Props) {
    const { slug } = await params;

    return (
        <>
            <Header />
            <GroupDetailContent slug={slug} />
        </>
    );
}
