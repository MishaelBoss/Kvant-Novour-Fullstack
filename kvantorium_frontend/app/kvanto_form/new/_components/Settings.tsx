'use client';

import { FormSettings } from "@/app/types/form.interface";

interface SettingsProps {
    settings: FormSettings;
    updateSettings: (patch: Partial<FormSettings>) => void;
}

const TIMER_PRESETS = [
    { label: '15 минут', value: 900 },
    { label: '30 минут', value: 1800 },
    { label: '45 минут', value: 2700 },
    { label: '1 час', value: 3600 },
    { label: '1.5 часа', value: 5400 },
    { label: '2 часа', value: 7200 },
];

function formatTime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h} ч ${m} мин`;
    return `${m} мин`;
}

export function Settings ({settings, updateSettings}: SettingsProps) {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Таймер</p>
                <label className="flex items-center justify-between cursor-pointer">
                    <div>
                        <p className="text-sm text-gray-700">Включить таймер</p>
                        <p className="text-xs text-gray-400 mt-0.5">Участник видит обратный отсчёт</p>
                    </div>
                    <div
                        onClick={() => updateSettings({ timer_enabled: !settings.timer_enabled })}
                        className={`relative w-10 h-6 rounded-full transition-colors cursor-pointer ${
                            settings.timer_enabled ? 'bg-blue-500' : 'bg-gray-200'
                        }`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                            settings.timer_enabled ? 'left-5' : 'left-1'
                        }`}/>
                    </div>
                </label>

                {settings.timer_enabled && (
                    <div className="flex flex-col gap-2">
                        <label htmlFor="timer-range" className="text-sm text-gray-600">
                            Длительность: <span className="font-medium text-gray-800">{formatTime(settings.timer_seconds)}</span>
                        </label>
                        <input
                            id="timer-range"
                            type="range"
                            min={300}
                            max={7200}
                            step={300}
                            value={settings.timer_seconds}
                            onChange={e => updateSettings({ timer_seconds: Number(e.target.value) })}
                            className="w-full accent-blue-500 cursor-pointer"
                        />
                        <div className="flex gap-2 flex-wrap mt-1">
                            {TIMER_PRESETS.map(preset => (
                                <button
                                    key={preset.value}
                                    type="button"
                                    onClick={() => updateSettings({ timer_seconds: preset.value })}
                                    className={`px-3 py-1 text-xs rounded-lg border transition-colors cursor-pointer ${
                                        settings.timer_seconds === preset.value
                                            ? 'bg-blue-50 border-blue-300 text-blue-600 font-medium'
                                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                    }`}>
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="h-px bg-gray-100" />
            <div className="flex flex-col gap-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Прохождение</p>
                <label className="flex items-center justify-between cursor-pointer">
                    <div>
                        <p className="text-sm text-gray-700">По одному вопросу на странице</p>
                        <p className="text-xs text-gray-400 mt-0.5">Участник не видит все вопросы сразу</p>
                    </div>
                    <div
                        onClick={() => updateSettings({ one_question_per_page: !settings.one_question_per_page })}
                        className={`relative w-10 h-6 rounded-full transition-colors cursor-pointer ${
                            settings.one_question_per_page ? 'bg-blue-500' : 'bg-gray-200'
                        }`}
                    >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                            settings.one_question_per_page ? 'left-5' : 'left-1'
                        }`}/>
                    </div>
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                    <div>
                        <p className="text-sm text-gray-700">Показывать результат после прохождения</p>
                        <p className="text-xs text-gray-400 mt-0.5">Участник увидит свой балл сразу</p>
                    </div>
                    <div
                        onClick={() => updateSettings({ show_results_after: !settings.show_results_after })}
                        className={`relative w-10 h-6 rounded-full transition-colors cursor-pointer ${
                            settings.show_results_after ? 'bg-blue-500' : 'bg-gray-200'
                        }`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                            settings.show_results_after ? 'left-5' : 'left-1'
                        }`}/>
                    </div>
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                    <div>
                        <p className="text-sm text-gray-700">Анкета перед стартом</p>
                        <p className="text-xs text-gray-400 mt-0.5">ФИО, школа, класс — обязательно для участника</p>
                    </div>
                    <div
                        onClick={() => updateSettings({ require_profile: !settings.require_profile })}
                        className={`relative w-10 h-6 rounded-full transition-colors cursor-pointer ${
                            settings.require_profile ? 'bg-blue-500' : 'bg-gray-200'
                        }`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                            settings.require_profile ? 'left-5' : 'left-1'
                        }`}/>
                    </div>
                </label>
            </div>
        </div>
    );
}