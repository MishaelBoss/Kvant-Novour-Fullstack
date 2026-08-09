export interface IGroupMember {
    id: number;
    username: string;
    full_name: string;
}

export interface IGroup{
    id: number;
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
}

export interface IStudyGroupResponse {
    results: IGroup[];
    count: number;
}