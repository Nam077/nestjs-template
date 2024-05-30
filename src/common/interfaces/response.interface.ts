export interface ResponseData<T> {
    status: number; // HTTP status code
    message: string; // Response message
    data: T | PaginationData<T> | T[] | null; // Response data
}

export interface PaginationData<T> {
    data: T[]; // Array of items
    total: number; // Total number of items
    page: number; // Current page number
    limit: number; // Number of items per page
    totalPages: number; // Total number of pages
    nextPage: number | null; // Next page number, null if no more pages
}
