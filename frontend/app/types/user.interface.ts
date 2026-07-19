export interface IUser {
    id?: number;
    role?: 'student' | 'parent' | 'user' | 'teacher' | 'admin';
    is_admin?: boolean;
    is_teacher?: boolean;
    username?: string;
    first_name?: string;
    last_name?: string;
    middle_name?: string;
    email?: string;
    phone?: string;
    avatar?: string | null;
    date_joined?: string | undefined;
    is_authenticated: boolean;
    password?: string; 
}

export interface IEditProfile {
    username: string;
    first_name: string;
    last_name: string;
    middle_name: string;
    phone: string;
    email: string;
    avatar?: string | File | null;
}

export interface IUserLogin {
    username: string;
    password: string;
}

export interface IUserRegister {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    middle_name: string;
    password: string;
    confirmPassword: string;
}