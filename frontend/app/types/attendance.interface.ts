export interface IAttendance {
    id: number;
    student: number;
    student_username: string;
    student_full_name: string;
    group: number;
    group_name: string;
    date: string;
    status: "present" | "absent" | "late";
    notes: string | null;
}

export interface IAttendanceResponse {
    results?: IAttendance[];
    data?: IAttendance[];
}