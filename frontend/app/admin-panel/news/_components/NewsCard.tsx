"use client";
import { INewsTest, NewsType, TextVariant, IBlockImage, IBlockFile } from "@/app/types/news.interface";
import { DropdownMenu } from "@radix-ui/themes";
import Image from "next/image";
import { useState, useRef, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";

interface Props {
    question: INewsTest;
    index: number;
    onUpdate: (id: string, patch: Partial<INewsTest>) => void;
    onRemove: (id: string) => void;
    onDuplicate: (q: INewsTest) => void;
    onAddChoice?: (questionId: string) => void;
    onUpdateChoice?: (questionId: string, choiceId: string, text: string) => void;
    onUpdateChoiceCorrect?: (questionId: string, choiceId: string, is_correct: boolean) => void;
    onRemoveChoice?: (questionId: string, choiceId: string) => void;
}

const BLOCK_LABELS: Record<NewsType, string> = {
    text: 'Текст',
    image: 'Изображение',
    file: 'Файл'
};

const TEXT_VARIANT_LABELS: Record<TextVariant, string> = {
    heading: 'Заглавный',
    subheading: 'Подзаголовок',
    body: 'Основной',
};

const TEXT_VARIANT_STYLES: Record<TextVariant, string> = {
    heading: 'text-2xl font-bold',
    subheading: 'text-lg font-semibold',
    body: 'text-base',
};

const IMAGE_ACCEPT = { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'] };
const FILE_ACCEPT = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'text/plain': ['.txt'],
};

function genId() {
    return Math.random().toString(36).slice(2, 9);
}

export function NewsCard({ question: q, index, onUpdate, onRemove, onDuplicate }: Props) {
    const images = q.images || [];
    const files = q.files || [];

    const handleTypeChange = (type: NewsType) => {
        const patch: Partial<INewsTest> = { type };
        if (type === 'text' && !q.text_variant) patch.text_variant = 'body';
        if (type === 'image') patch.images = q.images || [];
        if (type === 'file') patch.files = q.files || [];
        onUpdate(q.id, patch);
    };

    const handleVariantChange = (variant: TextVariant) => {
        onUpdate(q.id, { text_variant: variant });
    };

    const onImageDrop = useCallback((acceptedFiles: File[]) => {
        const newImages: IBlockImage[] = acceptedFiles.map(file => ({
            id: genId(),
            file,
            preview_url: URL.createObjectURL(file),
            caption: '',
        }));
        onUpdate(q.id, { images: [...images, ...newImages] });
    }, [images, onUpdate, q.id]);

    const { getRootProps: getImageRoot, getInputProps: getImageInput, isDragActive: isImageDrag } = useDropzone({
        onDrop: onImageDrop,
        accept: IMAGE_ACCEPT,
        multiple: true,
    });

    const removeImage = (imgId: string) => {
        const img = images.find(i => i.id === imgId);
        if (img?.preview_url.startsWith('blob:')) URL.revokeObjectURL(img.preview_url);
        onUpdate(q.id, { images: images.filter(i => i.id !== imgId) });
    };

    const updateImageCaption = (imgId: string, caption: string) => {
        onUpdate(q.id, {
            images: images.map(i => i.id === imgId ? { ...i, caption } : i),
        });
    };

    const onFileDrop = useCallback((acceptedFiles: File[]) => {
        const newFiles: IBlockFile[] = acceptedFiles.map(file => ({
            id: genId(),
            file,
            name: file.name,
        }));
        onUpdate(q.id, { files: [...files, ...newFiles] });
    }, [files, onUpdate, q.id]);

    const { getRootProps: getFileRoot, getInputProps: getFileInput, isDragActive: isFileDrag } = useDropzone({
        onDrop: onFileDrop,
        accept: FILE_ACCEPT,
        multiple: true,
    });

    const removeFile = (fileId: string) => {
        onUpdate(q.id, { files: files.filter(f => f.id !== fileId) });
    };

    return (
        <div className="group bg-white rounded-[20px] p-6 shadow-sm border border-gray-200/50 hover:shadow-md hover:border-gray-200 transition-all duration-200 flex flex-col gap-5">
            <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {BLOCK_LABELS[q.type] || 'Блок'} {index + 1}
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

            <div className="flex items-center gap-3 flex-wrap">
                <div className="relative">
                    <select
                        value={q.type}
                        onChange={e => handleTypeChange(e.target.value as NewsType)}
                        className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all cursor-pointer bg-white text-gray-700 font-medium min-w-[140px]"
                        aria-label="Тип блока">
                        {Object.entries(BLOCK_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                    <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" viewBox="0 0 16 16" fill="none">
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>

                {q.type === 'text' && (
                    <div className="relative">
                        <select
                            value={q.text_variant || 'body'}
                            onChange={e => handleVariantChange(e.target.value as TextVariant)}
                            className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all cursor-pointer bg-white text-gray-500 min-w-[130px]"
                            aria-label="Стиль текста">
                            {Object.entries(TEXT_VARIANT_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                        <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" viewBox="0 0 16 16" fill="none">
                            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                )}
            </div>

            {q.type === 'text' && (
                <div className="flex flex-col gap-3">
                    <textarea
                        value={q.text || ''}
                        onChange={e => onUpdate(q.id, { text: e.target.value })}
                        placeholder="Введите текст..."
                        rows={4}
                        className={`w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all resize-y bg-white ${TEXT_VARIANT_STYLES[q.text_variant || 'body']}`}
                    />
                </div>
            )}

            {q.type === 'image' && (
                <div className="flex flex-col gap-4">
                    <div {...getImageRoot()}>
                        <input {...getImageInput()} />
                        <div className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer ${
                            isImageDrag ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/30'
                        }`}>
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isImageDrag ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className={isImageDrag ? 'text-blue-500' : 'text-gray-400'}>
                                    <rect x="2" y="2" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.5"/>
                                    <circle cx="7" cy="7" r="1.5" fill="currentColor"/>
                                    <path d="M2 14l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <div className="text-center">
                                <p className={`text-sm font-medium ${isImageDrag ? 'text-blue-500' : 'text-gray-500'}`}>
                                    {isImageDrag ? 'Бросайте изображения сюда!' : 'Нажмите или перетащите для загрузки'}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WEBP, GIF</p>
                            </div>
                        </div>
                    </div>

                    {images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {images.map(img => (
                                <div key={img.id} className="group/img relative flex flex-col gap-1.5">
                                    <div className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                                        {img.preview_url && (
                                            <Image
                                                fill
                                                src={img.preview_url}
                                                alt={img.caption || 'Изображение'}
                                                className="object-cover"
                                                sizes="(max-width: 768px) 50vw, 33vw"
                                            />
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeImage(img.id)}
                                            className="absolute top-1.5 right-1.5 w-7 h-7 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full border border-gray-200 text-gray-400 hover:text-red-400 hover:border-red-200 transition-all opacity-0 group-hover/img:opacity-100 cursor-pointer shadow-sm"
                                            aria-label="Удалить изображение">
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                            </svg>
                                        </button>
                                    </div>
                                    <input
                                        value={img.caption}
                                        onChange={e => updateImageCaption(img.id, e.target.value)}
                                        placeholder="Подпись к изображению..."
                                        className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all bg-white"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {images.length > 0 && (
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span>{images.length} изображений</span>
                        </div>
                    )}
                </div>
            )}

            {q.type === 'file' && (
                <div className="flex flex-col gap-3">
                    <div {...getFileRoot()}>
                        <input {...getFileInput()} />
                        <div className={`border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center gap-2.5 transition-colors cursor-pointer ${
                            isFileDrag ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/30'
                        }`}>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isFileDrag ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={isFileDrag ? 'text-blue-500' : 'text-gray-400'}>
                                    <path d="M3 13v3a2 2 0 002 2h10a2 2 0 002-2v-3M10 3v10M6 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <div className="text-center">
                                <p className={`text-sm font-medium ${isFileDrag ? 'text-blue-500' : 'text-gray-500'}`}>
                                    {isFileDrag ? 'Бросайте файлы сюда!' : 'Загрузите файлы'}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">PDF, DOC, DOCX, TXT</p>
                            </div>
                        </div>
                    </div>

                    {files.length > 0 && (
                        <div className="flex flex-col gap-2">
                            {files.map(f => (
                                <div key={f.id} className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-100 group/file">
                                    <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-blue-500">
                                            <path d="M9 1H4a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V5L9 1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                                            <path d="M9 1v4h4" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                    <span className="flex-1 text-sm text-gray-700 truncate">{f.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(f.id)}
                                        className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-red-400 opacity-0 group-hover/file:opacity-100 transition-all cursor-pointer rounded-lg hover:bg-red-50"
                                        aria-label="Удалить файл">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {files.length > 0 && (
                        <div className="text-xs text-gray-400">
                            {files.length} файлов
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
