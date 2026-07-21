"use client";

import Link from "next/link";
import { PAGES } from "@/app/config/pages.config";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { QUANTUMS } from "@/app/data/quantumsData";
import { motion } from "framer-motion"

const containerVariants = {
    initial: { opacity: 0},
    enter: { 
        opacity: 1, 
        x: 0, 
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        } 
    },
    exit: {
        opacity: 0,
        transition: { 
            staggerChildren: 0.05,
            delayChildren: -1,
        },
        x: 10
    },
};

const cardVariants = {
    initial: { opacity: 0, y: 20},
    enter: { 
        opacity: 1, 
        y: 0, 
        transition: { duration: 0.4, ease: 'easeOut' as const },
    },
    exit: {
        opacity: 0,
        y: 20,
        transition: { duration: 0.2 },
    },
};

export default function QuantumsContent() {
    return (
        <>
        <div className="w-full p-4 md:p-8 font-sans">
            <main className="max-w-354 mx-auto space-y-10">
                <div className="space-y-2">
                    <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-950">
                        Направления обучения
                    </h1>

                    <p className="text-gray-500 text-sm max-w-2xl">
                        Выберите квантум по интересам ребенка. На всех бюджетных направлениях доступна запись по сертификатам ПФДО.
                    </p>
                </div>

                <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" variants={containerVariants} initial="initial" animate="enter" exit="exit">
                    {QUANTUMS.map((quant) => {
                        return (
                        <motion.div 
                            key={quant.id} 
                            variants={cardVariants}
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

                                        <span className="text-[11px] font-semibold text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
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
                                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block">
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
                        </motion.div>
                        );
                    })}
                </motion.div>
            </main>
        </div>
        </>
    );
}