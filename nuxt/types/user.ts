export interface User {
    id: number
    name: string
    email: string
    role: string
    status: string
}

export interface Pagination {
    page: number
    perPage: number
    total: number
    totalPages: number
}

export interface ApiResponse<T = User[]> {
    success: boolean
    data: T
    pagination: Pagination
}
