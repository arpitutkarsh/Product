import dotenv from 'dotenv'
dotenv.config()
import { app } from './app.js'
import connectDB from './database/index.js'
// import { uploadonCloudinary } from './utils/cloudinary.js'

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on PORT ${process.env.PORT || 8000}`)
    })
})
.catch((error) => {
    console.log("Error connecting to Database", error)
})



