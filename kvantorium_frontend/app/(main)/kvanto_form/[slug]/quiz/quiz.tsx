"use client";

import { getFormDetail, submitFormResponse } from "@/app/lib/api";
import { FormDetail, Question, QuestionAnswer } from "@/app/types/form.interface";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

function formatTimer(seconds: number): string {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

export default function Quiz() {
    const router = useRouter();
    const { slug } = useParams();

    const [form, setForm] = useState<FormDetail | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [finished, setFinished] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const answersRef = useRef(answers);

    useEffect(() => {
        answersRef.current = answers;
    }, [answers]);

    useEffect(() => {
        async function init() {
            if (!slug) return;
            try {
                const data = await getFormDetail(slug as string);
                console.log("Данные от API:", data);

                if (!data || !Array.isArray(data.questions)) {
                    console.error("Структура неверна. Ожидали questions, получили:", data);
                    throw new Error("Неверная структура данных от сервера");
                }

                setForm(data);
                setTimeLeft(data.settings?.timer_seconds ?? 0); 

                setAnswers(data.questions.map((q: Question) => ({
                    question_id: q.id,
                    text_value: '',
                    selected_choice_ids: [],
                })));
            } catch (err) {
                console.error("Ошибка инициализации:", err);
            }
        }
        init();
    }, [slug]);

    const updateAnswer = (patch: Partial<QuestionAnswer>) => {
        setAnswers(prev => prev.map((a, i) =>
            i === currentIndex ? { ...a, ...patch } : a
        ));
    };

    const handleFinish = useCallback(async () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setFinished(true);
        
        const profileRaw = sessionStorage.getItem(`quiz_profile_${slug}`);
        const profile = profileRaw ? JSON.parse(profileRaw) : {};
        const session = { profile, answers: answersRef.current };

        try {
            const result = await submitFormResponse(slug as string, session);
            sessionStorage.setItem(`quiz_result_${slug}`, JSON.stringify(result));
        } catch (e) {
            console.error('Ошибка отправки:', e);
        }

        router.push(`/kvanto_form/${slug}/result`);
    }, [slug, router]);

    useEffect(() => {
        if (!form || !form.settings?.timer_enabled || finished) return;

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleFinish();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [form, finished, handleFinish]);

    if (!form || answers.length === 0) {
        return (
            <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center">
                <p className="text-gray-400 text-sm">Загрузка...</p>
            </div>
        );
    }
    
    const currentQuestion = form.questions[currentIndex];
    const answer = answers[currentIndex];
    const isLast = currentIndex === form.questions.length - 1;
    const progress = ((currentIndex + 1) / form.questions.length) * 100;

    return (
        <div className="min-h-screen bg-[#f4f5f7] p-4 md:p-8">
            <div className="max-w-[640px] mx-auto flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 font-medium">{form.title}</span>
                    {form.settings.timer_enabled && (
                        <span className={`text-sm font-mono font-semibold px-3 py-1 rounded-lg ${
                            timeLeft < 60 ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-600'
                        }`}>
                            ⏱ {formatTimer(timeLeft)}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs text-gray-400">
                        <span>Вопрос {currentIndex + 1} из {form.questions.length}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}/>
                    </div>
                </div>

                <div className="bg-white rounded-[24px] p-6 md:p-8 shadow-sm border border-gray-200/50 flex flex-col gap-6">
                    {currentQuestion.media && (
                        <div className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                            {currentQuestion.media.type === 'image' && (
                                <Image src={currentQuestion.media.preview_url.replace('http://localhost', '')} loading="eager" width={100} height={100} alt="" className="w-full max-h-64 object-contain p-2" />
                            )}
                            {currentQuestion.media.type === 'audio' && (
                                <div className="p-4">
                                    <audio controls src={currentQuestion.media.preview_url.replace('http://localhost', '')} className="w-full" />
                                </div>
                            )}
                            {currentQuestion.media.type === 'video' && (
                                <video controls src={currentQuestion.media.preview_url.replace('http://localhost', '')} className="w-full max-h-64" />
                            )}
                        </div>
                    )}

                    <div className="flex flex-col gap-1">
                        <p className="text-base font-medium text-gray-800">
                            {currentQuestion.text}
                            {currentQuestion.is_required && <span className="text-red-400 ml-1">*</span>}
                        </p>
                        {currentQuestion.points > 0 && (
                            <p className="text-xs text-gray-400">{currentQuestion.points} балл(ов)</p>
                        )}
                    </div>

                    {currentQuestion.type === 'short_text' && (
                        <input
                            value={answer?.text_value || ''}
                            onChange={e => updateAnswer({ text_value: e.target.value })}
                            placeholder="Ваш ответ..."
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors"/>
                    )}

                    {currentQuestion.type === 'long_text' && (
                        <textarea
                            value={answer?.text_value || ''}
                            onChange={e => updateAnswer({ text_value: e.target.value })}
                            placeholder="Ваш ответ..."
                            rows={4}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors resize-none"/>
                    )}

                    {currentQuestion.type === 'number' && (
                        <input
                            type="number"
                            value={answer?.text_value || ''}
                            onChange={e => updateAnswer({ text_value: e.target.value })}
                            placeholder="Введите число..."
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors"/>
                    )}

                    {currentQuestion.type === 'radio' && (
                        <div className="flex flex-col gap-2">
                            {currentQuestion.choices.map(choice => (
                                <label key={choice.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`q_${currentQuestion.id}`}
                                        checked={answer?.selected_choice_ids[0] === choice.id}
                                        onChange={() => updateAnswer({ selected_choice_ids: [choice.id] })}
                                        className="w-4 h-4 accent-blue-500 cursor-pointer flex-shrink-0"/>
                                    <span className="text-sm text-gray-700">{choice.text}</span>
                                </label>
                            ))}
                        </div>
                    )}

                    {currentQuestion.type === 'checkbox' && (
                        <div className="flex flex-col gap-2">
                            {currentQuestion.choices.map(choice => {
                                const checked = answer?.selected_choice_ids.includes(choice.id);
                                return (
                                    <label key={choice.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => {
                                                const ids = answer?.selected_choice_ids || [];
                                                updateAnswer({
                                                    selected_choice_ids: checked
                                                        ? ids.filter(id => id !== choice.id)
                                                        : [...ids, choice.id],
                                                });
                                            }}
                                            className="w-4 h-4 accent-blue-500 cursor-pointer flex-shrink-0"/>
                                        <span className="text-sm text-gray-700">{choice.text}</span>
                                    </label>
                                );
                            })}
                        </div>
                    )}

                    {currentQuestion.type === 'dropdown' && (
                        <select
                            aria-label={currentQuestion.text} 
                            value={answer?.selected_choice_ids[0] || ''}
                            onChange={e => updateAnswer({ selected_choice_ids: [e.target.value] })}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors bg-white cursor-pointer">
                            <option value="">Выберите вариант...</option>
                            {currentQuestion.choices.map(choice => (
                                <option key={choice.id} value={choice.id}>{choice.text}</option>
                            ))}
                        </select>
                    )}
                </div>

                <div className="flex justify-between gap-3">
                    <button
                        onClick={() => setCurrentIndex(i => i - 1)}
                        disabled={currentIndex === 0}
                        className="px-5 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed">
                        ← Назад
                    </button>

                    {isLast ? (
                        <button
                            onClick={handleFinish}
                            className="px-6 py-2.5 text-sm text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors cursor-pointer font-medium">
                            Завершить тест
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentIndex(i => i + 1)}
                            className="px-5 py-2.5 text-sm text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors cursor-pointer">
                            Далее →
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}