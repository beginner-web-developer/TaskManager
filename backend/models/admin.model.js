import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const adminSchema = new Schema({
    username: String,
    password: String,
    company: String
});

adminSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

adminSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export const Admin = mongoose.model("Admin", adminSchema);