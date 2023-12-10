import ChatModel from "../models/chat.model.js"
import { convertChatModelToChat, convertChatToChatModel } from '../chatMapper/chatMapper.js'
import CustomError from "../../util/error.js";


const fetchChatBySenderAndReceiverId = async (req, res, next) => {
    try {
        let { to, from } = await req.params;
        let reveivedChats = await ChatModel.find({
            $or: [
                { to: to, from: from },
                { to: from, from: to }
            ]
        }).sort({ createdAt: 1 });
        let chatsForUI = reveivedChats.map(chat => convertChatModelToChat(chat))
        res.status(201).send(chatsForUI);
    } catch (error) {
        res.status(500).send(CustomError(error));
    }
}


const deleteChatBySenderAndReceiverId = async (payload) => {
    try {
        let { to, from } = payload;
        return await ChatModel.deleteMany({
            $or: [
                { to: to, from: from },
                { to: from, from: to }
            ]
        });
    } catch (error) {
        new Error(CustomError(error));
    }
}

const deleteAllChat = async (req, res, next) => {
    try {
        let reveivedChats = await ChatModel.deleteMany();
        res.status(201).send(reveivedChats);
    } catch (error) {
        res.status(500).send(CustomError(error));
    }
}


const updateChatSeenByStatus = async (req, res, next) => {
    try {
        let updatedChats = await ChatModel.updateMany({ to: req.params.to, from: req.params.from }, { seen_by_list: [req.params.to] });
        res.status(201).send(updatedChats);
    } catch (error) {
        res.status(500).send(CustomError(error));
    }
}

const saveChatToDB = async (chat) => {
    try {
        let chatModel = await convertChatToChatModel(chat);
        return await ChatModel.create(chatModel);
    } catch (error) {
        new Error(CustomError(error));
    }
}


export {
    saveChatToDB,
    fetchChatBySenderAndReceiverId,
    deleteAllChat, updateChatSeenByStatus,
    deleteChatBySenderAndReceiverId
}
