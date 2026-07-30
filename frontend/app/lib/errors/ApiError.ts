export class ApiError extends Error {
    status?: number;
    data?: any;
    isApiError = true;

    constructor(message: string, status?: number, data?: any) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
        
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}