import { Suspense } from "react";
import Admin from "./admin";

export const metadata = {
    title: 'Админ панель',
};

export default async function Page() {
    return (
        <>
        <Suspense fallback={<div>Загрузка...</div>}>
            <Admin />
        </Suspense>
        </>
    );
}