"use client";
import { PERSONAL } from "@/app/data/personalData";
import Link from "next/link";
import { TeamCard } from "../../team/_components/TeamCard";
import { Clock, Users, Star, Monitor, ArrowRight, Check, Code2, BadgeCheck, Shield, ChessKnight } from "lucide-react";

export default function ChessContent() {
    const teachers = PERSONAL.filter(p => p.courses.includes('chess'));
    const iconProps = { size: 20, strokeWidth: 1.5 };
    const badgeIconProps = { size: 14, strokeWidth: 2.5 };

    return (
        <main className="font-sans">
            <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-green-600 text-white">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
                <div className="relative max-w-300 mx-auto px-4 py-16 md:py-24">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                        <div className="flex-1 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-[13px] font-medium mb-5">
                                <ChessKnight {...badgeIconProps} />
                                Сопутствующее направление
                            </div>
                            <h1 className="text-[36px] md:text-[48px] font-bold leading-tight mb-4">
                                Квантошахматы
                            </h1>
                            <p className="text-[16px] md:text-[18px] text-emerald-100 leading-relaxed mb-8">
                                Шахматы как инструмент развития стратегического мышления, логики
                                и навыков принятия решений. Турнирная практика, анализ партий
                                и подготовка к выполнению спортивных разрядов.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link href="#" className="inline-flex items-center gap-2 bg-white text-emerald-600 font-semibold px-6 py-3 rounded-xl hover:bg-emerald-50 transition-all active:scale-[0.98] text-[15px] shadow-lg shadow-emerald-900/20">
                                    Записаться на курс
                                    <ArrowRight size={16} strokeWidth={2.5} />
                                </Link>
                                <Link href="#program" className="inline-flex items-center gap-2 bg-white/10 text-white font-medium px-6 py-3 rounded-xl hover:bg-white/20 transition-all text-[15px] backdrop-blur-sm">
                                    Программа обучения
                                </Link>
                            </div>
                        </div>
                        <div className="hidden md:grid grid-cols-3 gap-3">
                            {['Дебют', 'Тактика', 'Эндшпиль', 'Стратегия', 'Турниры', 'Анализ'].map((tag, i) => (
                                <div key={tag} className={`px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm text-center text-[13px] font-medium ${i % 2 === 0 ? 'mt-4' : 'mb-4'}`}>{tag}</div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-6 mt-10">
                        <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 backdrop-blur-sm">
                            <Clock {...iconProps} />
                            <div><p className="text-[11px] text-emerald-200">Длительность</p><p className="text-[14px] font-semibold">72 часа</p></div>
                        </div>
                        <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 backdrop-blur-sm">
                            <Users {...iconProps} />
                            <div><p className="text-[11px] text-emerald-200">Возраст</p><p className="text-[14px] font-semibold">11–17 лет</p></div>
                        </div>
                        <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 backdrop-blur-sm">
                            <Star {...iconProps} />
                            <div><p className="text-[11px] text-emerald-200">Стоимость</p><p className="text-[14px] font-semibold">Бесплатно</p></div>
                        </div>
                        <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 backdrop-blur-sm">
                            <Monitor {...iconProps} />
                            <div><p className="text-[11px] text-emerald-200">Формат</p><p className="text-[14px] font-semibold">Очно, до 10 чел.</p></div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="max-w-300 mx-auto px-4 -mt-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
                            <Code2 size={20} strokeWidth={1.5} className="text-[#059669]" />
                        </div>
                        <h3 className="text-[15px] font-bold text-gray-900 mb-2">Что изучаем</h3>
                        <p className="text-[13px] text-gray-500 leading-relaxed">
                            Шахматные дебюты, тактические приёмы, стратегия миттельшпиля,
                            эндшпиль, анализ классических партий, компьютерные шахматы,
                            турнирная практика на платформах Chess.com и Lichess.org.
                        </p>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mb-4">
                            <BadgeCheck size={20} strokeWidth={1.5} className="text-[#00B856]" />
                        </div>
                        <h3 className="text-[15px] font-bold text-gray-900 mb-2">Чему научитесь</h3>
                        <p className="text-[13px] text-gray-500 leading-relaxed">
                            Мыслить стратегически, принимать решения в условиях ограниченного времени,
                            анализировать позиции, участвовать в турнирах, выполнять спортивные разряды.
                        </p>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
                            <Shield size={20} strokeWidth={1.5} className="text-[#f59e0b]" />
                        </div>
                        <h3 className="text-[15px] font-bold text-gray-900 mb-2">Результат</h3>
                        <p className="text-[13px] text-gray-500 leading-relaxed">
                            Развитие логического и стратегического мышления, необходимого
                            для проектной деятельности в любом из профильных квантумов.
                        </p>
                    </div>
                </div>
            </section>

            <section id="program" className="max-w-300 mx-auto px-4 py-16">
                <div className="mb-10">
                    <span className="text-[13px] font-semibold text-emerald-600 uppercase tracking-wider">Программа</span>
                    <h2 className="text-[28px] font-bold text-gray-900 mt-2 mb-3">Уровни обучения</h2>
                    <p className="text-[15px] text-gray-500 max-w-2xl">Каждый уровень — не менее 72 академических часов. По завершении выдаётся именное свидетельство.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl">
                    {[
                        {
                            level: 'Вводный', age: '11–17 лет',
                            desc: 'Изучение правил, базовых приёмов и простых комбинаций.',
                            modules: ['История и правила шахмат', 'Тактические приёмы', 'Дебютный репертуар', 'Простые окончания']
                        },
                        {
                            level: 'Углублённый', age: '11–17 лет',
                            desc: 'Стратегия, глубокий анализ, подготовка к соревнованиям.',
                            modules: ['Стратегия миттельшпиля', 'Сложный эндшпиль', 'Компьютерный анализ', 'Турнирная практика']
                        },
                    ].map((level) => (
                        <div key={level.level} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="bg-gradient-to-r from-emerald-600 to-green-500 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[18px] font-bold text-white">{level.level}</h3>
                                    <span className="text-[12px] font-medium text-emerald-200 bg-white/15 rounded-full px-3 py-1">{level.age}</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-[13px] text-gray-500 mb-5">{level.desc}</p>
                                <ul className="space-y-2.5">
                                    {level.modules.map((m, i) => (
                                        <li key={i} className="flex items-start gap-3 text-[13px] text-gray-700">
                                            <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                                                <Check size={12} strokeWidth={3} />
                                            </span>
                                            {m}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {teachers.length > 0 && (
                <section className="bg-gray-50 border-t border-gray-100">
                    <div className="max-w-300 mx-auto px-4 py-16">
                        <div className="mb-10">
                            <span className="text-[13px] font-semibold text-emerald-600 uppercase tracking-wider">Команда</span>
                            <h2 className="text-[28px] font-bold text-gray-900 mt-2 mb-3">Преподаватели</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {teachers.map(person => (<TeamCard key={person.id} person={person} />))}
                        </div>
                    </div>
                </section>
            )}

            <section className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-green-600">
                <div className="max-w-300 mx-auto px-4 py-16 md:py-20 text-center">
                    <h2 className="text-[30px] md:text-[36px] font-bold text-white mb-4">Развивайте стратегическое мышление</h2>
                    <p className="text-[16px] text-emerald-100 max-w-xl mx-auto mb-8">Обучение бесплатное. Заполните заявку, и мы свяжемся с вами.</p>
                    <Link href="#" className="inline-flex items-center gap-2 bg-white text-emerald-600 font-semibold px-8 py-3.5 rounded-xl hover:bg-emerald-50 transition-all active:scale-[0.98] text-[15px] shadow-lg shadow-emerald-900/25">
                        Записаться на курс
                        <ArrowRight size={16} strokeWidth={2.5} />
                    </Link>
                </div>
            </section>
        </main>
    );
}
