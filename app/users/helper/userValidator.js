import { check, validationResult } from 'express-validator'


const signupValidation = [
    check('password', 'Password is requied').not().isEmpty(),
    check(['email',"mobileNo"],"Email or mobile number is reuired").not().isEmpty()
]

const loginValidation = [
    check('email', 'Please include a valid email').isEmail().normalizeEmail({ gmail_remove_dots: true }),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 })

]

const validateUser = (req, res, next) => {
    let errors = validationResult(req);
    let err = errors.errors[0];
    if (!errors.isEmpty()) {
        return err.msg;
    }
}

export { signupValidation, loginValidation, validateUser }
