"use client";

import { motion } from "framer-motion";

export function AttendanceTab() {
    return (
        <main className="flex-1 bg-white rounded-[24px] p-6 md:p-10 shadow-sm border border-gray-100">
            <div className="flex flex-col items-center justify-center min-h-[500px] h-full py-12 px-4 text-center select-none">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                        opacity: 1, 
                        y: [0, -12, 0],
                    }}
                    transition={{
                        opacity: { duration: 0.6, ease: "easeOut" },
                        y: {
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }
                    }}
                    whileHover={{ scale: 1.03 }}
                    className="relative mb-8 cursor-pointer w-[280px] h-[280px] flex items-center justify-center"
                >
                    <svg
                        viewBox="0 0 200 200"
                        className="w-full h-full drop-shadow-[0_20px_40px_rgba(79,70,229,0.06)]"
                        fill="none"
                        xmlns="http://w3.org"
                    >
                        <circle cx="100" cy="100" r="75" fill="#F5F7FF" />
                        <circle cx="100" cy="100" r="55" fill="#EEF2FF" />
                        
                        <line x1="60" y1="140" x2="140" y2="140" stroke="#E2E8F0" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="60" y1="115" x2="140" y2="115" stroke="#F1F5F9" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="60" y1="90" x2="140" y2="90" stroke="#F1F5F9" strokeWidth="1.5" strokeLinecap="round" />
                        
                        <rect x="65" y="110" width="12" height="30" rx="4" fill="#C7D2FE" />
                        <rect x="83" y="85" width="12" height="55" rx="4" fill="#93C5FD" />
                        <rect x="101" y="100" width="12" height="40" rx="4" fill="#60A5FA" />
                        <rect x="119" y="75" width="12" height="65" rx="4" fill="#3B82F6" />
                        
                        <path 
                            d="M 60 122 Q 85 95, 105 88 T 132 60" 
                            stroke="#4F46E5" 
                            strokeWidth="4" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        />
                        
                        <g transform="translate(118, 46)">
                            <circle cx="14" cy="14" r="15" fill="#4F46E5" stroke="#FFFFFF" strokeWidth="2" />
                            <path 
                                d="M8.5 14 L12 17.5 L19.5 10" 
                                stroke="white" 
                                strokeWidth="2.5" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                            />
                        </g>

                        <circle cx="50" cy="72" r="3.5" fill="#818CF8" />
                        <circle cx="152" cy="112" r="4.5" fill="#A5B4FC" />
                    </svg>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    className="space-y-2 max-w-sm"
                >
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight sm:text-2xl">
                        Раздел в разработке
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Мы уже создаем этот функционал. Скоро здесь появится удобная статистика и учет посещаемости.
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 flex gap-2 justify-center items-center h-2"
                >
                    {[0, 1, 2].map((index) => (
                        <motion.span
                            key={index}
                            animate={{
                                scale: [1, 1.4, 1],
                                opacity: [0.4, 1, 0.4]
                            }}
                            transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                delay: index * 0.2,
                                ease: "easeInOut"
                            }}
                            className="w-2 h-2 rounded-full bg-indigo-600"
                        />
                    ))}
                </motion.div>
            </div>
        </main>
    );
}
