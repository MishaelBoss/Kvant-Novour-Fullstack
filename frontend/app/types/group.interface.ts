export interface IGroup{
    id: number;
    slug?: string;
    name: string;
    course?: string;
    module_type?: string;
    teacher: string;
    created_at?: string;
    teacher_id?: number;
    max_students?: number | null;
    start_date?: string | null;
    end_date?: string | null;
    start_time?: string | null;
    can_manage?: boolean;
    is_admin?: boolean;
}

export interface IStudyGroupResponse {
    results: IGroup[];
    count: number;
}