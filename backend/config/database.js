import mongoose from "mongoose";

const connection = async () => {
    try {
        const con = await mongoose.connect(process.env.DB_URI);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export default connection;