import { Server } from 'socket.io';
import { validateJWTToken } from './util/jwt.js';
import { deleteChatBySenderAndReceiverId, saveChatToDB } from './chat/controller/chat.controller.js';

let onlineUserIds = [];

const configureSocket = (server) => {
    try {
        const io = new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });
    
    
        io.use(function (socket, next) {
            let token = socket?.handshake?.auth?.currentUser?.token || null;
            if (token && validateJWTToken(token)) {
                next()
            } else {
                const err = new Error("not authorized");
                err.data = { content: "Token is invalid or not provided" };
                next(err);
            }
        });
    
        io.on('connection', (socket) => {
            socket.on("knock-knock-send", async (payload) => {
                let savedChat = await saveChatToDB(payload);
                if (savedChat) {
                    io.emit("knock-knock-receive", payload);
                    io.emit("knock-knock-notification-notify", payload);
                }
            })
            socket.on("knock-knock-delete-action", async (payload) => {
                await deleteChatBySenderAndReceiverId(payload)
                io.emit("knock-knock-delete-notify", payload);
            })
            socket.on("knock-knock-typing-action", async (payload) => {
                io.emit("knock-knock-typing-notify", payload);
            })
            socket.on("knock-knock-login-logout-action", async (payload) => {
                if (payload.onlineStatus && onlineUserIds.indexOf(payload.userId) == -1) {
                    onlineUserIds.push(payload.userId)
                }
                if ((!payload.onlineStatus)) {
                    onlineUserIds = onlineUserIds.filter(id => id != payload.userId)
                }
                io.emit("knock-knock-login-logout-notify", onlineUserIds);
            })
        })

    } catch(e) {
        let msg = e && e.message || "Error Occurred at socket"
        let connectError = new Error(msg)
        return new CustomError(connectError)
    }
    

}

export default configureSocket;