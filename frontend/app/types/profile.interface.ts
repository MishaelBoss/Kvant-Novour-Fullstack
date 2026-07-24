export interface IPublicProfileData {
    username: string;
    first_name: string;
    last_name?: string;
    middle_name?: string | null;
    date_joined: string;
    avatar: string | null;
    role: string;
}