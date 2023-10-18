declare class ApiError extends Error {
    statusCode: number;
    isOperational: boolean;
    stack?: string;
    constructor(statusCode: number, message: string, isOperational?: boolean, stack?: string);
}
export default ApiError;
