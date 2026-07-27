"use client";
import { INewsSettings } from "@/app/types/news.interface";

interface Props {
    settings: INewsSettings;
    updateSettings: (patch: Partial<INewsSettings>) => void;
}

export function Settings ({settings, updateSettings}: Props) {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Прохождение</p>
                <label className="flex items-center justify-between cursor-pointer">
                    <div>
                        <p className="text-sm text-gray-700">Разрешить писать комментарии</p>
                        <p className="text-xs text-gray-400 mt-0.5">Пользователь может оставить под вашу новость комментарий</p>
                    </div>
                    <div
                        onClick={() => updateSettings({ comments: !settings.comments })}
                        className={`relative w-10 h-6 rounded-full transition-colors cursor-pointer ${
                            settings.comments ? 'bg-blue-500' : 'bg-gray-200'
                        }`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                            settings.comments ? 'left-5' : 'left-1'
                        }`}/>
                    </div>
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                    <div>
                        <p className="text-sm text-gray-700">Новости для авторизованных</p>
                        <p className="text-xs text-gray-400 mt-0.5">Только зарегистрированные пользователи читать вашу новость</p>
                    </div>
                    <div
                        onClick={() => updateSettings({ for_authorized_users: !settings.for_authorized_users })}
                        className={`relative w-10 h-6 rounded-full transition-colors cursor-pointer ${
                            settings.for_authorized_users ? 'bg-blue-500' : 'bg-gray-200'
                        }`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                            settings.for_authorized_users ? 'left-5' : 'left-1'
                        }`}/>
                    </div>
                </label>
            </div>
        </div>
    );
}