import axios from "axios";
import { EditProfile } from "../types/edit_profile.interface";
import { News } from "../types/news.interface";
import { User } from "../types/user.interface";
import { UserLogin } from "../types/user_login.interface";

export const checkAuthStatus = async () => {
    try {
        const res = await axios.get(`/is_authenticated/`, {
            withCredentials: true, 
        });

        return res.data.is_authenticated ? res.data : null;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Ошибка API:", error.response?.data || error.message);
            
            if (error.response?.status === 401) {
                return null;
            }
        } else {
            console.error("Неизвестная ошибка:", error);
        }
        return null;
    }
};

export const login = async (data: UserLogin): Promise<boolean> => {
    try{
        const res = await axios.post(`/login/`, data, {
            withCredentials: true, 
        });

        if (res.status >= 200 || res.status < 300){
            window.dispatchEvent(new Event("fetchUser"));
            return true; 
        };

        return false;
    } catch (error){
        if (axios.isAxiosError(error)) {
            console.error('Ошибка входа:', error.response?.data || error.message);
        }
        return false;
    }
};

export const register = async (data: UserLogin): Promise<boolean> => {
    try{
        const res =  await axios.post(`/register/`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true, 
        });

        if (res.status === 200 || res.status === 201){
            window.dispatchEvent(new Event("fetchUser"));
            return true;
        };

        return false;
    } catch (error){
        if (axios.isAxiosError(error)) {
            console.error('Ошибка регистрации:', error.response?.data || error.message);
        }
        return false;
    }
};

export const getProfile = async (): Promise<User> => {
    try{
        const res = await axios.get(`/my-profile/`, {
            withCredentials: true, 
        });

        if (res.status === 401) {
            console.warn("Пользователь не авторизован (401)");
            return { is_authenticated: false }
        }

        const data = await res.data;

        return {
            ...data, 
            is_authenticated: true 
        };
    } catch (error){
        if (axios.isAxiosError(error)) {
            console.error('Ошибка при получений данных:', error.response?.data || error.message);
        }
        return {
            is_authenticated: false
        }
    }
};

export const editProfile = async (data: EditProfile): Promise<boolean> => {
    try{
        const res = await axios.patch(`/edit-profile/`, data, {
            withCredentials: true, 
        })

        if (res.status === 200 || res.status === 201) {
            window.dispatchEvent(new Event("fetchUser"));
            return true;
        }

        return false;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка при редактирования:', error.response?.data || error.message);
        }
        return false;
    }
}

export const logout = async () => {
    try{
        const res = await axios.post(`/logout/`, {
            withCredentials: true, 
        })

        if (res.status === 201){
            window.dispatchEvent(new Event("fetchUser"));
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка выхода из аккаунта:', error.response?.data || error.message);
        }
    }
}

export const createNews = async (data: News): Promise<boolean> => {
    try {
        const formData = new FormData();

        if (data.title) formData.append('title', data.title);
        if (data.content) formData.append('content', data.content);

        if (data.image instanceof File) {
            formData.append('image', data.image);
        }

        if (Array.isArray(data.categories)) {
            data.categories.forEach((c) => {
                formData.append('categories', c.value.toString());
            });
        }

        const res = await axios.post(`/run-create-news/`, formData, {
            withCredentials: true,
        })

        if(res.status === 201){
            window.dispatchEvent(new Event("fetchListNews"));
            return true;
        }

        return false;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка при создание:', error.response?.data || error.message);
        }
        return false;
    }
}

export const getCategories = async () => {
    try {
        const res = await axios.get(`/categories-list/`, {
            withCredentials: true
        })

        if (res.status === 200) {
            const data = await res.data;
            return data;
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка получения списка:', error.response?.data || error.message);
        }
    }
}

export const getListNews = async () => {
    try {
        const res = await axios.get(`/news-list/`, {
            withCredentials: true
        })

        return await res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка получения списка:', error.response?.data || error.message);
        }
        return { 
            results: [], 
            count: 0 
        };
    }
}

export const deleteNews = async (id: number | undefined) => {
    if(!id) {
        console.error('ID новостей 0, такого не должно');
        return;
    }

    try{
        const res = await axios.delete(`/news-delete/${id}/`, {
            withCredentials: true
        })

        if (res.status >= 200 && res.status < 300) {
            window.dispatchEvent(new Event("fetchListNews"));
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка удаления:', error.response?.data || error.message);
        }
    }
}

export const getListUsers = async () => {
    try {
        const res = await axios.get(`/users-list/`, {
            withCredentials: true
        })

        return await res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка получения списка:', error.response?.data || error.message);
        }
        return { 
            results: [], 
            count: 0 
        };
    }
}

export const deleteUser = async (id: number | undefined) => {
    if(!id) {
        console.error('ID пользователя 0, такого не должно');
        return;
    }
    
    try {
        const res = await axios.delete(`/user-delete/${id}/`, {
            withCredentials: true
        })

        if (res.status >= 200 && res.status < 300) {
            window.dispatchEvent(new Event("fetchListUsers"));
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка удаления:', error.response?.data || error.message);
        }
    }
}

export const createUser = async (data: User): Promise<boolean> => {
    try{
        const formData = new FormData();

        if (data.username) formData.append('username', data.username);
        if (data.password) formData.append('password', data.password);
        if (data.first_name) formData.append('first_name', data.first_name);
        if (data.last_name) formData.append('last_name', data.last_name);
        if (data.middle_name) formData.append('middle_name', data.middle_name);
        if (data.phone) formData.append('phone', data.phone);
        if (data.email) formData.append('email', data.email);
        if (data.role) formData.append('role', data.role)

            console.log("FormData role:", formData.get('role')); 

        const res = await axios.post(`/run-create-user/`, formData, {
            withCredentials: true
        })

        if(res.status === 201){
            window.dispatchEvent(new Event("fetchListUsers"));
            return true;
        }

        return false;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка при создание:', error.response?.data || error.message);
        }
        return false;
    }
}