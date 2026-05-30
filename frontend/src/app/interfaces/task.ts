export interface Task {
    _id?: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    isCompleted: boolean;
    repeat?: string;
    repeatCount?: number;
}

export interface TaskResponse {
    message: string;
    data: Task;
}

export interface GetTasksResponse {
    message: string;
    tasks: Task[];
}
