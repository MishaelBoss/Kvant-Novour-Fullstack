import Image from "next/image";
import { useState } from "react";

export function Achievements() {
    const [achievements, setAchievements] = useState<[]>([]);

    if (achievements.length === 0) {
        return (
            <main className="flex-1 bg-white rounded-[24px] p-6 md:p-10 shadow-sm border border-gray-200/50">
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4 text-center">
                    <Image src="/Achievement-rafiki.svg" alt="Achievement" width={300} height={300} loading="eager"/>

                    <div className="flex flex-col gap-1">
                        <p className="text-base font-semibold text-gray-800">В списке ещё нет достижений</p>
                        <p className="text-sm text-gray-500 max-w-xs">
                            Достяжения сами появятся автоматически, когда вы будете их зарабатывать. Просто продолжайте использовать сайт и достигать новых высот!
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1 bg-white rounded-[24px] p-6 md:p-10 shadow-sm border border-gray-200/50">
            <>
            </>
        </main>
    );
};