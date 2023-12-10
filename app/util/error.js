const CustomError = (error,type) =>  {
    let errObj = {
        success: false,
        message : error?.message || 'Something went wrong',
        code: error?.status || '500',
        stack : JSON.stringify(error?.stack) || 'Something went wrong',
    }
    if(type == 'json') {
        return errObj
    }
    return JSON.stringify(errObj)
}

export default CustomError