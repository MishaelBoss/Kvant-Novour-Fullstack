export interface IGroup{
    id: number;
    name: string;
    teacher: string;
    created_at?: string;
    teacher_id?: number;
    students_ids?: number[];
}

export interface IStudyGroupResponse {
    results: IGroup[];
    count: number;
}