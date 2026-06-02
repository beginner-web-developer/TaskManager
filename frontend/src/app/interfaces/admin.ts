export interface Admin {
    _id?: string;
    username: string;
    password: string;
    company: string;
}

export interface AdminResponse {
    message: string;
    data: Admin;
}