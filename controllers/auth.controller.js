//  controllers for the auth routes

// note : controllers are the functions that are called when a certain route is hit in the server so basically they are the functions that are responsible for the logic of the routes

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";
import User from "../models/user.model.js";

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    // creating a new user
    try {
        const { name, email, password } = req.body;

        // check if user exists
        if (await User.findOne({ email })) {
            const error = new Error("User already exists");
            error.statusCode = 409;
            throw error;
        }

        // hash Pasword
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // cretea user
        const newUser = await User.create(
            [{ name, email, password: hashedPassword }],
            { session }
        );

        const token = jwt.sign({ userId: newUser[0]._id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                token,
                user: newUser[0],
            },
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error("User does not exist");
            error.statusCode = 404;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const error = new Error("Invalid password");
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || "1h",
        });

        res.status(200).json({
            success: true,
            message: "User signed in successfully",
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

export const signOut = async (req, res) => {};
