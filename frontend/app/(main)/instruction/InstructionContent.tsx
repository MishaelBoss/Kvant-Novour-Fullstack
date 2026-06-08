"use client";

import { useState } from "react";
import { ChevronRight, Phone, Laptop, FileText, CheckCircle2, Clock3, MapPin, MoveUpRight, Lightbulb, File } from "lucide-react";
import Link from "next/link";

const STEPS = [
    {
        id: 1,
        title: "Выбор способа",
        icon: Laptop,
        description: "Определитесь, как вам удобнее подать заявление: онлайн (Госуслуги / Навигатор) или прийти лично на СЮТ."
    },
    {
        id: 2,
        title: "Подача заявки онлайн",
        icon: ChevronRight,
        description: "Зайдите на Госуслуги (вкладка «Образование дети» → Запись в кружки) или на портал р66.навигатор.дети. В поиске выберите учреждение МАУ ДО «СЮТ» и нужное направление Кванториума."
    },
    {
        id: 3,
        title: "Подготовка документов",
        icon: FileText,
        description: "Скачайте бланки заявлений с сайта СЮТ. Вам понадобятся: ваш паспорт, СНИЛС ребенка, свидетельство о рождении (или паспорт ребенка) и номер сертификата ПФДО."
    },
    {
        id: 4,
        title: "Финальное зачисление",
        icon: CheckCircle2,
        description: "Принесите заполненные документы в МАУ ДО «СЮТ» (ул. Комсомольская 21, кабинет 107). После проверки документов ребенок будет официально зачислен!"
    }
];

export default function InstructionContent() {
    const [activeStep, setActiveStep] = useState(1);

    return (
        <div className="bg-[#f2f5f9] min-h-screen py-10 font-sans">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-10 space-y-2">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Пошаговая инструкция по записи в Кванториум
                    </h1>
                    <p className="text-gray-500 text-sm max-w-xl mx-auto">
                        Собрали всю актуальную информацию по приёму на 2026 учебный год в одном месте.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
                    {STEPS.map((step) => {
                        const Icon = step.icon;
                        const isActive = activeStep === step.id;

                        return (
                            <button
                                key={step.id}
                                onClick={() => setActiveStep(step.id)}
                                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center md:flex-col md:items-start gap-3 md:gap-4 ${
                                isActive 
                                    ? "bg-[#005bff] text-white border-[#005bff] shadow-md shadow-blue-100" 
                                    : "bg-white text-gray-700 border-gray-100 hover:border-gray-300"
                                }`}
                            >
                                <div className={`p-2 rounded-xl ${isActive ? "bg-white/20 text-white" : "bg-blue-50 text-[#005bff]"}`}>
                                    <Icon size={20} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider block ${isActive ? "text-blue-200" : "text-gray-400"}`}>
                                        Шаг 0{step.id}
                                    </span>
                                    <h3 className="font-bold text-sm leading-tight">{step.title}</h3>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
                    <div className="space-y-3">
                        <span className="inline-block bg-blue-50 text-[#005bff] font-bold text-xs px-3 py-1 rounded-full">
                        Текущий этап: Шаг {activeStep} из 4
                        </span>
                        <p className="text-gray-700 text-base leading-relaxed">
                            {STEPS[activeStep - 1].description}
                        </p>
                    </div>

                    {activeStep === 2 && (
                        <div className="flex flex-wrap gap-3 pt-2">
                            <Link href="https://xn--66-kmc.xn--80aafey1amqq.xn--d1acj3b/" target="_blank" className="inline-flex items-center gap-1 bg-[#f91155] text-white font-bold text-xs px-5 py-3 rounded-xl hover:bg-[#d60e47] transition-colors">
                                Открыть Навигатор ДОД <MoveUpRight size={12} strokeWidth={3} />
                            </Link>

                            <Link href="https://gosuslugi.ru" target="_blank" className="inline-flex items-center gap-1 bg-blue-600 text-white font-bold text-xs px-5 py-3 rounded-xl hover:bg-blue-700 transition-colors">
                                Открыть Госуслуги <MoveUpRight size={12} strokeWidth={3} />
                            </Link>
                        </div>
                    )}

                    {activeStep === 3 && (
                        <div className="space-y-4 animate-fadeIn">
                            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-xs text-amber-900 space-y-2">
                                <span className="font-bold text-sm inline-flex items-center gap-1"><File size={15} /> Какие именно бланки нужно искать и заполнить?</span>
                                <p className="text-gray-600 mb-2">
                                    Когда вы перейдете на сайт СЮТ, в результатах поиска откройте актуальную статью о приёме (например, «Приём учащихся на новый учебный год»). Внутри неё будут прикреплены следующие документы для скачивания:
                                </p>
                            
                                <ul className="space-y-2 text-gray-700 bg-white p-3 rounded-xl border border-amber-200/60 list-none font-medium">
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                                        Заявление на зачисление от имени родителя (законного представителя)
                                        </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                                        Согласие на обработку персональных данных ребенка и родителя
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                                        Заявление на учет сертификата дополнительного образования (ПФДО)
                                    </li>
                                </ul>
                            
                                <div className="pt-2 text-[11px] text-amber-800 italic flex items-start gap-1.5">
                                    <Lightbulb 
                                        size={15} 
                                        strokeWidth={2.5}
                                        className="shrink-0 mt-0.5 text-amber-600"
                                    />
                                    <span>
                                        <strong>Совет:</strong> Если у вас нет принтера, чтобы распечатать бланки дома, не переживайте! Вы можете прийти в 107 кабинет СЮТ, и вам выдадут чистые бумажные бланки на месте.
                                    </span>
                                </div>
                            </div>

                            <div className="pt-2">
                                <Link 
                                    href="http://sut.nov.ru/index.php/kvantoriumabout/priem-obuchaushcihsya-kvantorium/itemlist/search.html?searchword=%D0%9D%D0%B0%D0%B2%D0%B8%D0%B3%D0%B0%D1%82%D0%BE%D1%80&categories=" 
                                    target="_blank" 
                                    className="inline-block bg-[#005bff] hover:bg-[#004ae6] text-white font-bold text-xs px-5 py-3 rounded-xl transition-colors shadow-sm"
                                >
                                    Открыть страницу с бланками на СЮТ ↗
                                </Link>
                            </div>
                        </div>
                    )}

                    {activeStep === 4 && (
                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-3 text-xs text-gray-600">
                            <span className="font-bold text-gray-900 block">Контакты и график работы приемной:</span>
                            <p className="inline-flex items-center gap-1">
                                <MapPin size={15}/> 
                                г. Новоуральск, ул. Комсомольская 21, кабинет 107 (МАУ ДО "СЮТ")
                            </p>
                            <p className="inline-flex items-center gap-1">
                                <Clock3 size={15} />
                                Понедельник – Пятница: с 8:30 до 17:00 (Перерыв на обед: 12:00 – 12:48)
                            </p>
                            <div className="pt-2 border-t border-gray-200 flex flex-wrap gap-4 text-gray-900 font-semibold">
                                <span className="inline-flex items-center gap-1"><Phone size={14} strokeWidth={2.5} className="text-gray-400" /> Кванториум: 3-82-65</span>
                                <span className="inline-flex items-center gap-1"><Phone size={14} strokeWidth={2.5} className="text-gray-400" /> Приемная СЮТ: 3-92-31</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}