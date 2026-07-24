export interface ICategory{
    value: number;
    label: string;
    slug?: string;
}

export interface INews {
    id?: number;
    title?: string;
    content?: string;
    categories?: ICategory[];
    image?: string | File | null;
    created_at?: string;
    form_slug: string;
    form_id: number;
}

export interface INewsCreateInput extends Omit<INews, 'categories' | 'form_slug' | 'form_id'> {
    category_ids?: number[];
    form_slug?: string;
    form_id?: number;
}