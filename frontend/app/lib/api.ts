import { FullResponseDetail } from "../kvanto_form/[slug]/responses/[responseId]/page";
import { IAvatarResponse, IEditProfile, IUser, IUserLogin, IUserRegister, IUserResponse } from "../types/user.interface";
import { ICategory, ICategoryResponse, INewsCreateInput, INewsResponse } from "../types/news.interface";
import { IFormCreate, IFormDetail, IFormItemResponse, IFormResponseSummary, IFormSettings, IQuizSession } from "../types/form.interface";
import { IGroup } from "../types/group.interface";
import { IAttendanceResponse } from "../types/attendance.interface";
import { apiClient } from "./client";
import { ISession } from "../types/session.interface";
import { INotificationsResponse } from "../types/notifications.interface";
import { IPublicProfileData } from "../types/profile.interface";

export const checkAuthStatus = async (): Promise<IUser | null> => {
    const res = await apiClient.get<IUser>(`/is_authenticated/`);
    return res.data.is_authenticated ? res.data : null;
};

export const tokenRefresh = async(): Promise<string> => {
    const res = await apiClient.post(`/token/refresh/`);
    return res.data;
};

export const login = async (data: IUserLogin): Promise<void> => {
    await apiClient.post(`/login/`, data);
};

export const register = async (data: IUserRegister): Promise<void> => {
    await apiClient.post(`/register/`, data);
};

export const editProfile = async (data: IEditProfile): Promise<void> => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            formData.append(key, value as string | Blob);
        }
    });1

    await apiClient.patch(`/edit-profile/`, formData);
}

export const logout = async (): Promise<void> => {
    await apiClient.post(`/logout/`);
}

export const getPublicProfile = async(username: string): Promise<IPublicProfileData> => {
    const res = await apiClient.get<IPublicProfileData>(`/profile/${username}/`);
    return res.data;
}

export const createCategory = async (label: string): Promise<ICategory> => {
    const formData = new FormData();
    if (label) formData.append('label', label);

    const response = await apiClient.post<ICategory>('create-category/', formData);
    return response.data;
}

export const createNews = async (data: INewsCreateInput): Promise<void> => {
    const formData = new FormData();

    if (data.title) formData.append('title', data.title);
    if (data.content) formData.append('content', data.content);

    if (data.image instanceof File) formData.append('image', data.image);
    if (Array.isArray(data.category_ids)) {
        data.category_ids.forEach((id) => {
            formData.append('category_ids', id.toString());
        });
    }

    await apiClient.post(`/run-create-news/`, formData);
}

export const getCategories = async (): Promise<ICategoryResponse> => {
    const res = await apiClient.get<ICategoryResponse>(`/categories-list/`);
    return res.data;
}

export const getListNews = async (): Promise<INewsResponse> => {
    const res = await apiClient.get<INewsResponse>(`/news-list/`);
    return res.data;
}

export const deleteNews = async (id: number): Promise<void> => {
    await apiClient.delete(`/news-delete/${id}/`);
}

export const getListUsers = async (): Promise<IUserResponse> => {
    const res = await apiClient.get<IUserResponse>(`/users-list/`);
    return res.data;
}

export const deleteUser = async (id: number) => {
    await apiClient.delete(`/user-delete/${id}/`);
}

export const editUser = async (id: number, data: Partial<IUser>): Promise<void> => {
    const payload: Record<string, string | null | undefined> = {};

    const allowedFields: Array<keyof IUser> = [
        'username', 'first_name', 'last_name', 'middle_name', 'phone', 'email', 'role'
    ];
        
    allowedFields.forEach((field) => {
        if (data[field] !== undefined) {
            payload[field] = data[field] as string | null | undefined;
        }
    });

    await apiClient.patch(`/user-update/${id}/`, payload);
}

export const createUser = async (data: IUser): Promise<void> => {
    const formData = new FormData();

    if (data.username) formData.append('username', data.username);
    if (data.password) formData.append('password', data.password);
    if (data.first_name) formData.append('first_name', data.first_name);
    if (data.last_name) formData.append('last_name', data.last_name);
    if (data.middle_name) formData.append('middle_name', data.middle_name);
    if (data.phone) formData.append('phone', data.phone);
    if (data.email) formData.append('email', data.email);
    if (data.role) formData.append('role', data.role)

    await apiClient.post(`/run-create-user/`, formData);
}

