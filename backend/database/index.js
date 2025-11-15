import mongoose from "mongoose";
const connectDB = async() => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
        console.log("Database Connected Successfully ")
    } catch (error) {
        console.log("Error Connecting to Database", error)
        throw error
    }
}

export default connectDB;