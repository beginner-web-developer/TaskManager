import { ADMIN_NOT_FOUND_ERROR_MSG, CREATE_ERROR_MSG, CREATE_SUCCESS_MSG, LOGIN_SUCCESS_MSG, LOGOUT_SUCCESS_MSG, SERVER_ERROR_MSG, USER_DELETED_SUCCESS_MSG, USER_FOUND_ERROR_MSG, USER_NOT_FOUND_ERROR_MSG, USER_UPDATED_SUCCESS_MSG, USERS_LOADED_SUCCESS_MSG, WRONG_PASSWORD_ERROR_MSG } from "../config/constants.js";
import { Admin } from "../models/admin.model.js";
import { User } from "../models/user.model.js";

const createAdmin = async (req, res) => {
    try {
        const { username, password, company } = req.body;
        if (!username || !password || !company) {
            return res.status(400).json({ message: CREATE_ERROR_MSG });
        }

        const foundUser = await Admin.findOne({ company });
        if (foundUser) {
            return res.status(400).json({ message: USER_FOUND_ERROR_MSG });
        }

        const user = await Admin.create({ username, password, company });
        res.status(201).json({
            message: CREATE_SUCCESS_MSG,
            data: {
                _id: user._id,
                username: user.username,
                company: user.company
            }
        });
    } catch (error) {
        res.status(500).json({ message: SERVER_ERROR_MSG });
    }
};

const loginAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await Admin.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: USER_NOT_FOUND_ERROR_MSG });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: WRONG_PASSWORD_ERROR_MSG });
        }

        res.status(200).json({ 
            message: LOGIN_SUCCESS_MSG,
            data: {
                _id: user._id,
                username: user.username,
                company: user.company
            }
        });
    } catch (error) {
        res.status(500).json({ message: SERVER_ERROR_MSG });
    }
};

const logoutAdmin = async (req, res) => {
    try {
        const { username } = req.body;
        const user = await Admin.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: USER_NOT_FOUND_ERROR_MSG });
        }
        res.status(200).json({ message: LOGOUT_SUCCESS_MSG});
    } catch (error) {
        res.status(500).json({ message: SERVER_ERROR_MSG });
    }
};

const viewUsers = async (req, res) => {
    try {
        const { adminId } = req.params;
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(400).json({ message: ADMIN_NOT_FOUND_ERROR_MSG });
        }

        const users = await User.find({ company: admin.company });
        res.status(200).json({ message: USERS_LOADED_SUCCESS_MSG, data: users });
    } catch (error) {
        res.status(500).json({ message: SERVER_ERROR_MSG });
    }
};

const addUsers = async (req, res) => {
    try {
        const users = req.body;
        const toAdd = [];
        const conflicts = [];
        for (let i = 0; i < users.length; i++) {
            const { email, username, password, company } = users[i];
            if (!email || !username || !password) {
                conflicts.push(`Error for user: ${email}, ${username} --- ${CREATE_ERROR_MSG}`);
                continue;
            }

            const foundUser = await User.findOne({ username: username });
            if (foundUser) {
                conflicts.push(`Error for user: ${username} --- ${USER_FOUND_ERROR_MSG}`);
                continue;
            }
            toAdd.push(users[i])
        }
        const added = await User.insertMany(toAdd);
        if (conflicts.length == 0) {
            res.status(201).json({ message: CREATE_SUCCESS_MSG, data: added });
        } else {
            res.status(201).json({ message: conflicts.reduce((acc, err) => 
                acc + "\n" + err, ''), 
                data: added});
        }
    } catch (error) {
        res.status(500).json({ message: SERVER_ERROR_MSG });
    }
};

const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const updated = await User.findByIdAndUpdate(userId, req.body, {
            returnDocument: "after"
        });
        res.status(200).json({ message: USER_UPDATED_SUCCESS_MSG, data: updated });
    } catch (error) {
        res.status(500).json({ message: SERVER_ERROR_MSG });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const deleted = await User.findByIdAndDelete(userId);
        res.status(200).json({ message: USER_DELETED_SUCCESS_MSG, data: deleted });
    } catch (error) {
        res.status(500).json({ message: SERVER_ERROR_MSG });
    }
};

export {
    createAdmin, loginAdmin, logoutAdmin, viewUsers, addUsers, updateUser, deleteUser
};