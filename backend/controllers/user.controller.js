import { CREATE_ERROR_MSG, CREATE_SUCCESS_MSG, LOGIN_SUCCESS_MSG, LOGOUT_SUCCESS_MSG, SERVER_ERROR_MSG, USER_FOUND_ERROR_MSG, USER_NOT_FOUND_ERROR_MSG, WRONG_PASSWORD_ERROR_MSG } from "../config/constants.js";
import { User } from "../models/user.model.js";

const createUser = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        if (!username || !password || !email) {
            return res.status(400).json({ message: CREATE_ERROR_MSG });
        }

        const foundUser = await User.findOne({ username });
        if (foundUser) {
            return res.status(400).json({ message: USER_FOUND_ERROR_MSG });
        }

        const user = await User.create({
            username, password, email
        });
        res.status(201).json({
            message: CREATE_SUCCESS_MSG,
            data: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: SERVER_ERROR_MSG });
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
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
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: SERVER_ERROR_MSG });
    }
};

const logoutUser = async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: USER_NOT_FOUND_ERROR_MSG });
        }
        res.status(200).json({ message: LOGOUT_SUCCESS_MSG});
    } catch (error) {
        res.status(500).json({ message: SERVER_ERROR_MSG });
    }
};

export {
    createUser, loginUser, logoutUser
};