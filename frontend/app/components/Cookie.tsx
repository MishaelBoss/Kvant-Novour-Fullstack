"use client";
import { AnimatePresence, motion } from "framer-motion";
import { CookieIcon } from "lucide-react";
import { useState } from "react";

export function Cookie() {
    const [isOpen, setIsOpen] = useState(() => {
        if (typeof window !== 'undefined') {
            const isAccepted = localStorage.getItem("cookie_accepted");
            return !isAccepted;
        }
        return false;
    });

    const handleClose = () => {
        localStorage.setItem("cookie_accepted", "true");
        setIsOpen(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ y: "120%", x: "-50%", opacity: 0 }}
                    animate={{ y: 0, x: "-50%", opacity: 1 }}

                    exit={{ y: "120%", x: "-50%", opacity: 0 }}

                    transition={{ type: "spring", stiffness: 120, damping: 18 }}
                    
                    className="bg-[#070707] h-12 w-full rounded-t-xl p-12 fixed bottom-0 left-1/2 z-50 flex items-center justify-center"
                >
                    <div className="flex items-center gap-2 px-4 h-full">
                        <CookieIcon className="w-12 h-12 text-white" />
                        <h1 className="text-white text-lg font-semibold w-3/4">
                            Для улучшения работы сайта и его взаимодействия с пользователями мы используем файлы cookie. 
                            Продолжая работу с сайтом, Вы разрешаете использование cookie-файлов. 
                            Вы всегда можете отключить файлы cookie в настройках Вашего браузера.
                        </h1>
                        <button 
                            onClick={handleClose}
                            className="w-32 h-12 ml-auto bg-blue-600 text-white font-semibold text-wid px-3 py-1 rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
                        >
                            ПРИНЯТЬ
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}