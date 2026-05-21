export interface User {
    _id?: string;
    email: string;
    username: string;
    password: string;
}

export interface UserResponse {
    message: string;
    data: User;
}
