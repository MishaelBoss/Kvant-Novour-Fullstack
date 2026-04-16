"use client";

import { Question, QuestionType, MediaType } from "@/app/types/form.interface";
import { DropdownMenu } from "@radix-ui/themes";
import Image from "next/image";
import { useRef } from "react";

interface QuestionCardProps {
    question: Question;
    index: number;
    onUpdate: (id: string, patch: Partial<Question>) => void;
    onRemove: (id: string) => void;
    onDuplicate: (q: Question) => void;
    onAddChoice: (questionId: string) => void;
    onUpdateChoice: (questionId: string, choiceId: string, text: string) => void;
    onUpdateChoiceCorrect: (questionId: string, choiceId: string, is_correct: boolean) => void;
    onRemoveChoice: (questionId: string, choiceId: string) => void;
}

const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
    short_text: 'Короткий текст',
    long_text: 'Длинный текст',
    radio: 'Один вариант',
    checkbox: 'Несколько вариантов',
    dropdown: 'Выпадающий список',
    number: 'Число',
};

const WITH_CHOICES: QuestionType[] = ['radio', 'checkbox', 'dropdown'];

const MEDIA_ACCEPT: Record<MediaType, string> = {
    image: 'image/jpg,image/jpeg,image/png,image/gif,image/svg+xml',
    audio: 'audio/mpeg,audio/ogg',
    video: 'video/mp4,video/webm',
};

const MEDIA_LABELS: Record<MediaType, string> = {
    image: 'Изображение',
    audio: 'Аудио',
    video: 'Видео',
};

