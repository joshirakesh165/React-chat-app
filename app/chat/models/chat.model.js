import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    chatId: {type:String,require:true, unique: true},
    to: { type: String, required: true },
    from: { type: String, required: true },
    type: { type: String },
    data: { type: String, required: true },
    format: { type: String },
    deleted_for_sender: { type: Boolean }, 
    deleted_For_receiver: { type: Boolean },
    seen_by_list: [String]
}, { timestamps: true });

const ChatModel = mongoose.model('Chat', chatSchema);

export default ChatModel;
