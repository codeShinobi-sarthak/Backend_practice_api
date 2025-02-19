import User from "../models/user.model.js";

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select("password");

        if (!user) {
            const error = new Error("user not found");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

export const createUser = async (req, res, next) => {
    res.send("CREATE user");
};

export const updateUser = async (req, res, next) => {
    res.send("UPDATE user by id");
};

export const deleteUser = async (req, res, next) => {
    res.send("DELETE user by id");
};
