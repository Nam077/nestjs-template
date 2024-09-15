// Define the base response

export interface BaseResponse {
    status: number; // HTTP status code
    message: string; // Response message
}

// Define the error response
export interface ErrorResponse extends BaseResponse {
    data: null; // Response data in case of error
}

// Define the single data response
export interface SingleDataResponse<T> extends BaseResponse {
    data: T; // Single data
}

// Define the array data response
export interface ArrayDataResponse<T> extends BaseResponse {
    data: T[]; // Array of data
}

export interface PaginationData<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    nextPage: number | null;
    prevPage: number | null;
}

// Define the paginated data response
export interface PaginatedDataResponse<T> extends BaseResponse, PaginationData<T> {}

// Union type for all types of responses
export type ResponseData<T> = SingleDataResponse<T> | ArrayDataResponse<T> | PaginatedDataResponse<T> | ErrorResponse;
