import { getCurrentUser } from "../lib/auth";
import Admin from "./admin";
import { redirect } from "next/navigation";

export const metadata = {
    title: 'Админ панель',
};

export default async function Page() {
    const user = await getCurrentUser();

    if (!user || user?.role?.toLowerCase() !== 'admin') {
        redirect('/');
    }

    return (
        <>
        <Admin currentUser={user}/>
        </>
    );
}