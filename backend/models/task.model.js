import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        startDate: {
            type: Date,
            required: true,
            trim: true
        },
        endDate: {
            type: Date,
            required: true,
            trim: true
        },
        isCompleted: {
            type: Boolean,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const Task = mongoose.model("Task", taskSchema);