'use client';

import { CartNews } from "@/app/components/CartNews";
import { CartNewsSkeleton } from "@/app/components/CartNewsSkeleton";
import { getCategories, getListNews } from "@/app/lib/api";
import { ICategory, INews } from "@/app/types/news.interface";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export default function NewsContent() {
    const [categories, setCategories] = useState<ICategory[]>([]); 
    const [selectedValue, setSelectedValue] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            const savedValue = localStorage.getItem('myAppSelectValue');
            return savedValue || 'all';
        }
        return 'all';
    });
    const [news, setNews] = useState<INews[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = event.target.value;
        setSelectedValue(newValue);
        localStorage.setItem('myAppSelectValue', newValue);
    };

    const fetchNews = useCallback(async () => {
        const [resListNews, resCategories] = await Promise.all([
            getListNews(),
            getCategories()
        ])

        if (Array.isArray(resListNews?.results)) {
            setNews(resListNews.results);
        } else {
            setNews([]);
        }
        if (Array.isArray(resCategories?.results)) {
            setCategories(resCategories.results);
        } else {
            setCategories([]);
        }
    }, []);

    useEffect(() => {
        const init = async () => {
            setIsLoading(true); 
            try {
                await fetchNews();
            }
            catch (error) {
                console.error('Error fetching news:', error);
            } finally {
                setIsLoading(false);
            }
        };

        init();
    }, [fetchNews])

    const filteredNews = selectedValue === 'all' || selectedValue === '' ? news : news.filter(item => 
        item.categories?.some(c => c.value.toString() === selectedValue.toString())
    );

    return (
        <>
        <div className="min-h-screen bg-[#f4f5f7] p-4 md:p-8 font-sans text-[#242424]">
            <div className="max-w-354 mx-auto flex flex-col md:flex-row gap-8">
                <aside className="w-full md:w-64 bg-white rounded-2xl p-5 shadow-sm h-fit">
                    <nav className="flex flex-col gap-4">
                        <p className="text-sm font-bold uppercase text-[#717171] tracking-wider">
                            Фильтры
                        </p>
                        
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Категория</label>
                            <div className="relative">
                                <select 
                                    aria-label="Выберите категорию"
                                    value={selectedValue} 
                                    onChange={handleChange} 
                                    disabled={isLoading}
                                    className="w-full bg-[#f4f5f7] border-none rounded-xl px-4 py-3 text-sm appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none">
                                        <option value="all">
                                            {isLoading ? 'Загрузка...' : 'Все новости'}
                                        </option>
                                    {!isLoading && categories.map((item) => (
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
                        {isLoading ? (
                            Array.from({ length: 6 }).map((_, index) => (
                                <CartNewsSkeleton key={index} />
                            ))
                        ) : filteredNews.length > 0 ? (
                            <>
                            {filteredNews?.map((item) => (
                                <CartNews 
                                    key={item.id} 
                                    image={item.image?.toString().replace('http://localhost', '')} 
                                    title={item.title!} content={item.content!} 
                                    categories={item.categories} 
                                    slug={item.form_slug}
                                />
                            ))}
                            </>
                        ) : (
                            <>
                            <div className="flex flex-col items-center justify-center text-center py-12 col-span-full">
                                <Image
                                    src="/undraw_no-data_ig65.svg"
                                    width={200}
                                    height={200}
                                    alt="Ничего не найдено"
                                    className="mx-auto mb-4"
                                    priority
                                />
                                <p className="text-gray-500 text-lg">Новостей не найдено</p>
                            </div>
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
        </>
    );
};