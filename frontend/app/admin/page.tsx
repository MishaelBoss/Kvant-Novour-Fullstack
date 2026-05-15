import Admin from "./admin";

export const metadata = {
    title: 'Админ панель',
};

export default async function Page() {
    return (
        <>
        <Admin/>
        </>
    );
}