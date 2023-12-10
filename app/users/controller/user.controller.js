import UserModel from "../models/user.model.js";
import { convertUserToUserModel, convertUserModelToUser } from "../userMapper/userMapper.js";
import { validateUser } from "../helper/userValidator.js";
import CustomError from "../../util/error.js";
import { genearteJWTToken, validateJWTToken } from '../../util/jwt.js'
import bcrypt from 'bcrypt';
import ChatModel from "../../chat/models/chat.model.js";
import { uploadOnCloudinary } from "../../util/cloudinary.js";

const CONFIRM_PASSWORD_NOT_SAME = 'Password and confirm password should be same';
const EMAIL_OR_MOBILE_NO_REQUIRED = 'Email or mobile number is required';


const validationCreateRequest = (userPayload) => {
    if (userPayload.password != userPayload.confirmPassword) {
        throw new Error(CONFIRM_PASSWORD_NOT_SAME);
    }
    if (!userPayload.email && !userPayload.mobileNo) {
        throw new Error(EMAIL_OR_MOBILE_NO_REQUIRED);
    }
}

const createMissingUserIdAndName = (userPayload) => {
    if (!userPayload.id) userPayload['userId'] = userPayload.email || userPayload.mobileNo;
    if (!userPayload.userName) userPayload['userName'] = userPayload.email || userPayload.mobileNo;
}

const createUser = async (req, res, next) => {
    let errormsg = validateUser(req, res, next);
    if (errormsg) {
        res.status(422).send(CustomError({ code: 422, message: errormsg, stack: errormsg }));
    } else {
        try {
            let userPayload = req.body;
            validationCreateRequest(userPayload);
            createMissingUserIdAndName(userPayload);
            const userModel = new UserModel(convertUserToUserModel(userPayload));
            userModel.password = await bcrypt.hash(req.body.password, 12);
            const savedUserModel = await UserModel.create(userModel);
            let savedUser = { ...convertUserModelToUser(savedUserModel) };
            savedUser['token'] = genearteJWTToken(savedUser);
            delete savedUser['password'];
            res.status(201).send(savedUser);
        } catch (error) {
            res.status(500).send(CustomError(error));
        }
    }
}

const loginUser = async (req, res, next) => {
    try {
        let emailOrId = req.body.emailOrId
        let filterobj = isNaN(emailOrId) ? { email: emailOrId } : { mobile_no: +emailOrId }
        const users = await UserModel.find({
            $or: [
                { id: emailOrId },
                { user_id: emailOrId },
                { user_name: emailOrId },
                filterobj
            ]
        });
        if (users.length == 0 || !await bcrypt.compare(req.body.password, users[0].password)) {
            res.status(401).send(CustomError({ message: 'Invalid credential', status: 401 }))
        }

        const updatedUser = await UserModel.findOneAndUpdate({ user_id: users[0].user_id },
            { is_logged_in: true }, { new: true });

        let receivedUser = { ...convertUserModelToUser(updatedUser) };
        receivedUser['token'] = genearteJWTToken(receivedUser);
        delete receivedUser['password'];
        res.send(receivedUser);
    } catch (error) {
        res.status(500).send(CustomError(error));
    }
}

const logOutUser = async (req, res, next) => {
    try {
        let userId = req.params.id;
        await UserModel.findOneAndUpdate({ user_id: userId },
            { is_logged_in: false }, { new: true });
        res.status(200).send('ok');
    } catch (error) {
        res.status(500).send(CustomError(error));
    }
}


const getUnseenMessageCount = async (loggedInUser) => {
    try {
        return await ChatModel.aggregate([
            { $match: { to: loggedInUser, seen_by_list: { $exists: true, $eq: [] } } },
            {
                $group: {
                    _id: '$from',
                    unseenMsgCount: { $sum: 1 }
                }
            }
        ]);
    } catch (error) {
        throw new Error(error)
    }
}



const fetchAllUser = async (req, res) => {
    try {
        let token = req.headers["authorization"]
        let userId = await validateJWTToken(token).userId;
        const unseenMessageCountForLoggedInUser = await getUnseenMessageCount(userId);
        const users = await UserModel.find();
        let userList = users.map(u => {
            let unseenMsgCount = unseenMessageCountForLoggedInUser?.find(c => c._id == u.user_id)?.unseenMsgCount || 0;
            return { _id: u._id, unseenMsgCount, ...convertUserModelToUser(u) }
        });
        userList.forEach(user => delete user['password']);
        res.send(userList);
    } catch (error) {
        res.status(500).send(CustomError(error));
    }
}

const deleteAllUsers = async (req, res) => {
    try {
        await UserModel.deleteMany();
        return fetchAllUser(req, res);
    } catch (error) {
        res.status(500).send(CustomError(error));
    }
}

const fetchUserByField = async (req, res, field) => {
    try {
        const users = await UserModel.findOne({ [field]: req.params.id })
        res.send(convertUserModelToUser(users));
    } catch (error) {
        res.status(500).send(CustomError(error));
    }
}

const fetchUserById = async (req, res) => {
    try {
        const users = await UserModel.findById({ "_id": req.params.id })
        res.send(convertUserModelToUser(users));
    } catch (error) {
        res.status(500).send(CustomError(error));
    }
}

const uploadFileOnCloudinary = async (req, res) => {
    try {
        let userId = req.body.userId;
        let response = await uploadOnCloudinary(req.file.path);
        let updatedUser = await UserModel.findOneAndUpdate({ user_id: userId },
            { pic_url: response.url }, { new: true });
        res.status(201).send(convertUserModelToUser(updatedUser));
    } catch (error) {
        res.status(500).send(CustomError(error));
    }
}
// const sendLocalSavedFileUrl = async (req, res) => {
//     try {
//         let userId = req.body.userId;
//         let response = await uploadOnCloudinary(req.file.path);
//         let updatedUser = await UserModel.findOneAndUpdate({ user_id: userId },
//             { pic_url: response.url }, { new: true });
//         res.status(201).send(convertUserModelToUser(updatedUser));
//     } catch (error) {
//         res.status(500).send(CustomError(error));
//     }
// }



export {
    createUser,
    fetchAllUser,
    deleteAllUsers,
    fetchUserById,
    fetchUserByField,
    loginUser,
    logOutUser,
    uploadFileOnCloudinary
};
