"use client";

import Link from "next/link";
import { Header } from "../components/Header";
import { ArrowRight, Sparkles, GraduationCap, Phone, MoveUpRight } from "lucide-react";
import Image from "next/image";
import { PAGES } from "../config/pages.config";
import { QUANTUMS } from "../data/quantumsData";
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

export default function Home() {
  return (
    <>
      <Header />
      <div className="w-full p-4 pb-16">
        <main className="max-w-354 mx-auto space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-linear-to-r from-[#005bff] to-[#003cb3] rounded-3xl p-8 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden min-h-80 shadow-sm">
              <div className="absolute right-0 bottom-0 w-1/3 h-full opacity-10 pointer-events-none flex items-end justify-end p-4">
                <GraduationCap className="w-32 h-32" />
              </div>
              <div className="max-w-md space-y-4 z-10">
                <span className="inline-block bg-[#D60042] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                  Идет набор 2026
                </span>
                <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
                  Инженерное творчество для детей в Новоуральске
                </h1>
                <p className="text-blue-100 text-sm lg:text-base">
                  Бесплатные занятия по робототехнике, программированию и 3D-моделированию. Раскрой потенциал будущего инженера!
                </p>
              </div>
              <div className="z-10 pt-6">
                <Link 
                  href={PAGES.QUANTS()} 
                  className="inline-flex bg-white text-[#005bff] hover:bg-blue-50 transition-colors px-6 py-3 rounded-xl font-bold text-sm items-center gap-2 shadow-md"
                >
                  Выбрать направление 
                  <ArrowRight size={16} strokeWidth={2.5} />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 flex flex-col justify-between border border-gray-100 shadow-sm">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-[#f91155]">
                  <Sparkles className="w-6 h-6" />
                </div>
                
                <div className="space-y-1">
                  <h2 className="font-bold text-gray-900 text-lg leading-snug">
                    Как записаться на обучение?
                  </h2>
                  <p className="text-gray-500 text-xs">
                    Выбирайте любой удобный для вас способ оформления:
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <span className="font-bold text-blue-800 block mb-0.5">1. Через Госуслуги</span>
                    <p className="text-blue-900 text-[11px] leading-tight">
                      Раздел «Образование дети» → Запись в кружки → Свердловская обл. → Новоуральск.
                    </p>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <span className="font-bold text-emerald-800 block mb-0.5">2. Через Навигатор ДОД</span>
                    <p className="text-emerald-900 text-[11px] leading-tight">
                      На официальном портале по Свердловской области (выбирайте МАУ ДО «СЮТ»).
                    </p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="font-bold text-gray-800 block mb-0.5">3. Лично в МАУ ДО &quot;СЮТ&quot;</span>
                    <p className="text-gray-600 text-[11px] leading-tight">
                      ул. Комсомольская 21, каб. 107. Пн-Пт: 8:30 – 17:00 (перерыв 12:00 – 12:48).
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-500 flex justify-between">
                  <span className="inline-flex items-center gap-1">
                    <Phone size={12} className="text-gray-400" strokeWidth={2.5} />
                    Кванториум: <strong>3-82-65</strong>
                  </span>
                  <span>Приемная СЮТ: <strong>3-92-31</strong></span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-5">
                <Link
                  href={PAGES.INSTRUCTION()} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs py-3 rounded-xl transition-colors block"
                >
                  Инструкция по записи
                </Link>
                <Link
                  href="https://xn--66-kmc.xn--80aafey1amqq.xn--d1acj3b/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-center bg-[#D60042] hover:bg-[#B50035] text-white font-bold text-xs py-3 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1"
                >
                  В Навигатор <MoveUpRight size={12} strokeWidth={3} />
                </Link>
              </div>
            </div>
          </div>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-950 tracking-tight">
                Направления подготовки <span className="text-gray-600 text-lg font-normal ml-2">{QUANTUMS.length} квантумов</span>
              </h2>
            </div>

            <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4" variants={containerVariants} initial="initial" animate="enter" exit="exit">
              {QUANTUMS.map((quant) => {
                return (
                  <motion.div 
                    key={quant.id} 
                    variants={cardVariants}
                    className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${quant.badgeColor} bg-opacity-60 group-hover:scale-105 transition-transform`}>
                          <Image src={quant.icon} alt={`${quant.title} icon`} width={24} height={24} className="w-6 h-6"  loading="lazy" />
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${quant.badgeColor}`}>
                            {quant.type}
                          </span>
                          <span className="text-[11px] font-medium text-gray-700 bg-gray-50 px-2 py-0.5 rounded-md">
                            {quant.age}
                          </span>
                        </div>
                      </div>

                      <h3 className="font-bold text-gray-900 text-base mb-2 group-hover:text-[#005bff] transition-colors truncate">
                        {quant.title}
                      </h3>
                      <p className="text-gray-500 text-xs leading-relaxed line-clamp-3 mb-6">
                        {quant.desc}
                      </p>
                    </div>

                    <button className="w-full bg-[#005bff] hover:bg-[#004ae6] text-white font-bold text-xs py-3 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer">
                      Подробнее
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>
          </section>
        </main>
      </div>
    </>
  );
}