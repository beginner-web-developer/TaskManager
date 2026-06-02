export const DB_NAME = 'TaskManagerDB';

// authentication error messages
export const CREATE_ERROR_MSG = "All fields are required!";
export const USER_FOUND_ERROR_MSG = "User already exists!";
export const USER_NOT_FOUND_ERROR_MSG = "User not found!";
export const WRONG_PASSWORD_ERROR_MSG = "Password is incorrect!";
export const SERVER_ERROR_MSG = "Internal Server Error!";

// authentication success messages
export const CREATE_SUCCESS_MSG = "User successfully created!";
export const LOGIN_SUCCESS_MSG = "Successfully logged in!";
export const LOGOUT_SUCCESS_MSG = "Successfully logged out!";

// task error messages
export const TASK_TIMING_CONFLICTS_ERROR_MSG = "Task timing conflicts!";
export const TASK_NOT_FOUND_ERROR_MSG = "Task not found!";
export const TASK_STATUS_UNCHANGED_ERROR_MSG = "Task status is unchanged!";

// task success messages
export const TASK_CREATE_SUCCESS_MSG = "Task successfully created!";
export const TASK_READ_SUCCESS_MSG = "Tasks successfully retrieved!";
export const TASK_UPDATE_SUCCESS_MSG = "Task updated successfully!";
export const TASK_DELETE_SUCCESS_MSG = "Task deleted successfully!";
export const TASK_MARK_SUCCESS_MSG = "Task status updated successfully!";

// admin error messages
export const ADMIN_NOT_FOUND_ERROR_MSG = "Admin user not found!";

// admin success messages
export const USERS_LOADED_SUCCESS_MSG = "Users successfully loaded!";
export const USER_UPDATED_SUCCESS_MSG = "User successfully updated!";
export const USER_DELETED_SUCCESS_MSG = "User successfully deleted!";