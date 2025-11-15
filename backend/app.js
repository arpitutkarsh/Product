import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()

app.use(cors({
    origin: ["https://admin-dhg0.onrender.com", "http://localhost:5174"],
    credentials: true
}))

app.use(express.json({
    limit: "20mb"
}))
//to take data from the URL
app.use(express.urlencoded({
    extended: true,
    limit: "20mb"
}))
app.use(cookieParser())



import adminRoute from './routes/admin.route.js'
import categoryRoute from './routes/category.route.js'
import productRoute from './routes/product.route.js'

app.use("/api/ver1/admin", adminRoute)
app.use("/api/ver1/category", categoryRoute)
app.use("/api/ver1/product", productRoute)

export {app}