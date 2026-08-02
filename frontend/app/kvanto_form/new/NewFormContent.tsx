"use client";
import { IFormCreate, IFormSettings, IQuestion } from "@/app/types/form.interface";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ModelConfirmAddForm } from "../_components/ModelConfirmAddForm";
import { Content } from "../_components/Content";
import { Settings } from "../_components/Settings";
import { QuestionCard } from "../_components/QuestionCard";
import { createForm } from "@/app/lib/api";
import { toast } from "react-hot-toast";
import { ChevronLeftIcon, PlusIcon } from "lucide-react";
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { IApiError } from "@/app/types/api-error.interface";

function GENERATE_ID() {
    return Math.random().toString(36).slice(2, 9);
}

export default function NewFormContent() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'content' | 'settings'>('content');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [questions, setQuestions] = useState<IQuestion[]>([]);

    const [settings, setSettings] = useState<IFormSettings>({
        timer_enabled: false,
        timer_seconds: 1800,
        one_question_per_page: true,
        show_results_after: true,
        require_profile: true,
        survey_for_authorized_users: false,
        one_time_participation_survey: false,
    });

    const updateSettings = (patch: Partial<IFormSettings>) => {
        setSettings(prev => ({ ...prev, ...patch }));
    };

    const addQuestion = () => {
        setQuestions(prev => [...prev, {
            id: GENERATE_ID(),
            text: '',
            type: 'short_text',
            is_required: false,
            points: 0,
            order: prev.length,
            choices: [],
            media: null,
            correct_answer: '',
        }]);
    };

    const updateQuestion = (id: string, patch: Partial<IQuestion>) => {
        setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...patch } : q));
    };

    const removeQuestion = (id: string) => {
        setQuestions(prev => prev.filter(q => q.id !== id));
    };

    const duplicateQuestion = (quest: IQuestion) => {
        setQuestions(prev => [...prev, {
            id: GENERATE_ID(),
            text: quest.text || '',
            type: quest.type || 'short_text',
            is_required: quest.is_required || false,
            points: quest.points || 0,
            order: quest.order || prev.length,
            choices: quest.choices || [],
            media: quest.media || null,
            correct_answer: quest.correct_answer || '',
        }]);
    };

    const addChoice = (questionId: string) => {
        setQuestions(prev => prev.map(q =>
            q.id === questionId
                ? { 
                    ...q, 
                    choices: [
                        ...q.choices, 
                        { 
                            id: GENERATE_ID(), 
                            text: '', 
                            is_correct: false, 
                            order: q.choices.length
                        }
                    ] 
                }
                : q
        ));
    };

    const updateChoice = (questionId: string, choiceId: string, text: string) => {
        setQuestions(prev => prev.map(q =>
            q.id === questionId
                ? { ...q, choices: q.choices.map(c => c.id === choiceId ? { ...c, text } : c) }
                : q
        ));
    };

    const updateChoiceCorrect = (questionId: string, choiceId: string, is_correct: boolean) => {
        setQuestions(prev => prev.map(q => {
            if (q.id !== questionId) return q;

            const isRadioType = q.type === 'radio' || q.type === 'dropdown';
            return {
                ...q,
                choices: q.choices.map(c => ({
                    ...c,
                    is_correct: isRadioType
                        ? c.id === choiceId
                        : c.id === choiceId ? is_correct : c.is_correct,
                })),
            };
        }));
    };

    const removeChoice = (questionId: string, choiceId: string) => {
        setQuestions(prev => prev.map(q =>
            q.id === questionId
                ? { ...q, choices: q.choices.filter(c => c.id !== choiceId) }
                : q
        ));
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
            const formData: IFormCreate = {
                title: title,
                description: description,
                deadline: deadline,
                status: status,
                questions: questions
            };
            
            createForm(formData, settings, newsImage);
            
            if (status === 'active') router.push('/profile?tab=kvantoForm');
        } catch (error) {
            const hasApiMarker = error !== null && typeof error === 'object' && 'isApiError' in error;
            
            if (hasApiMarker) {
                const apiError = error as IApiError;
                
                toast.error(apiError.message);
            } else toast.error("Произошла непредвиденная ошибка на клиенте");
            
            console.error("Ошибка", error);
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
                        <ChevronLeftIcon width="16" height="16"/>
                        Назад
                    </Link>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleSave('draft')}
                            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            {saving ? 'Сохранение...' : 'Сохранить'}
                        </button>
                        <ModelConfirmAddForm onPublish={(file) => handleSave('active', file)} isActive={false}>
                            <button
                                className="px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
                                Опубликовать
                            </button>
                        </ModelConfirmAddForm>
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
                            deadline={deadline}
                            setDeadline={setDeadline}
                        />
                    ) : (
                        <Settings settings={settings} updateSettings={updateSettings}/>
                    )}
                </div>

                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={questions.map(q => q.id)} strategy={verticalListSortingStrategy}>
                        <div className="flex flex-col gap-3">
                            {questions.map((q, index) => (
                                <QuestionCard
                                    key={q.id}
                                    question={q}
                                    index={index}
                                    onUpdate={updateQuestion}
                                    onRemove={removeQuestion}
                                    onDuplicate={duplicateQuestion}
                                    onAddChoice={addChoice}
                                    onUpdateChoice={updateChoice}
                                    onUpdateChoiceCorrect={updateChoiceCorrect}
                                    onRemoveChoice={removeChoice}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
                <button
                    onClick={addQuestion}
                    className="flex items-center justify-center gap-2 w-full py-3 text-sm text-gray-500 border-2 border-dashed border-gray-200 rounded-[20px] hover:border-blue-300 hover:text-blue-500 transition-colors cursor-pointer">
                    <PlusIcon className="w-[17] h-[17]"/>
                    Добавить вопрос
                </button>
            </div>
        </div>
    );
}