'use client';

import { CartNews } from "@/app/components/CartNews";
import { getCategories, getListNews } from "@/app/lib/api";
import { Category } from "@/app/types/category.interface";
import { News as INews } from "@/app/types/news.interface";
import { useEffect, useState } from "react";

export default function News() {
    const [categories, setCategories] = useState<Category[]>([]); 
    const [selectedValue, setSelectedValue] = useState<string>('');
    const [news, setNews] = useState<INews[]>([]);
    console.log('Categories data:', categories);

    useEffect(() => {
        const savedValue = localStorage.getItem('myAppSelectValue');
        if (savedValue) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSelectedValue(savedValue || 'all');
        }
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = event.target.value;
        setSelectedValue(newValue);
        localStorage.setItem('myAppSelectValue', newValue);
    };

    useEffect(() => {
        const fetchNews = async () => {
            const data = await getListNews();

            if (data && data.results) {
                setNews(data.results);
            }
        }

        fetchNews();
    }, [])

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await getCategories();

            setCategories(data.results);
        }

        fetchCategories();
    }, [])

    const filteredNews = selectedValue === 'all' || selectedValue === '' ? news : news.filter(item => 
        item.categories?.some(c => c.value.toString() === selectedValue.toString())
    );

    return (
        <>
        <div className="min-h-screen bg-[#f4f5f7] p-4 md:p-8 font-sans text-[#242424]">
            <div className="max-w-[1416px] mx-auto flex flex-col md:flex-row gap-8">
                <aside className="w-full md:w-64 bg-white rounded-2xl p-5 shadow-sm h-fit">
                    <nav className="flex flex-col gap-4">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                            Фильтры
                        </p>
                        
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Категория</label>
                            <div className="relative">
                                <select 
                                    aria-label="Выберите категорию"
                                    value={selectedValue} 
                                    onChange={handleChange} 
                                    className="w-full bg-[#f4f5f7] border-none rounded-xl px-4 py-3 text-sm appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none">
                                        <option value="all">
                                            Все новости
                                        </option>
                                    {categories.map((item) => (
                                        <option key={item.value} value={item.value}>
                                            {item.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </nav>
                </aside>
                
                <main className="flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredNews?.map((item) => (
                            <CartNews key={item.id} image={item.image?.toString().replace('http://localhost', '')} title={item.title!} content={item.content!} categories={item.categories}/>
                        ))}
                    </div>
                </main>
            </div>
        </div>
        </>
    );
};