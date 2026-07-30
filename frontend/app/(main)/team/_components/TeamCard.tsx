"use client";
import Image from "next/image";
import { IPersonalData } from "@/app/data/personalData";

export function TeamCard({ person }: { person: IPersonalData }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group">
            <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                {person.photo ? (
                    <Image src={person.photo} alt={person.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" className="opacity-60">
                                <circle cx="12" cy="8" r="4" />
                                <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
                            </svg>
                        </div>
                    </div>
                )}
                {person.courses.length > 0 && (
                    <div className="absolute top-3 right-3 flex flex-wrap gap-1.5 justify-end">
                        {person.courses.map(course => (
                            <span key={course} className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-white/90 backdrop-blur-sm text-gray-700 shadow-sm">
                                {course === 'it' && 'IT'}
                                {course === 'prom' && 'Промробо'}
                                {course === 'hi-tech' && 'Hi-Tech'}
                                {course === 'vr-ar' && 'VR/AR'}
                                {course === 'chess' && 'Шахматы'}
                                {course === 'english' && 'Английский'}
                                {course === 'mathematics' && 'Математика'}
                            </span>
                        ))}
                    </div>
                )}
            </div>
            <div className="p-5 flex flex-col flex-1">
                <h3 className="text-[16px] font-bold text-gray-900 leading-tight mb-1">
                    {person.name}
                </h3>
                <p className="text-[13px] font-medium text-[#005bff] mb-3">
                    {person.role}
                </p>
                <p className="text-[13px] text-gray-500 leading-relaxed flex-1">
                    {person.description}
                </p>
            </div>
        </div>
    );
}
