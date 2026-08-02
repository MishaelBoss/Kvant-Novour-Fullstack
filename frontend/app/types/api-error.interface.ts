export interface IApiError{
    isApiError: boolean;
    message: string;
    status?: number;
    data?: unknown;
}