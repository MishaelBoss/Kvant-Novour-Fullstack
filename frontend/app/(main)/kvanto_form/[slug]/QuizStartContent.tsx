"use client";
import { PAGES } from "@/app/config/pages.config";
import { useAuth } from "@/app/context/AuthContext";
import { getFormDetail as apiGetFormDetail } from "@/app/lib/api";
import { IApiError } from "@/app/types/api-error.interface";
import { IParticipantProfile } from "@/app/types/form.interface";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ViewTracker } from "@/app/components/ViewTracker";
import { useQuery } from "@tanstack/react-query";

const CURRENT_YEAR = new Date().getFullYear();
const BIRTH_YEARS = Array.from({ length: 30 }, (_, i) => CURRENT_YEAR - 10 - i);

export default function QuizStartContent() {
    const { user } = useAuth();
    const router = useRouter();
    const params = useParams();
    const slug = params?.slug;
    
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

    const { data: form, isLoading } = useQuery({
        queryKey: ['quiz-start', slug],
        queryFn: async () => {
            try {
                const data = await apiGetFormDetail(slug as string);
                return data;
            } catch (error) {
                const hasApiMarker = error !== null && typeof error === 'object' && 'isApiError' in error;
                const isNotFound = hasApiMarker && (error as IApiError).status === 404;

                if (isNotFound) setError("Форма не найдена или недоступна");
                else if (hasApiMarker) toast.error((error as IApiError).message);
                else toast.error("Произошла непредвиденная ошибка на клиенте");

                console.error("Ошибка", error);
                throw error;
            }
        },
        retry: false,
        enabled: !!slug && typeof slug === 'string',
    });

    useEffect(() => {
        if (!form) return;

        if (form.settings?.survey_for_authorized_users && !user) {
            setError("Этот опрос доступен только авторизованным пользователям. Пожалуйста, войдите в аккаунт.");
            return;
        }

        if (form.settings?.one_time_participation_survey && form.has_user_participated) {
            setError("Вы уже проходили этот опрос. Повторное участие невозможно.");
            return;
        }
    }, [form, user]);

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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center p-4">
                <p className="text-gray-400 text-sm">Загрузка...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center p-4">
                <div className="w-full max-w-130 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200/50 text-center flex flex-col gap-4">
                    <div className="text-4xl flex justify-center"><Image src='/undraw_notify_drs8.svg' alt="Error" width={150} height={150}/></div>
                    <p className="text-gray-700 text-sm">{error}</p>
                    <Link
                        href={PAGES.NEWS()}
                        className="mt-2 w-full py-2.5 text-sm text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors cursor-pointer font-medium">
                        На главную
                    </Link>
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
            <ViewTracker
                slug={typeof slug === 'string' ? slug : ''}
                kind="form"
                delay={3000}
            />

            <div className="w-full max-w-130 flex flex-col gap-6">
                {form.has_user_viewed && (
                    <p className="text-center text-[12px] font-medium text-gray-400">
                        Вы уже открывали этот опрос ранее
                    </p>
                )}

                <div className="text-center flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-gray-800">Перед началом</h1>
                </div>

                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200/50">
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