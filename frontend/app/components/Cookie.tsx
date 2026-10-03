// interface Props {
//     open: boolean;
//     onClose: () => void;
// }

import { CookieIcon } from "lucide-react";

export function Cookie() {
    return (
        <div className="bg-[#2B2828] h-12 w-full rounded-t-xl w-3/4 p-12 fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 flex items-center justify-center">
            <div className="flex items-center gap-2 px-4 h-full">
                <CookieIcon className="w-12 h-12 text-white" />
                <h1 className="text-white text-lg font-semibold w-3/4">
                    Для улучшения работы сайта и его взаимодействия с пользователями мы используем файлы cookie.
                    Продолжая работу с сайтом, Вы разрешаете использование cookie-файлов.
                    Вы всегда можете отключить файлы cookie в настройках Вашего браузера.
                </h1>
                <button className="w-32 h-12 ml-auto bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors">
                    Принять
                </button>
            </div>
        </div>
    );
}