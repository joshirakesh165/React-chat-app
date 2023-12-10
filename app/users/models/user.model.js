import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    user_id: {type: String, required:true, unique: true},
    user_name: {type: String, required:true},
    pic_url:String,
    status_urls:[String],
    password:{type: String, required:true},
    last_logged_in:Date,
    isActive:Boolean,
    blocked_list_id:[String],
    mobile_no:{type: Number, unique: true},
    email:{type: String, unique: true},
    is_logged_in:Boolean
  });

  const UserModel = mongoose.model('User', userSchema);
  
  export default UserModel;
