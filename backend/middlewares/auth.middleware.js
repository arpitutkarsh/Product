import { verifyAccessToken } from "../utils/token.js";
import { Admin } from "../models/admin.model.js";
import { ApiError } from "../utils/ApiError.js";
export default async function protect(req, res, next) {
    try {
        const token = req.cookies?.accessToken
        if(!token){
            throw new ApiError(401, "Not Authenticated")
        }
        const payload = verifyAccessToken(token)
        const admin = await Admin.findById(payload.id).select("-password")
        if(!admin){
            throw new ApiError(401, "Invalid Token, USER UNAVAILABLE")
        }
        req.admin = admin
        next()
    } catch (error) {
        throw new ApiError(401, "Not Authorized")
    }
}