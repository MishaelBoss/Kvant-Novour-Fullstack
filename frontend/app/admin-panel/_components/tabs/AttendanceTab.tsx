"use client";
import { useCallback, useEffect, useState } from "react";
import { IAttendance } from "@/app/types/attendance.interface";
import { getAttendanceList } from "@/app/lib/api";
import toast from "react-hot-toast";
import { IApiError } from "@/app/types/api-error.interface";

export function AttendanceTab() {
    const [records, setRecords] = useState<IAttendance[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAttendance = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getAttendanceList();
    
            const data = Array.isArray(res?.results) 
                ? res.results 
                : (Array.isArray(res?.data) ? res.data : []);
                
            setRecords(data);
        } catch (error) {
            const hasApiMarker = error !== null && typeof error === 'object' && 'isApiError' in error;

            if (hasApiMarker) {
                const apiError = error as IApiError;
                
                toast.error(apiError.message);
            } else toast.error("Произошла непредвиденная ошибка на клиенте");
            
            console.error("Ошибка:", error);
            
            setRecords([]);
        } finally {
            setLoading(false); 
        }
    }, []);

    useEffect(() => {
        const handleFetchEvent = async() => await fetchAttendance();
        handleFetchEvent();
    }, [fetchAttendance]);

    if (loading) {
        return (
            <main className="flex-1 bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 flex items-center justify-center">
                <div className="text-gray-400">Загрузка...</div>
            </main>
        );
    }

    return (
        <main className="flex-1 bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Посещаемость</h2>
                <span className="text-sm text-gray-500">{records.length} записей</span>
            </div>

            {records.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <p className="text-lg">Нет записей посещаемости</p>
                    <p className="text-sm mt-1">Данные появятся после того, как преподаватели начнут отмечать учеников.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="border-b border-gray-200 text-gray-500 uppercase text-xs tracking-wider">
                                <th className="pb-3 pr-4">Ученик</th>
                                <th className="pb-3 pr-4">Группа</th>
                                <th className="pb-3 pr-4">Дата</th>
                                <th className="pb-3 pr-4">Статус</th>
                                <th className="pb-3">Заметки</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((r) => (
                                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 pr-4 font-medium text-gray-900">{r.student_full_name || r.student_username}</td>
                                    <td className="py-3 pr-4 text-gray-600">{r.group_name}</td>
                                    <td className="py-3 pr-4 text-gray-600">{r.date}</td>
                                    <td className="py-3 pr-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            r.status === "present"
                                                ? "bg-green-100 text-green-800"
                                                : r.status === "late"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-red-100 text-red-800"
                                        }`}>
                                            {r.status === "present" ? "Присутствовал" : r.status === "late" ? "Опоздал" : "Отсутствовал"}
                                        </span>
                                    </td>
                                    <td className="py-3 text-gray-500">{r.notes || "—"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    );
}
