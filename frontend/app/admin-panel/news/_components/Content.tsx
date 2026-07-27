import { getCategories } from "@/app/lib/api";
import { ICategory } from "@/app/types/news.interface";
import { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { MultiValue } from "react-select";
import CreatableSelect from "react-select/creatable";

interface ContentProps {
    title: string;
    setTitle: (value: string) => void;
    description: string;
    setDescription: (value: string) => void;
    categories: string;
    setCategories: (value: string) => void;
    publishDate: string;
    setPublishDate: (value: string) =>  void;
}

export function Content({ title, setTitle, description, setDescription }: ContentProps) {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [selectedOption, setSelectedOption] = useState<MultiValue<ICategory>>([]);

    const methods = useForm();

    const getCurrentLocalDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };

    useEffect(() => {
        const loadCats = async () => {
            const data = await getCategories();
            setCategories(data.results || []);
        };
        loadCats();
    }, []);

    const handleCreate = (inputValue: string) => {
        const generatedSlug = inputValue.toLowerCase().replace(/\s+/g, '-');
        const newOption: ICategory = {
            label: inputValue,
            value: Date.now(),
            slug: generatedSlug,
        };
        
        const newSelected = [...selectedOption, newOption];
        setSelectedOption(newSelected);
        methods.setValue('categories', newSelected);
    };

    const [publishDate, setPublishDate] = useState(getCurrentLocalDateTime());

    return(
        <>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Основное</p>
        <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Название</label>
            <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Новая форма"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors"/>
        </div>
        <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Описание</label>
            <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Коротко о новости..."
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors resize-none"/>
        </div>
        <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Категории</label>
            <FormProvider {...methods}>
                {categories.length > 0 && (
                    <Controller
                        name="categories"
                        control={methods.control}
                        render={({ field }) => (
                            <CreatableSelect
                                isMulti
                                options={categories || []}
                                value={selectedOption}
                                onChange={(newValue) => {
                                    setSelectedOption(newValue);
                                    field.onChange(newValue);
                                }}
                                onCreateOption={handleCreate}
                                placeholder="Выберите категории..."
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        borderRadius: '.5rem',
                                        padding: '2px',
                                        borderColor: 'var(--gray-6)',
                                    }),
                                }}
                            />
                        )}
                    />
                )}
            </FormProvider>
        </div>
        <div className="flex flex-col gap-1"> 
            <label className="text-sm text-gray-600">Дата и время публикации</label> 
            <input 
                value={publishDate}
                onChange={e => setPublishDate(e.target.value)}
                type="datetime-local"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors custom-datetime-picker"
            /> 
        </div> 
        </>
    );
}