import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "User name required"],
            trim: true,
            minLength: 6,
            maxLength: 50,
        },
        email: {
            type: String,
            required: [true, "E-mail is required"],
            trim: true,
            lowerCase: true,
            match: [/\S+@\S+\.\S+/, "please enter a vaild E-mail"],
        },
        password: {
            type: String,
            required: [true, "Prassword  is required"],
            minLength: 6,
        },
    },
    {
        timestamps:true
    }
);

export default mongoose.model("User", userSchema);
