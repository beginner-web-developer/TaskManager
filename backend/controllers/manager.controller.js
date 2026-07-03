import { EMPLOYEES_FOUND_SUCCESS_MSG, MANAGER_NOT_FOUND_ERROR_MSG, SERVER_ERROR_MSG } from "../config/constants.js"
import { User } from "../models/user.model.js";

const getEmployees = async (req, res) => {
    try {
        const { managerId } = req.params;
        const manager = await User.findById(managerId);
        if (!manager) {
            return res.status(400).json({ message: MANAGER_NOT_FOUND_ERROR_MSG });
        }

        const employees = await User.find({ managerId: managerId });
        res.status(200).json({ message: EMPLOYEES_FOUND_SUCCESS_MSG, data: employees });
    } catch (error) {
        res.status(500).json({ message: SERVER_ERROR_MSG });
    }
}

export default getEmployees;