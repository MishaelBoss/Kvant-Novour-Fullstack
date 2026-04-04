import { User } from '@/app/types/user.interface';

interface AchievementsProps {
    user: User | null;
}

export function Achievements({ user} : AchievementsProps) {
    return (
        <main className="flex-1 bg-white rounded-[24px] p-6 md:p-10 shadow-sm border border-gray-200/50">
            <h1>Пока не доступно</h1>
        </main>
    );
};