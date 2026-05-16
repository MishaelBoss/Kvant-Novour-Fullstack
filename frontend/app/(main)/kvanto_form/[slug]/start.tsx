"use client";

import { useAuth } from "@/app/context/AuthContext";
import { getFormDetail } from "@/app/lib/api";
import { IFormDetail, IParticipantProfile } from "@/app/types/form.interface";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const CURRENT_YEAR = new Date().getFullYear();
const BIRTH_YEARS = Array.from({ length: 30 }, (_, i) => CURRENT_YEAR - 10 - i);

export default function QuizStart() {
    const { user } = useAuth();
    const router = useRouter();
    const params = useParams();
    const slug = params?.slug;

    const [form, setForm] = useState<IFormDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<IParticipantProfile>({
        defaultValues: {
            full_name: '',
            school: '',
            grade: '',
            birth_year: CURRENT_YEAR - 14,
            participated_before: false,
        }
    });

    useEffect(() => {
        if (!slug) return;

        async function init() {
            try {
                const data = await getFormDetail(slug as string);
                if (!data) {
                    setError("Форма не найдена");
                    setLoading(false);
                    return;
                }

                setForm(data);

                // Проверка survey_for_authorized_users
                if (data.settings?.survey_for_authorized_users && !user) {
                    setError("Этот опрос доступен только авторизованным пользователям. Пожалуйста, войдите в аккаунт.");
                    setLoading(false);
                    return;
                }

                // Проверка one_time_participation_survey
                if (data.settings?.one_time_participation_survey && data.has_user_participated) {
                    setError("Вы уже проходили этот опрос. Повторное участие невозможно.");
                    setLoading(false);
                    return;
                }

                setLoading(false);
            } catch (err) {
                console.error("Ошибка загрузки формы:", err);
                setError("Не удалось загрузить форму");
                setLoading(false);
            }
        }

        init();
    }, [slug, user]);

    useEffect(() => {
        if (user) {
            const fullName = `${user.last_name || ''} ${user.first_name || ''} ${user.middle_name || ''}`.trim();
            if (fullName) {
                setValue('full_name', fullName);
            }
        }
    }, [user, setValue]);

    const onSubmit = (data: IParticipantProfile) => {
        sessionStorage.setItem(`quiz_profile_${slug}`, JSON.stringify(data));
        router.push(`/kvanto_form/${slug}/quiz`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center p-4">
                <p className="text-gray-400 text-sm">Загрузка...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center p-4">
                <div className="w-full max-w-[520px] bg-white rounded-[24px] p-6 md:p-8 shadow-sm border border-gray-200/50 text-center flex flex-col gap-4">
                    <div className="text-4xl">⚠️</div>
                    <p className="text-gray-700 text-sm">{error}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="mt-2 w-full py-2.5 text-sm text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors cursor-pointer font-medium">
                        На главную
                    </button>
                </div>
            </div>
        );
    }

    if (!form) {
        return (
            <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center p-4">
                <p className="text-gray-400 text-sm">Форма не найдена</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center p-4">
            <div className="w-full max-w-[520px] flex flex-col gap-6">
                <div className="text-center flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-gray-800">Перед началом</h1>
                </div>

                <div className="bg-white rounded-[24px] p-6 md:p-8 shadow-sm border border-gray-200/50">
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm text-gray-600">
                                ФИО <span className="text-red-400">*</span>
                            </label>
                            <input
                                {...register('full_name', { required: 'Обязательное поле' })}
                                placeholder="Иванов Иван Иванович"
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors"
                            />
                            {errors.full_name && (
                                <p className="text-xs text-red-400">{errors.full_name.message}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm text-gray-600">Учебное заведение</label>
                            <input
                                {...register('school')}
                                placeholder="Школа №48"
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors"/>
                        </div>

                        <div className="flex gap-3">
                            <div className="flex flex-col gap-1.5 flex-1">
                                <label className="text-sm text-gray-600">Класс / группа</label>
                                <input
                                    {...register('grade')}
                                    placeholder="10А"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors"/>
                            </div>
                            <div className="flex flex-col gap-1.5 flex-1">
                                <label className="text-sm text-gray-600">Год рождения</label>
                                <select
                                    {...register('birth_year', { valueAsNumber: true })}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors bg-white cursor-pointer">
                                    {BIRTH_YEARS.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-600">Участвовал в похожих мероприятиях раньше?</label>
                            <div className="flex gap-3">
                                {[
                                    { value: 'true', label: 'Да' },
                                    { value: 'false', label: 'Нет' },
                                ].map(opt => (
                                    <label key={opt.value} className="flex items-center gap-2 cursor-pointer select-none">
                                        <input
                                            type="radio"
                                            value={opt.value}
                                            {...register('participated_before')}
                                            className="w-4 h-4 accent-blue-500 cursor-pointer"/>
                                        <span className="text-sm text-gray-700">{opt.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="mt-2 w-full py-2.5 text-sm text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors cursor-pointer font-medium">
                            Начать тест
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}