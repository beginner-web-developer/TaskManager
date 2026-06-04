import nodemailer from "nodemailer";
import { INVALID_TYPE_ERROR_MSG } from "../config/constants.js";

const getTransporter = () => nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

const userEmailService = async (users, type, res) => {
    const transporter = getTransporter();
    const userList = Array.isArray(users) ? users : [users];
    const message = (type == "update") ? "Task Manager Account Updated" 
        : (type == "create") ? "Task Manager Account Created" 
        : null;
    if (!message) throw new Error(INVALID_TYPE_ERROR_MSG);

    await Promise.all(
        userList.map(user =>
            transporter.sendMail({
                from: process.env.EMAIL,
                to: user.email,
                subject: message,
                text: `Username: ${user.username}, Password: ${user.password}`
            })
        )
    );
};


export default userEmailService;