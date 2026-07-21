import axios from "axios";
import { FullResponseDetail } from "../kvanto_form/[slug]/responses/[responseId]/page";
import { IEditProfile, IUser, IUserLogin, IUserRegister } from "../types/user.interface";
import { INewsCreateInput } from "../types/news.interface";
import { IFormCreate, IFormSettings, IQuizSession } from "../types/form.interface";
import { ParamValue } from "next/dist/server/request/params";

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

export const login = async (data: IUserLogin) => {
    try{
        const res = await axios.post(`/login/`, data, {
            withCredentials: true, 
        });

        if (res.status >= 200 || res.status < 300){
            window.dispatchEvent(new Event("fetchUser"));
            return;
        };

        throw new Error("Ошибка входа");
    } catch (error){
        if (axios.isAxiosError(error) && error.response?.data) {
            throw error;
        }
        throw error;
    }
};

export const register = async (data: IUserRegister) => {
    try{
        const res =  await axios.post(`/register/`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true, 
        });

        if (res.status === 200 || res.status === 201){
            window.dispatchEvent(new Event("fetchUser"));
            return;
        };

        throw new Error("Ошибка регистрации");
    } catch (error){
        if (axios.isAxiosError(error) && error.response?.data) {
            console.error('Ошибка при регистрации:', error.response.data || error.message);
            throw error;
        }
        throw error;
    }
};

