"use client";

import Link from "next/link";
import { PAGES } from "@/app/config/pages.config";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const QUANTUMS = [
    {
        id: 1,
        title: "IT-квантум",
        desc: "Изучение Python, веб-разработка, основы искусственного интеллекта и создание приложений. Базовая площадка для будущих софт-инженеров.",
        age: "12-17 лет",
        type: "Бюджет",
        icon: '/it-quantum-icon.png',
        badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
        skills: ["Программирование на Python", "Создание сайтов", "Алгоритмы и логика"]
    },
    {
        id: 2,
        title: "Промробоквантум",
        desc: "Проектирование и программирование роботизированных систем. Дети изучают мехатронику, работают с микроконтроллерами и собирают умные устройства.",
        age: "12-17 лет",
        type: "Бюджет",
        icon: '/promrobokvantum-icon.png',
        badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
        skills: ["Сборка роботов", "Датчики и контроллеры", "Автоматизация процессов"]
    },
    {
        id: 3,
        title: "VR/AR-квантум",
        desc: "Разработка интерактивных виртуальных миров, симуляторов и приложений дополненной реальности. Погружение в 3D-моделирование и движки.",
        age: "11-17 лет",
        type: "Бюджет",
        icon: '/vr-ar-quantum-icon.png',
        badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
        skills: ["3D-моделирование", "Разработка в Unity", "Создание виртуальных миров"]
    },
    {
        id: 4,
        title: "Хайтек",
        desc: "Сердце технопарка. Высокотехнологичная лаборатория прототипирования: работа на лазерных станках, 3D-печать, слайсинг и основы инженерии.",
        age: "11-17 лет",
        type: "Бюджет",
        icon: '/hi-tech-icon.png',
        badgeColor: "bg-amber-100 text-amber-700 border-amber-200",
        skills: ["Работа на лазерных станках", "3D-печать и слайсинг", "Схемотехника и пайка"]
    },
    {
        id: 5,
        title: "Математика",
        desc: "Развитие нестандартного мышления, логики и пространственного воображения. Фундаментальный базис для решения сложных прикладных инженерных задач.",
        age: "11-17 лет",
        type: "Бюджет",
        icon: '/mathematics.png',
        badgeColor: "bg-cyan-100 text-cyan-700 border-cyan-200",
        skills: ["Логическое мышление", "Прикладные задачи", "Развитие интеллекта"]
    },
    {
        id: 6,
        title: "Квантошахматы",
        desc: "Изучение шахматной теории, тактики и стратегии. Развитие концентрации внимания, умения просчитывать ходы и системного мышления.",
        age: "11-17 лет",
        type: "Бюджет",
        icon: '/chess.png',
        badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
        skills: ["Тактика и стратегия", "Анализ партий и позиций", "Участие в турнирах"]
    },
    {
        id: 7,
        title: "Технический английский",
        desc: "Изучение профильного английского языка для инженеров и IT-специалистов. Разбор технической документации, терминологии кода и подготовка к защите проектов.",
        age: "11-17 лет",
        type: "Бюджет",
        icon: '/english.png',
        badgeColor: "bg-indigo-100 text-indigo-700 border-indigo-200",
        skills: ["Чтение IT-документации", "Профильный вокабуляр", "Презентация проектов"]
    }
];

export default function QuantumsContent() {
    return (
        <>
        <div className="bg-[#f2f5f9] min-h-screen pb-20 font-sans">
            <main className="max-w-350 mx-auto px-4 mt-6 space-y-10">
                <div className="space-y-2">
                    <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-950">
                        Направления обучения
                    </h1>

                    <p className="text-gray-500 text-sm max-w-2xl">
                        Выберите квантум по интересам ребенка. На всех бюджетных направлениях доступна запись по сертификатам ПФДО.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {QUANTUMS.map((quant) => {
                        return (
                        <div 
                            key={quant.id} 
                            className="bg-white rounded-3xl border border-gray-100 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group"
                        >
                            <div>
                                <div className="flex items-start justify-between mb-6">
                                    <div className={`p-4 rounded-2xl ${quant.badgeColor} bg-opacity-40 group-hover:scale-105 transition-transform`}>
                                        <Image src={quant.icon} alt={`${quant.title} icon`} width={32} height={32} className="w-8 h-8" />
                                    </div>
                                    <div className="flex flex-col items-end gap-1.5">
                                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${quant.badgeColor}`}>
                                            {quant.type}
                                        </span>

                                        <span className="text-[11px] font-semibold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                                            {quant.age}
                                        </span>
                                    </div>
                                </div>

                                <h2 className="font-extrabold text-gray-900 text-xl mb-3 group-hover:text-[#005bff] transition-colors">
                                    {quant.title}
                                </h2>
                                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                    {quant.desc}
                                </p>

                                <div className="space-y-2 pt-4 border-t border-gray-50 mb-8">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                                        Чему научится ребенок:
                                    </span>
                                    <div className="flex flex-col gap-1.5">
                                        {quant.skills.map((skill, index) => (
                                            <div key={index} className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                                                <div className="w-1.5 h-1.5 bg-[#005bff] rounded-full shrink-0" />
                                                <span>{skill}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <Link 
                                href={PAGES.INSTRUCTION()} 
                                className="w-full bg-[#005bff] hover:bg-[#004ae6] text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-[0.98]"
                            >
                                Записаться на курс <ArrowRight size={14} strokeWidth={2.5} />
                            </Link>
                        </div>
                        );
                    })}
                </div>
            </main>
        </div>
        </>
    );
}