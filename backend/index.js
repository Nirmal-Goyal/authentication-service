import dotenv from "dotenv"
import connectDB from "./src/config/db.js"
import app from "./src/app.js"

dotenv.config()
const port = process.env.PORT || 8000

const startServer = async () => {
    try {
        await connectDB()

        app.listen(port, () => {
            console.log(`Server is running on port: ${port}`)
        })
    } catch (error) {
        console.log("Failed to start server:", error)
        process.exit(1)
    }
}

startServer();