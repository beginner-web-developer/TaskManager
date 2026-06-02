export interface User {
    id?: string;
    email?: string;
    username: string;
    password: string;
    company?: string;
}

export interface UserResponse {
    message: string;
    data: User;
}

export interface UserResponseList {
    message: string;
    data: User[];
}
