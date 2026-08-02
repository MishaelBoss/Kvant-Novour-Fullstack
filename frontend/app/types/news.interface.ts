import { MediaType } from "./global.interface";

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

export interface ICategory {
    value: number;
    label: string;
    slug?: string;
}

export interface ICategoryResponse {
    results: ICategory[];
}

export interface INews {
    id: number;
    title: string;
    content?: string;
    categories?: ICategory[];
    image?: string | File | null;
    created_at?: string;
    slug: string;
    views: number;
    form_id: number;
}

export interface INewsResponse {
    results: INews[];
    count: number
}

export interface INewsCreateInput extends Omit<INews, 'categories' | 'slug' | 'form_id'> {
    category_ids?: number[];
    slug?: string;
    form_id?: number;
}

export interface INewsSettings {
    comments: boolean;
    for_authorized_users: boolean;
    pinned: boolean;
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
    image_display_mode?: 'grid' | 'carousel';
    carousel_interval?: number;
}