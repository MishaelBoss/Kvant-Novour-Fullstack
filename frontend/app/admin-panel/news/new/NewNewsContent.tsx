"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PublishPostModal } from "../../_components/PublishPostModal";
import { Content } from "../_components/Content";
import { NewsCard } from "../_components/NewsCard";
import { toast } from "react-hot-toast";
import { INewsSettings, INewsTest } from "@/app/types/news.interface";
import { PlusIcon } from "lucide-react";
import { Settings } from "../_components/Settings";
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";

function GENERATE_ID() {
    return Math.random().toString(36).slice(2, 9);
}

export default function NewNewsContent() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'content' | 'settings'>('content');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState<INewsTest[]>([]);
    const [categories, setCategories] = useState('');
    const [publishDate, setPublishDate] = useState('');

    const [settings, setSettings] = useState<INewsSettings>({
        comments: true,
        for_authorized_users: false,
        pinned: false,
    });

    const updateSettings = (patch: Partial<INewsSettings>) => {
        setSettings(prev => ({ ...prev, ...patch }));
    };

    const addQuestion = () => {
        setQuestions(prev => [...prev, {
            id: GENERATE_ID(),
            text: '',
            type: 'text',
            media: null,
        }]);
    };

    const updateQuestion = (id: string, patch: Partial<INewsTest>) => {
        setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...patch } : q));
    };

    const removeQuestion = (id: string) => {
        setQuestions(prev => prev.filter(q => q.id !== id));
    };

    const duplicateQuestion = (quest: INewsTest) => {
        setQuestions(prev => [...prev, {
            id: GENERATE_ID(),
            text: quest.text || '',
            type: quest.type || 'text',
            media: quest.media || null,
        }]);
    };

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        setQuestions(prev => {
            const oldIndex = prev.findIndex(q => q.id === active.id);
            const newIndex = prev.findIndex(q => q.id === over.id);
            if (oldIndex === -1 || newIndex === -1) return prev;
            return arrayMove(prev, oldIndex, newIndex);
        });
    };

    const handleSave = async (status: 'draft' | 'active', newsImage: File | null = null) => {
        if (!title.trim()) {
            toast.error("Введите название формы");
            return;
        }

        setSaving(true);

        try {
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-215 mx-auto flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <Link
                        href="#"
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors cursor-pointer">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Назад
                    </Link>
                    <div className="flex gap-2">
                        <button
                            onClick={() => toast.error('Сначала сохраните новость')}
                            className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            <svg className="inline-block w-4 h-4 mr-1.5 -mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                <polyline points="15 3 21 3 21 9"/>
                                <line x1="10" y1="14" x2="21" y2="3"/>
                            </svg>
                            Предпросмотр
                        </button>
                        <button
                            onClick={() => handleSave('draft')}
                            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            {saving ? 'Сохранение...' : 'Сохранить'}
                        </button>
                        <PublishPostModal onPublish={(file) => handleSave('active', file)} isActive={false}>
                            <button
                                className="px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
                                Опубликовать
                            </button>
                        </PublishPostModal>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200/50 flex flex-col gap-6">
                    <div className="flex gap-6 border-b border-gray-100 -mt-2 mb-2">
                        <button 
                            onClick={() => setActiveTab('content')}
                            className={`pb-3 text-sm font-medium transition-all relative cursor-pointer ${
                                activeTab === 'content' ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'
                            }`}>
                            Контент
                            {activeTab === 'content' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
                            )}
                        </button>
                        <button 
                            onClick={() => setActiveTab('settings')}
                            className={`pb-3 text-sm font-medium transition-all relative cursor-pointer ${
                                activeTab === 'settings' ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'
                            }`}>
                            Настройки
                            {activeTab === 'settings' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
                            )}
                        </button>
                    </div>

                    {activeTab === 'content' ? (
                        <Content 
                            title={title} 
                            setTitle={setTitle} 
                            description={description} 
                            setDescription={setDescription}
                            categories={categories}
                            setCategories={setCategories}
                            publishDate={publishDate}
                            setPublishDate={setPublishDate}
                        />
                    ) : (
                        <Settings settings={settings} updateSettings={updateSettings}/>
                    )}
                </div>

                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={questions.map(q => q.id)} strategy={verticalListSortingStrategy}>
                        <div className="flex flex-col gap-3">
                            {questions.map((q, index) => (
                                <NewsCard
                                    key={q.id}
                                    question={q}
                                    index={index}
                                    onUpdate={updateQuestion}
                                    onRemove={removeQuestion}
                                    onDuplicate={duplicateQuestion}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
                <button
                    onClick={addQuestion}
                    className="flex items-center justify-center gap-2 w-full py-3 text-sm text-gray-500 border-2 border-dashed border-gray-200 rounded-[20px] hover:border-blue-300 hover:text-blue-500 transition-colors cursor-pointer">
                    <PlusIcon className="w-[17] h-[17]"/>
                    Добавить элемент
                </button>
            </div>
        </div>
    )
};