import { Router } from "express";
import {
    fetchChatBySenderAndReceiverId,
    deleteAllChat,
    updateChatSeenByStatus
} from "../controller/chat.controller.js";
import isValidTokenExist from "../../middlewares/token-required.middleware.js";

let chatRouter = Router();


chatRouter.route("/:to/:from").get(isValidTokenExist ,fetchChatBySenderAndReceiverId)
chatRouter.route("/").delete(isValidTokenExist,deleteAllChat)
chatRouter.route("/:to/:from").put(isValidTokenExist,updateChatSeenByStatus)



export default chatRouter; 