export const editProfile = async (data: IEditProfile) => {
    try{
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                formData.append(key, value as string | Blob);
            }
        });

        const res = await axios.patch(`/edit-profile/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true, 
        })

        if (res.status === 200 || res.status === 201) {
            window.dispatchEvent(new Event("fetchUser"));
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка при редактирования:', error.response?.data || error.message);
            throw error;
        }
        throw error;
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

export const getPublicProfile = async(username: ParamValue) => {
    try {
        const res = await axios.get(`/profile/${username}/`, {
            withCredentials: true
        });

        return res.data;
    } catch (error) {
        if(axios.isAxiosError(error)) {
            console.error('Ошибка получение публичного профиля:', error.response?.data || error.message);
            throw error;
        }
        throw error;
    }
}

export const createNews = async (data: INewsCreateInput): Promise<boolean> => {
    try {
        const formData = new FormData();

        if (data.title) formData.append('title', data.title);
        if (data.content) formData.append('content', data.content);

        if (data.image instanceof File) {
            formData.append('image', data.image);
        }

        if (Array.isArray(data.category_ids)) {
            data.category_ids.forEach((id) => {
                formData.append('categories', id.toString());
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

        return res.data;
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

export const updateUserByAdmin = async (id: number, data: Partial<IUser>): Promise<boolean> => {
    try {
        const payload: Record<string, string> = {};
        if (data.username !== undefined) payload.username = data.username;
        if (data.first_name !== undefined) payload.first_name = data.first_name;
        if (data.last_name !== undefined) payload.last_name = data.last_name;
        if (data.middle_name !== undefined) payload.middle_name = data.middle_name;
        if (data.phone !== undefined) payload.phone = data.phone;
        if (data.email !== undefined) payload.email = data.email;
        if (data.role !== undefined) payload.role = data.role;

        const res = await axios.patch(`/user-update/${id}/`, payload, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        });

        if (res.status === 200) {
            window.dispatchEvent(new Event("fetchListUsers"));
            return true;
        }
        return false;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error;
        }
        return false;
    }
}

export const createUser = async (data: IUser): Promise<boolean> => {
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

export const createForm = async (data: IFormCreate, settings: IFormSettings, newsImage?: File | null): Promise<boolean> => {
    try {
        const formData = new FormData();
        
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('status', data.status);

        if (newsImage) {
            formData.append('news_image', newsImage);
        }
        
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
            return res.data;
        }
        
        return false;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка при создании формы:', error.response?.data || error.message);
        }
        return false;
    }
};

export const updateForm = async (id: number, data: IFormCreate, settings: IFormSettings, newsImage?: File | null) => {
    try {
        const formData = new FormData();

        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('status', data.status);

        if (newsImage) {
            formData.append('news_image', newsImage);
        }

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

        const res = await axios.put(`/form/${id}/update/`, formData, {
            withCredentials: true,
        });

        return res.status === 200;
    } catch (error) {
        if(axios.isAxiosError(error)) {
            console.error('Неудалось обновить форму', error.response?.data || error.message);
        }
        return false;
    }
};

export const getMyFormsList = async () => {
    try {
        const res = await axios.get('/my-forms-list/', { 
            withCredentials: true 
        });

        return res.data;
    } catch(error) {
        if(axios.isAxiosError(error)){
            console.error('Ошибка при получение списка:', error.response?.data || error.message);
        }

        return {
            results: [],
            count: 0
        }
    }
};

export const getAllFormsList = async () => {
    try {
        const res = await axios.get('/all-forms-list/', {
            withCredentials: true
        });

        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)){
            console.error('Ошибка при получение списка:', error.response?.data || error.message);
        }

        return {   
            results: [],
            count: 0
        }
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
            console.error('Ошибка получение данных:', error.response?.data || error.message);
        }
    }
}

export const submitQuizResults = async (slug: string, payload: IQuizSession) => {
    try {
        const res = await axios.post(`/form/${slug}/submit/`, payload, {
            withCredentials: true
        });

        return res.data.results || res.data;
    } catch (error) {
        if(axios.isAxiosError(error)) {
            console.error('Ошибка при отправки', error.response?.data || error.message);
        }
    }
}

export async function submitFormResponse(slug: string, session: IQuizSession): Promise<{
    response_id: number;
    auto_score: number;
    max_score: number;
    show_results_after: boolean;
}> {
    const res = await axios.post(`/form/${slug}/submit/`, session, {
        withCredentials: true,
    });

    return res.data.results || res.data;
}

export const deleteForm = async (id: number) => {
    try {
        const res = await axios.delete(`/form/${id}/delete/`, {
            withCredentials: true,
        });

        return res.status === 204 || res.status === 200;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка при удалении формы:', error.response?.data || error.message);
        }
        return false;
    }
};

export const getFormResponses = async (slug: string) => {
    try {
        const res = await axios.get(`/form/${slug}/responses/`, {
            withCredentials: true
        });

        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка при получении списка ответов:', error.response?.data || error.message);
        }
        return [];
    }
};

export const getResponseDetail = async (id: number): Promise<FullResponseDetail | null> => {
    try {
        const res = await axios.get(`/responses/${id}/`, {
            withCredentials: true
        });
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка при получении деталей ответа:', error.response?.data || error.message);
        }
        return null;
    }
};

export const gradeAnswer = async (answerId: number, score: number): Promise<boolean> => {
    try {
        const res = await axios.patch(`/answers/${answerId}/grade/`, 
            { manual_score: score }, 
            { withCredentials: true }
        );
        return res.status === 200;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка при выставлении баллов:', error.response?.data || error.message);
        }
        return false;
    }
};

export const getNotificationsList = async () => {
    try {
        const res = await axios.get('/notifications-list/', {
            withCredentials: true,
        });

        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка при получении списка уведомлений:', error.response?.data || error.message);
        }

        return null;
    }
};

export const readNotification = async (id: number) => {
    try {
        await axios.post(`/notifications/${id}/read/`, {
            withCredentials: true,
        });
    } catch(error){
        if(axios.isAxiosError(error)){
            console.error('Не удалось изменить статус', error.response?.data || error.message);
        }
    }
};

export const readAllNotifications = async () => {
    try {
        await axios.post('/notifications/read-all/', {
            withCredentials: true,
        });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Не удалось изменить статус', error.response?.data || error.message);
        }
    }
};

export const notificationsCount = async () => {
    try{
        const res = await axios.get('/notifications/count/', {
            withCredentials: true
        });

        return res.data || 0;
    } catch (error){
        if(axios.isAxiosError(error)){
            console.error('Ошибка при получение количеств уведомлений', error.response?.data || error.message);
        }
        
        return 0;
    }
}

export const getActiveSessions = async () => {
    try {
        const res = await axios.get('/sessions-list/', {
            withCredentials: true,
        });
        
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка при получении активных сеансов:', error.response?.data || error.message);
        }

        return [];
    }
};

export const deleteSession = async (sessionId: number) => {
    try {
        const res = await axios.delete(`/sessions-delete/${sessionId}/`, {
            withCredentials: true,
        });

        if (res.status === 204 || res.status === 200){
            window.dispatchEvent(new Event("fetchSessions"));
            return;
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка при удалении сеанса:', error.response?.data || error.message);
        }

        return false;
    }
};

export const deleteAllSessions = async () => {
    try {
        const res = await axios.delete('/sessions-delete-all/', {
            withCredentials: true,
        });

        return res.status === 204 || res.status === 200;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка при удалении всех сеансов:', error.response?.data || error.message);
        }

        return false;
    }
};

export const uploadAvatar = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append('avatar', file);

        const res = await axios.post('/upload-avatar/', formData, {
            withCredentials: true
        });
        
        if (res.status === 200 || res.status === 201) {
            window.dispatchEvent(new Event("fetchUser"));
            return res.data;
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка: ', error.response?.data || error.message);
            throw error;
        }
        throw error;
    }
};