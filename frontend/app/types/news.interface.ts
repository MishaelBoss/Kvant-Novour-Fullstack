import { MediaType } from "./global.intefrace";

export type NewsType = 'text' | 'image' | 'file';
export type TextVariant = 'heading' | 'subheading' | 'body';

export interface IBlockImage {
    id: string;
    file: File | null;
    preview_url: string;
    caption: string;
}

export interface IBlockFile {
    id: string;
    file: File | null;
    name: string;
}

export interface INewsMedia {
    type: MediaType;
    file: File;
    preview_url: string;
}

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

export interface INewsTest {
    id: string;
    text?: string;
    type: NewsType;
    content?: string;
    categories?: ICategory[];
    image?: string | File | null;
    created_at?: string;
    media: INewsMedia | null;
    text_variant?: TextVariant;
    images?: IBlockImage[];
    files?: IBlockFile[];
}