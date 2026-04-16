import axios, { Axios } from "axios";
import { EditProfile } from "../types/edit_profile.interface";
import { News } from "../types/news.interface";
import { User } from "../types/user.interface";
import { UserLogin } from "../types/user_login.interface";
import { FormCreate, FormItem, FormSettings, QuizSession } from "../types/form.interface";

export const checkAuthStatus = async () => {
    try {
        const res = await axios.get(`/is_authenticated/`, {
            withCredentials: true, 
        });

        return res.data.is_authenticated ? res.data : null;
    } catch (error) {
        if (axios.isAxiosError(error)) {            
            if (error.response?.status === 401) {
                console.log("User не авторизован");
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

export const createForm = async (data: FormCreate, settings: FormSettings): Promise<boolean> => {
    try {
        const formData = new FormData();
        
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('status', data.status);
        
        if (data.deadline) {
            formData.append('deadline', data.deadline);
        }
        
        formData.append('settings', JSON.stringify(settings));
        
        const questionsForApi = data.questions.map((q, index) => ({
            id: q.id,
            text: q.text,
            type: q.type,
            is_required: q.is_required,
            points: q.points,
            order: index,
            choices: q.choices.map(choice => ({
                id: choice.id,
                text: choice.text,
                is_correct: choice.is_correct,
                order: choice.order
            })),
            has_media: !!q.media
        }));
        
        formData.append('questions', JSON.stringify(questionsForApi));

        data.questions.forEach((question, index) => {
            if (question.media && question.media.file) {
                formData.append(`question_media_${index}`, question.media.file);
            }
        });
        
        const res = await axios.post('/run-create-form/', formData, {
            withCredentials: true,
        });
        
        if (res.status === 201) {
            window.dispatchEvent(new Event("fetchFormsList"));
            return true;
        }
        
        return false;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка при создании формы:', error.response?.data || error.message);
        }
        return false;
    }
};

export const getMyFormsList = async (): Promise<FormItem[]> => {
    try {
        const res = await axios.get('/my-forms-list/', { 
            withCredentials: true 
        });

        return res.data.results || res.data || [];
    } catch(error) {
        if(axios.isAxiosError(error)){
            console.error('Ошибка при получение списка:', error.response?.data || error.message);
        }

        return [];
    }
};

export const getAllFormsList = async (): Promise<FormItem[]> => {
    try {
        const res = await axios.get('/all-forms-list/', {
            withCredentials: true
        });

        return res.data.results || res.data || [];
    } catch (error) {
        if (axios.isAxiosError(error)){
            console.error('Ошибка при получение списка:', error.response?.data || error.message);
        }

        return [];
    }
};

export const getFormDetail = async (slug: string) => {
    try{
        const res = await axios.get(`/form/${slug}/`, {
            withCredentials: true
        });

        return res.data.results || res.data;
    } catch (error) {
        if(axios.isAxiosError(error)) {
            console.error('Ошибка получение данных:', error);
        }
    }
}

export const submitQuizResults = async (slug: string, payload: QuizSession) => {
    try {
        const res = await axios.post(`/form/${slug}/submit/`, payload, {
            withCredentials: true
        });

        return res.data.results || res.data;
    } catch (error) {
        if(axios.isAxiosError(error)) {
            console.error('Ошибка при отправки', error);
        }
    }
}