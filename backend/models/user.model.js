import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            unique: true
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
        },
        email: {
            type: String,
            required: true,
        },
        company: String,
        isManager: { type: Boolean, required: true, default: false },
        managerId: { type: Schema.Types.ObjectId, ref: "User", default: null }
    },
    {
        timestamps: true
    }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);