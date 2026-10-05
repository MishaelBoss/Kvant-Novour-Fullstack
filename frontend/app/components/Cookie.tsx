"use client";
import { AnimatePresence, motion } from "framer-motion";
import { CookieIcon } from "lucide-react";
import { useState } from "react";

export function Cookie() {
    const [isOpen, setIsOpen] = useState<boolean>(() => {
        if (typeof window !== "undefined") {
            const isAccepted = localStorage.getItem("kvant-cookie-consent");
            return isAccepted !== "accepted";
        }
        return false;
    });

    const handleClose = () => {
        if (typeof window !== "undefined") {
            localStorage.setItem("kvant-cookie-consent", "accepted");
        }
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

                    className="bg-[#070707] h-auto sm:h-12 w-full rounded-t-xl py-4 sm:py-12 px-2 sm:px-12 fixed bottom-0 left-1/2 z-50 flex items-center justify-center"
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-2 px-1 sm:px-4 h-full w-full">
                        <CookieIcon className="w-10 h-10 sm:w-12 sm:h-12 text-white shrink-0 hidden sm:block" />
                        <h1 className="text-white text-[clamp(9px,2vw,18px)] leading-tight sm:leading-normal sm:text-lg font-semibold w-full sm:w-3/4">
                            Для улучшения работы сайта и его взаимодействия с пользователями мы используем файлы cookie. 
                            Продолжая работу с сайтом, Вы разрешаете использование cookie-файлов. 
                            Вы всегда можете отключить файлы cookie в настройках Вашего браузера.
                        </h1>
                        <button 
                            onClick={handleClose}
                            className="w-full sm:w-32 h-9 sm:h-12 sm:ml-auto mt-1 sm:mt-0 bg-blue-600 text-white font-semibold text-[clamp(10px,2vw,16px)] sm:text-base px-2 sm:px-3 py-1 rounded-xl hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
                        >
                            ПРИНЯТЬ
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}