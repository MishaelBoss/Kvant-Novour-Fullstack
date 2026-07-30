export interface IUser {
    id: number;
    role?: 'user' | 'teacher' | 'admin';
    is_admin?: boolean;
    is_teacher?: boolean;
    username?: string;
    first_name?: string;
    last_name?: string;
    middle_name?: string | null;
    email?: string;
    phone?: string;
    avatar?: string | null;
    date_joined?: string | undefined;
    is_authenticated: boolean;
    password?: string; 
}

export interface IUserResponse {
    results: IUser[];
    count: number;
}

export interface IEditProfile extends Pick<IUser, 'username' | 'first_name' | 'last_name' | 'middle_name' | 'phone' | 'email' | 'avatar'> {}

export interface IUserLogin {
    username: string;
    password: string;
}

export interface IUserRegister {
    username: NonNullable<IUser['username']>;
    email: NonNullable<IUser['email']>;
    first_name: NonNullable<IUser['first_name']>;
    last_name: NonNullable<IUser['last_name']>;
    middle_name?: IUser['middle_name'];
    password: string;
    confirmPassword: string;
}

export interface IAvatarResponse {
    message: string;
    user: Required<Pick<IUser, 'avatar'>>;
}