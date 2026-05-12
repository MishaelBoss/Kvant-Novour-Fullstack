export interface User {
    id?: number;
    role?: 'student' | 'parent' | 'user' | 'teacher' | 'admin';
    is_admin?: boolean;
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

export interface UserLogin {
    username: string;
    password: string;
}

export interface UserRegister {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    middle_name: string;
    password: string;
    confirmPassword: string;
}