import { Category } from "./category.interface";

export interface News {
    id?: number;
    title?: string;
    content?: string;
    categories?: Category[];
    image?: string | File | null;
    created_at?: string;
    form_slug: string;
    form_id: number;
}

export interface NewsCreateInput extends Omit<News, 'categories'> {
    category_ids?: number[];
}