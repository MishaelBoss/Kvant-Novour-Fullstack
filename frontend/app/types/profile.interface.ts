export interface IPublicProfileData {
    username: string;
    first_name: string;
    last_name?: string;
    date_joined: string;
    avatar: string | null;
    role: string;
}