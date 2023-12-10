import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'
dotenv.config();

const genearteJWTToken = (user) => {
    const tokenPayload = { userId: user.userId };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY);
    return token;
}

const validateJWTToken = (token) => {
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
        return verified ? verified : null;
    } catch (error) {
        return null;
    }
}

export {
    genearteJWTToken,
    validateJWTToken
}
