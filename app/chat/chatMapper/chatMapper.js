const convertChatToChatModel = (chat) => {
    return {
        "chatId": chat.chatId,
        "to": chat.to,
        "from": chat.from,
        "type": chat.type,
        "data": chat.data,
        "format": chat.format,
        "deleted_for_sender": chat.deleteForSender || false,
        "deleted_For_receiver": chat.deleteForReceiver || false,
        "seen_by_list" :chat.seenByList || []
    }
}

const convertChatModelToChat = (chatModel) => {
    return {
        "chatId": chatModel.chatId,
        "to": chatModel.to,
        "from": chatModel.from,
        "type": chatModel.type,
        "data": chatModel.data,
        "format": chatModel.format,
        "deleteForSender": chatModel.deleted_for_sender,
        "deleteForReceiver": chatModel.deleted_for_receiver,
        "seenByList" :chatModel.seen_by_list
    }
}

export { convertChatModelToChat, convertChatToChatModel }
