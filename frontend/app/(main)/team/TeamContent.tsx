import { PERSONAL } from "@/app/data/personalData";
import { TeamCard } from "./_components/TeamCard";

export default function TeamContent() {
    return (
        <div className="w-full p-4 md:p-8">
            <main className="max-w-354 mx-auto space-y-10">
                <div className="mb-10">
                    <h1 className="text-[32px] font-bold text-gray-900 mb-3">
                        Наша команда
                    </h1>
                    <p className="text-[15px] text-gray-500 max-w-2xl">
                        Профессионалы своего дела, которые помогут вашему ребёнку раскрыть потенциал, 
                        освоить современные технологии и найти свой путь в мире инженерии и IT.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {PERSONAL.map(person => (
                        <TeamCard key={person.id} person={person} />
                    ))}
                </div>
            </main>
        </div>
    );
}