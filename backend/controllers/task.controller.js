import { CREATE_ERROR_MSG, SERVER_ERROR_MSG, TASK_CREATE_SUCCESS_MSG, TASK_DELETE_SUCCESS_MSG, TASK_NOT_FOUND_ERROR_MSG, TASK_READ_SUCCESS_MSG, TASK_TIMING_CONFLICTS_ERROR_MSG, TASK_UPDATE_SUCCESS_MSG } from "../config/constants.js";
import { Task } from "../models/task.model.js";

const createTask = async (req, res) => {
    try {
        const { title, description, startDate, endDate } = req.body;
        const { userId } = req.params;
        if (!title || !description || !startDate || !endDate) {
            return res.status(400).json({ message: CREATE_ERROR_MSG })
        }

        const tasks = await Task.find({ 
            userId, 
            startDate: {$lt: endDate}, 
            endDate: {$gt: startDate},
            isCompleted: {$ne: true}
        });
        if (tasks.length != 0) {
            return res.status(400).json({ message: TASK_TIMING_CONFLICTS_ERROR_MSG });
        }

        const newTask = await Task.create({ 
            userId, title, description, startDate, endDate, isCompleted : false
        });
        res.status(201).json({ 
            message: TASK_CREATE_SUCCESS_MSG,
            data: newTask
        });
    } catch (error) {
        res.status(500).json({ message: SERVER_ERROR_MSG, error: error.message });
    }
};

const readTasks = async (req, res) => {
    try {
        const { userId } = req.params;
        const tasks = await Task.find({ userId });
        res.status(200).json({ 
            message: TASK_READ_SUCCESS_MSG,
            tasks
        });
    } catch (error) {
        res.status(500).json({ message: SERVER_ERROR_MSG });
    }
};

const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { title, description, startDate, endDate, userId } = req.body;
        const overlapTask = await Task.findOne({
            _id: {$ne: taskId},
            userId, 
            startDate: {$lt: endDate}, 
            endDate: {$gt: startDate},
            isCompleted: {$ne: true}
        });
        if (overlapTask) {
            return res.status(400).json({ message: TASK_TIMING_CONFLICTS_ERROR_MSG });
        }

        const updated = await Task.findByIdAndUpdate(
            taskId,
            req.body,
            {
                returnDocument: "after"
            }
        );
        if (!updated) {
            return res.status(404).json({ message: TASK_NOT_FOUND_ERROR_MSG });
        }

        res.status(200).json({ message: TASK_UPDATE_SUCCESS_MSG, data: updated });
    } catch (error) {
        res.status(500).json({ message: SERVER_ERROR_MSG });
    }
};

const deleteTask = async(req, res) => {
    try {
        const { taskId } = req.params;
        const task = await Task.findByIdAndDelete(taskId);
        if (!task) {
            return res.status(400).json({ message: TASK_NOT_FOUND_ERROR_MSG });
        }
        res.status(200).json({
            message: TASK_DELETE_SUCCESS_MSG,
            data: task
        });
    } catch (error) {
        res.status(500).json({ message: SERVER_ERROR_MSG, error: error.message });
    }
};

export { createTask, readTasks, updateTask, deleteTask };