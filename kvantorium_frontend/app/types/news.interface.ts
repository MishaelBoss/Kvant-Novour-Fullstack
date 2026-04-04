import { Category } from "./category.interface";

export interface News {
    id?: number;
    title?: string;
    content?: string;
    categories?: Category[];
    image?: string | File | null;
    created_at?: string;
}