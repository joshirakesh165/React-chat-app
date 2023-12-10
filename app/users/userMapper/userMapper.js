const convertUserToUserModel =(user) => {
    return  {
        "user_id": user.userId,
        "user_name":user.userName,
        "pic_url":user.profilePicURL,
        "status_urls":user.statusURLs,
        "password":user.password,
        "last_logged_in":Date.now(),
        "isActive":user.isActive,
        "blocked_list_ids":user.blockedListIds,
        "mobile_no": user.mobileNo,
        "email": user.email,
        "is_logged_in":user.isLoggedIn
    }
}

const convertUserModelToUser =(userModel) => {
    return   {
        "userId": userModel.user_id,
        "userName":userModel.user_name,
        "profilePicURL":userModel.pic_url,
        "statusURLs":userModel.status_urls,
        "password":userModel.password,
        "lastLoggedIn":userModel.last_logged_in,
        "isActive":userModel.isActive,
        "blockedListIds":userModel.blocked_list_ids,
        "mobileNo": userModel.mobile_no,
        "email" :userModel.email,
        "isLoggedIn":userModel.is_logged_in || false
    }
}

export {convertUserModelToUser,convertUserToUserModel}
