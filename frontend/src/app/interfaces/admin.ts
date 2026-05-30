export interface Admin {
    id?: string;
    username: string;
    password: string;
    company?: string;
}

export interface AdminResponse {
    message: string;
    data: Admin;
}