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

export const defaultAdmin: Admin = {
    _id: '',
    username: '',
    password: '',
    company: ''
};