export interface IGroup{
    id: number;
    name: string;
    teacher: string;
    students: string;
    created_at?: string;
}

export interface IStudyGroupResponse {
    results: IGroup[];
    count: number;
}