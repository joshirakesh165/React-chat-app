import CustomError from "../util/error.js";
import jwt from 'jsonwebtoken'


const TOKEN_NOT_EXIST_MSG = 'Token is invalid or does not exist';
const STATUS_UNAUTHORISE = 401;
const TOKRN_NOT_EXIST_STACK = 'Token is invalid or does not exist';

const isValidTokenExist = (req, res, next) => {

    try {
        let token = req.headers["authorization"];
        if (!token) {
            throw new Error();
        }
        let isTokenValid = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!isTokenValid) {
            throw new Error();
        }
        next();
    } catch (e) {
        return res.status(401).send(
            CustomError({
                message: e.message || TOKEN_NOT_EXIST_MSG,
                status: STATUS_UNAUTHORISE,
                stack: TOKRN_NOT_EXIST_STACK
            }))
    }
}

export default isValidTokenExist;