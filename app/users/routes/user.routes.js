import { Router } from "express";
import {
    createUser,
    deleteAllUsers,
    fetchAllUser,
    fetchUserById,
    fetchUserByField,
    loginUser,
    logOutUser,
    uploadFileOnCloudinary
} from "../controller/user.controller.js";

import { upload } from "../../middlewares/multer.middleware.js";
import isValidTokenExist from "../../middlewares/token-required.middleware.js";

let userRouter = Router();

userRouter.get("/", isValidTokenExist, fetchAllUser)
userRouter.route("/").post(createUser)
userRouter.route("/login").post(loginUser)
userRouter.route("/logout/:id").get(isValidTokenExist,logOutUser)
userRouter.delete("/",isValidTokenExist, deleteAllUsers);
userRouter.get("/:id",isValidTokenExist, fetchUserByField);
userRouter.get("/objectId/:id",isValidTokenExist, fetchUserById);
userRouter.post("/upload/profile", [isValidTokenExist,upload.single('user-profile-pic')], uploadFileOnCloudinary);



export default userRouter; 