export const createForm = async (data: IFormCreate, settings: IFormSettings, newsImage?: File | null): Promise<void> => {
    const formData = new FormData();
        
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('status', data.status);

    if (newsImage) formData.append('news_image', newsImage);
    if (data.deadline) formData.append('deadline', data.deadline);
        
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
    
    await apiClient.post('/run-create-form/', formData);
};

export const updateForm = async (id: number, data: IFormCreate, settings: IFormSettings, newsImage?: File | null): Promise<void> => {
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('status', data.status);

    if (newsImage) formData.append('news_image', newsImage);
    if (data.deadline) formData.append('deadline', data.deadline);
        
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

    await apiClient.put(`/form/${id}/update/`, formData);
};

export const getMyFormsList = async (): Promise<IFormItemResponse> => {
    const res = await apiClient.get<IFormItemResponse>('/my-forms-list/');
    return res.data;
};

export const getAllFormsList = async (): Promise<IFormItemResponse> => {
    const res = await apiClient.get<IFormItemResponse>('/all-forms-list/');
    return res.data;
};

export const getFormDetail = async (slug: string): Promise<IFormDetail> => {
    const res = await apiClient.get<IFormDetail>(`/form/${slug}/`);
    return res.data;
}

export const submitQuizResults = async (slug: string, payload: IQuizSession): Promise<void> => {
    const res = await apiClient.post(`/form/${slug}/submit/`, payload);
    return res.data.results || res.data;
}

export async function submitFormResponse(slug: string, session: IQuizSession): Promise<{
    response_id: number;
    auto_score: number;
    max_score: number;
    show_results_after: boolean;
}> {
    const res = await apiClient.post(`/form/${slug}/submit/`, session);
    return res.data.results || res.data;
}

export const deleteForm = async (id: number): Promise<void> => {
    await apiClient.delete(`/form/${id}/delete/`);
};

export const getFormResponses = async (slug: string): Promise<IFormResponseSummary[]> => {
    const res = await apiClient.get<IFormResponseSummary[]>(`/form/${slug}/responses/`);
    return res.data;
};

export const getResponseDetail = async (id: number): Promise<FullResponseDetail> => {
    const res = await apiClient.get<FullResponseDetail>(`/responses/${id}/`);
    return res.data;
};

export const gradeAnswer = async (answerId: number, score: number): Promise<boolean> => {    
    await apiClient.patch(`/answers/${answerId}/grade/`, { manual_score: score });
    return true;
};

export const getNotificationsList = async (): Promise<INotificationsResponse> => {
    const res = await apiClient.get<INotificationsResponse>('/notifications-list/');
    return res.data;
};

export const readNotification = async (id: number): Promise<void> => {
    await apiClient.post(`/notifications/${id}/read/`);
};

export const readAllNotifications = async (): Promise<void> => {
    await apiClient.post('/notifications/read-all/');
};

export const notificationsCount = async (): Promise<number> => {
    const res = await apiClient.get<{ count: number }>('/notifications/count/');
    return res.data?.count ?? 0;
}

export const getActiveSessions = async (): Promise<ISession[]> => {
    const res = await apiClient.get<ISession[]>('/sessions-list/');
    return res.data;
};

export const deleteSession = async (sessionId: number): Promise<boolean> => {
    await apiClient.delete(`/sessions-delete/${sessionId}/`);
    return true;
};

export const deleteAllSessions = async (): Promise<boolean> => {
    await apiClient.delete('/sessions-delete-all/');
    return true;
};

export const uploadAvatar = async (file: File): Promise<IAvatarResponse> => {
    const formData = new FormData();
    formData.append('avatar', file);

    const res = await apiClient.post<IAvatarResponse>('/upload-avatar/', formData);
    return res.data;
};

export const getAttendanceList = async (): Promise<IAttendanceResponse> => {
    const res = await apiClient.get<IAttendanceResponse>('/attendance/');
    return res.data;
};

export const getGroupList = async (): Promise<IGroup[]> => {
    const res = await apiClient.get<IGroup[]>('/group/');
    return res.data;
};