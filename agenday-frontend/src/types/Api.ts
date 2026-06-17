
export type ApiResponse<T = any> = {
    statusCode: number;
    responseData: T | null;
};
