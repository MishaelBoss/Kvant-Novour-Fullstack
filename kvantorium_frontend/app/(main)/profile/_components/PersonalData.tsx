import * as Separator from '@radix-ui/react-separator';
import { FormatPhoneNumber } from "@/app/utils/formatPhoneNumber";
import { User } from '@/app/types/user.interface';
import Link from 'next/link';
import { PAGES } from '@/app/config/page';

interface PersonalDataProps {
    user: User | null;
}

export function PersonalData({ user} : PersonalDataProps) {
    return (
        <main className="flex-1 bg-white rounded-[24px] p-6 md:p-10 shadow-sm border border-gray-200/50">
            <section className="mb-12 relative pl-[40px]">
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} className="left-[0px] absolute top-[0px]">
                    <path fill="currentColor" d="M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12c0-4.367 2.546-8.138 6.23-9.914a1 1 0 0 1 1.36.523c.293.72.69 1.566 1.362 2.235C10.592 5.48 11.525 6 13 6a1 1 0 1 1 0 2c-2.024 0-3.458-.743-4.459-1.74-.6-.596-1.028-1.268-1.34-1.875A9 9 0 1 0 12 3a1 1 0 1 1-.001-2m2.3 14.286a1 1 0 0 1 1.407 1.421C15.587 16.827 14.357 18 12 18s-3.587-1.173-3.707-1.293a1 1 0 0 1 1.407-1.42c.018.015.186.165.5.321.376.188.971.392 1.8.392s1.424-.204 1.8-.392c.175-.087.355-.188.5-.322M7 10a1 1 0 1 1 0 2 1 1 0 0 1 0-2m10 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                </svg>
                <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-bold text-gray-900">Учётные данные</h2>
                </div>
                <p className="text-sm text-gray-500 mb-8">
                    Вы можете менять свои личные данные и управлять безопасностью.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                    <DataBlock label="ФИО" value={`${user?.first_name} ${user?.last_name} ${user?.middle_name}`} />
                    <DataBlock label="Телефон" value={FormatPhoneNumber(user?.phone)} />
                    <DataBlock label="Логин" value={`${user?.username}`} />
                
                    <div>
                        <p className="text-[12px] text-gray-400 mb-1">Почта</p>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{user?.email || 'не указанно'}</span>
                        </div>
                    </div>
                </div>
                <Link href={PAGES.KVANTUMID()} className="mt-8 text-sm text-blue-600 font-medium hover:underline">
                    Изменить в Kvantum ID →
                </Link>
            </section>
            <Separator.Root className="h-[1px] bg-gray-100 my-10" />
            <section className="relative pl-[40px]">
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} className="left-[0px] absolute top-[0px]">
                    <path fill="currentColor" d="M16 2a7 7 0 0 1 7 7v3a7 7 0 0 1-6.203 6.955A1 1 0 0 1 16.5 19h-5.086l-3.707 3.707A1 1 0 0 1 6 22v-3.083A6 6 0 0 1 1 13V9a7 7 0 0 1 7-7zM8 4a5 5 0 0 0-5 5v4a4 4 0 0 0 4 4 1 1 0 0 1 1 1v1.586l2.3-2.3a1 1 0 0 1 .697-.286H16a5 5 0 0 0 5-5V9a5 5 0 0 0-5-5zm0 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2m4 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2m4 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                </svg>
                <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-bold text-gray-900">Публичные данные</h2>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                    Информация, которую вы укажете здесь, будет видна другим пользователям.
                </p>
                <DataBlock label="Имя" value={`${user?.first_name} ${user?.last_name ? user.last_name[0] + '.' : ''}`} />
            </section>
        </main>
    );
};

function DataBlock({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-[12px] text-gray-400 mb-1">{label}</p>
            <p className="text-sm font-medium text-gray-900">{value}</p>
        </div>
    );
}