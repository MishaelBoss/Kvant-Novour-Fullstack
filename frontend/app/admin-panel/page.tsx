import { Suspense } from "react";
import AdminContent from "./AdminContent";

export const metadata = {
    title: 'Админ панель',
};

export default async function Page() {
    return (
        <>
        <Suspense fallback={<div>Загрузка...</div>}>
            <AdminContent/>
        </Suspense>
        </>
    );
}