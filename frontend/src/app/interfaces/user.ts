export interface User {
    _id?: string;
    email: string;
    username: string;
    password: string;
    company?: string;
    isManager: boolean;
    managerId?: string;
}

export interface UserResponse {
    message: string;
    data: User;
}

export interface UserResponseList {
    message: string;
    data: User[];
}