export function QuestionCard({
    question: q,
    index,
    onUpdate,
    onRemove,
    onDuplicate,
    onAddChoice,
    onUpdateChoice,
    onUpdateChoiceCorrect,
    onRemoveChoice,
}: QuestionCardProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleMediaTypeSelect = (type: MediaType) => {
        onUpdate(q.id, { media: null });
        setTimeout(() => {
            if (fileInputRef.current) {
                fileInputRef.current.accept = MEDIA_ACCEPT[type];
                fileInputRef.current.dataset.mediaType = type;
                fileInputRef.current.click();
            }
        }, 0);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const type = (e.target.dataset.mediaType as MediaType) || 'image';
        const preview_url = URL.createObjectURL(file);
        onUpdate(q.id, { media: { type, file, preview_url } });
        e.target.value = '';
    };

    const removeMedia = () => {
        if (q.media?.preview_url) URL.revokeObjectURL(q.media.preview_url);
        onUpdate(q.id, { media: null });
    };

    return (
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-200/50 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Вопрос {index + 1}
                </span>
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                        <button type="button" className="text-gray-300 hover:text-gray-500 !cursor-pointer pt-1 focus-visible:outline-none outline-none" aria-label="Настройки вопроса">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path fill="currentColor" fillRule="evenodd" d="M3 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M9.5 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" clipRule="evenodd"/>
                            </svg>
                        </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        <DropdownMenu.Item onClick={() => onDuplicate(q)} className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-600 outline-none !cursor-pointer">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path fill="currentColor" fillRule="evenodd" d="M12 2.5H8A1.5 1.5 0 0 0 6.5 4v1H8a3 3 0 0 1 3 3v1.5h1A1.5 1.5 0 0 0 13.5 8V4A1.5 1.5 0 0 0 12 2.5M11 11h1a3 3 0 0 0 3-3V4a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v1H4a3 3 0 0 0-3 3v4a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3zM4 6.5h4A1.5 1.5 0 0 1 9.5 8v4A1.5 1.5 0 0 1 8 13.5H4A1.5 1.5 0 0 1 2.5 12V8A1.5 1.5 0 0 1 4 6.5" clipRule="evenodd"/>
                            </svg>
                            Дублировать
                        </DropdownMenu.Item>
                        <DropdownMenu.Item onClick={() => onRemove(q.id)} className="flex items-center gap-2 px-2 py-1.5 text-sm text-red-600 focus:bg-red-50 focus:text-red-700 outline-none !cursor-pointer">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path fill="currentColor" fillRule="evenodd" d="M2 4h12M6 4V2h4v2M5 4v9a1 1 0 001 1h4a1 1 0 001-1V4H5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Удалить
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            </div>

            <input
                value={q.text}
                onChange={e => onUpdate(q.id, { text: e.target.value })}
                placeholder="Текст вопроса..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors"/>

            <div className="flex items-center gap-3 flex-wrap">
                <select
                    value={q.type}
                    onChange={e => onUpdate(q.id, { type: e.target.value as QuestionType })}
                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors cursor-pointer bg-white"
                    aria-label="Тип вопроса">
                    {Object.entries(QUESTION_TYPE_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>

                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={q.is_required}
                        onChange={e => onUpdate(q.id, { is_required: e.target.checked })}
                        className="w-4 h-4 accent-blue-500 cursor-pointer"/>
                    Обязательный
                </label>
            </div>

            <div className="flex flex-col gap-3">
                {!q.media && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">Добавить медиа:</span>
                        {(Object.keys(MEDIA_LABELS) as MediaType[]).map(type => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => handleMediaTypeSelect(type)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg hover:border-blue-300 hover:text-blue-500 transition-colors cursor-pointer">
                                <MediaIcon type={type} />
                                {MEDIA_LABELS[type]}
                            </button>
                        ))}
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    aria-label="Выберите файл для загрузки"/>

                {q.media && (
                    <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                        <button
                            type="button"
                            onClick={removeMedia}
                            className="absolute top-2 right-2 z-10 w-7 h-7 flex items-center justify-center bg-white rounded-full border border-gray-200 text-gray-400 hover:text-red-400 hover:border-red-200 transition-colors cursor-pointer shadow-sm"
                            aria-label="Удалить медиа">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        </button>

                        {q.media.type === 'image' && (
                            <Image
                                width={100}
                                height={100}
                                src={q.media.preview_url}
                                alt="Медиа к вопросу"
                                className="w-full max-h-60 object-contain p-2"
                            />
                        )}
                        {q.media.type === 'audio' && (
                            <div className="p-4 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                    <MediaIcon type="audio" className="text-blue-500" />
                                </div>
                                <audio controls src={q.media.preview_url} className="flex-1 h-8" />
                            </div>
                        )}
                        {q.media.type === 'video' && (
                            <video
                                controls
                                src={q.media.preview_url}
                                className="w-full max-h-60"
                            />
                        )}
                    </div>
                )}
            </div>

            {q.type !== 'long_text' && (
                <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-400 whitespace-nowrap">Баллов за вопрос:</label>
                    <input
                        type="number"
                        min={0}
                        max={100}
                        value={q.points || 0}
                        onChange={e => onUpdate(q.id, { points: Number(e.target.value) })}
                        className="w-20 px-2 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors text-center"/>
                </div>
            )}

            {q.type === 'number' && (
                <div className="flex flex-col gap-1.5 pl-1">
                    <label className="text-xs text-gray-400">Правильный ответ</label>
                    <input
                        type="number"
                        value={q.correct_answer || ''}
                        onChange={e => onUpdate(q.id, { correct_answer: e.target.value })}
                        placeholder="Введите число..."
                        className="w-40 px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors"/>
                </div>
            )}

            {q.type === 'long_text' && (
                <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-100 rounded-lg">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-amber-400 flex-shrink-0">
                        <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3"/>
                        <path d="M7 4v3.5M7 9.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                    <span className="text-xs text-amber-600">Проверяется вручную — баллы выставляет автор</span>
                </div>
            )}

            {WITH_CHOICES.includes(q.type) && (
                <div className="flex flex-col gap-2 pl-1">
                    <div className="flex items-center justify-between pr-6">
                        <span className="text-xs text-gray-400">Варианты ответа</span>
                        <span className="text-xs text-gray-400">Правильный</span>
                    </div>
                    {q.choices.map((choice, ci) => (
                        <div key={choice.id} className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 w-4">{ci + 1}.</span>
                            <input
                                value={choice.text}
                                onChange={e => onUpdateChoice(q.id, choice.id, e.target.value)}
                                placeholder={`Вариант ${ci + 1}`}
                                className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors"/>
                            <label className="flex items-center cursor-pointer" title="Правильный ответ">
                                <input
                                    type={q.type === 'radio' || q.type === 'dropdown' ? 'radio' : 'checkbox'}
                                    name={`correct_${q.id}`}
                                    checked={choice.is_correct || false}
                                    onChange={e => onUpdateChoiceCorrect(q.id, choice.id, e.target.checked)}
                                    className="w-4 h-4 accent-green-500 cursor-pointer"/>
                            </label>
                            <button
                                onClick={() => onRemoveChoice(q.id, choice.id)}
                                className="text-gray-300 hover:text-red-400 transition-colors cursor-pointer"
                                aria-label={`Удалить вариант ${ci + 1}`}>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={() => onAddChoice(q.id)}
                        className="self-start mt-1 text-sm text-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                        + Добавить вариант
                    </button>
                </div>
            )}
        </div>
    );
}

function MediaIcon({ type, className = '' }: { type: MediaType; className?: string }) {
    if (type === 'image') return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={className}>
            <rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3"/>
            <circle cx="4.5" cy="4.5" r="1" fill="currentColor"/>
            <path d="M1 9.5l3-3 2.5 2.5 2-2 3.5 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
    if (type === 'audio') return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={className}>
            <path d="M5 3v8M3 5v4M7 2v10M9 4v6M11 5v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
    );
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={className}>
            <rect x="1" y="2" width="9" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M10 5.5l3-2v7l-3-2V5.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
        </svg>
    );
}