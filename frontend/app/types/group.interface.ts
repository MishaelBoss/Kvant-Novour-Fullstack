export interface IAttendanceRecord {
    id: number;
    date: string;
    status: 'present' | 'absent' | 'late';
    notes?: string | null;
}

export interface IGroupMember {
    id: number;
    username: string;
    full_name: string;
    membership_id?: number | null;
    membership_status?: string | null;
    attendance?: IAttendanceRecord[];
}

export interface IGroupMembership {
    id: number;
    status: 'active' | 'completed' | 'failed' | 'left';
    joined_at: string;
    completed_at?: string | null;
    group_id: number;
    group_name: string;
    course?: string;
    module_type?: string;
    student_id?: number;
    student_username?: string;
    student_full_name?: string;
}

export interface IGroup{
    id: number;
    slug?: string;
    name: string;
    course?: string;
    module_type?: string;
    teacher: string;
    created_at?: string;
    teacher_id?: number;
    students_ids?: number[];
    students_count?: number;
    students?: IGroupMember[];
    max_students?: number | null;
    start_date?: string | null;
    end_date?: string | null;
    can_manage?: boolean;
    is_admin?: boolean;
}

export interface IStudyGroupResponse {
    results: IGroup[];
    count: number;
}

export interface IGroupHistoryResponse {
    results: IGroupMembership[];
}