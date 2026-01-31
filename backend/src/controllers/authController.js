import bcrypt from "bcrypt"
import { User } from "../models/User.js";
import { registerSchema, loginSchema } from "../utils/validators.js";
import jwt from "jsonwebtoken";

export const register = async(req, res) => {
    const data = registerSchema.parse(req.body)

    const existingUser = await User.findOne({email: data.email})
    if(existingUser){
        return res.status(409).json({
            message: "Email already registered"
        })
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const user = await User.create({
        ...data, 
        password: hashedPassword
    })

    res.status(201).json({
        message: "User registed Successfully",
        userId: user._id
    })

}

export const login = async(req, res) => {
    const data = loginSchema.parse(req.body)

    const user = await User.findOne({email: data.email})
    if(!user){
        return res.status(401).json({
            message: "Invalid credentials"
        })
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if(!isMatch){
        return res.status(401).json({
            message: "Invalid credentials"
        })
    }

    const token = jwt.sign(
        {
            userId: user._id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    )

    res.json({token})
}