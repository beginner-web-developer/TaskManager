import { CREATE_ERROR_MSG, SERVER_ERROR_MSG, TASK_CREATE_SUCCESS_MSG, TASK_DELETE_SUCCESS_MSG, TASK_MARK_SUCCESS_MSG, TASK_NOT_FOUND_ERROR_MSG, TASK_READ_SUCCESS_MSG, TASK_STATUS_UNCHANGED_ERROR_MSG, TASK_TIMING_CONFLICTS_ERROR_MSG, TASK_UPDATE_SUCCESS_MSG } from "../config/constants.js";
import { Task } from "../models/task.model.js";

const createTask = async (req, res) => {
    try {
        const { title, description, startDate, endDate, 
            enableRecurrence, repeat, repeatCount } = req.body;
        const { userId } = req.params;
        if (!title || !description || !startDate || !endDate) {
            return res.status(400).json({ message: CREATE_ERROR_MSG })
        }

        const toAdd = [];
        if (enableRecurrence) {
            for (let i = 0; i < repeatCount; i++) {
                const currentStart = new Date(startDate);
                const currentEnd = new Date(endDate);
                if (repeat == 'daily') {
                    currentStart.setDate(currentStart.getDate() + i);
                    currentEnd.setDate(currentEnd.getDate() + i)
                } else if (repeat == 'weekly') {
                    currentStart.setDate(currentStart.getDate() + i * 7);
                    currentEnd.setDate(currentEnd.getDate() + i * 7);
                } else if (repeat == 'monthly') {
                    currentStart.setMonth(currentStart.getMonth() + i);
                    currentEnd.setMonth(currentEnd.getMonth() + i);
                }
                toAdd.push({ userId, title, description, 
                    startDate: currentStart, 
                    endDate: currentEnd, 
                    isCompleted: false });
            }
        } else {
            toAdd.push({ userId, title, description, startDate, endDate, isCompleted: false });
        }

        const conflicts = [];
        const nonConflictingTasks = [...toAdd];
        for (let i = 0; i < repeatCount; i++) {
            const currTask = toAdd[i]
            const tasks = await Task.find({ 
                userId, 
                startDate: {$lt: currTask.endDate}, 
                endDate: {$gt: currTask.startDate},
                isCompleted: {$ne: true}
            });
            if (tasks.length != 0) {
                conflicts.push(`Task start: ${currTask.startDate}, Task end: ${currTask.endDate}`);
                const ind = nonConflictingTasks.indexOf(currTask);
                if (ind > -1) {
                    nonConflictingTasks.splice(ind, 1);
                }
            }
        }

        const newTask = await Task.insertMany(nonConflictingTasks);
        if (conflicts.length == 0) {
            res.status(201).json({ message: TASK_CREATE_SUCCESS_MSG, data: newTask });
        } else {
            res.status(201).json({ 
                message: TASK_TIMING_CONFLICTS_ERROR_MSG + conflicts.reduce((acc, err) => acc + '\n' + err, '')
                    + "\nOTHER " + TASK_CREATE_SUCCESS_MSG,
                data: newTask
            });
        }
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

const deleteTask = async (req, res) => {
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

const markTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { isCompleted } = req.body;
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: TASK_NOT_FOUND_ERROR_MSG });
        }
        if (task.isCompleted == isCompleted) {
            return res.status(400).json({ message: TASK_STATUS_UNCHANGED_ERROR_MSG });
        }
        const updated = await Task.findByIdAndUpdate(taskId, { isCompleted: isCompleted }, {
            returnDocument: "after"
        });
        res.status(200).json({ message: TASK_MARK_SUCCESS_MSG, data: updated });
    } catch (error) {
        res.status(500).json({ message: SERVER_ERROR_MSG });
    }
}

export { createTask, readTasks, updateTask, deleteTask, markTask };