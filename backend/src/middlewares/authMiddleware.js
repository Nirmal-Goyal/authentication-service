import { jwt } from "jsonwebtoken";
import { User} from "../models/User.js";

const authMiddleware = async(requ, res, next) => {
    const authHeader = requ.headers.authorization

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.userId).select("-password")

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.user = {
        id: user._id,
        email: user.email,
        createdAt: user.createdAt,
        };
        
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        })
    }
}

export default authMiddleware