import { Server as SocketIOServer } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ReceiverTypeEnum } from "./enum";

type socketUser = {
  userId: string;
  socketId: string;
};
type Message = {
  messageData: string;
  senderId: string;
  groupReceiverId: string;
  singleReceiverId: string;
  createdAt: Date;
  receiverType: ReceiverTypeEnum;
  sender?: {
    firstName: string;
    lastName: string;
    userId: string;
    userStatus: string;
    email: string;
  };
};
let users: socketUser[] = [];

const addUser = (userId: string, socketId: string) => {
  !users.some((user) => user.userId === userId) &&
    users.push({
      userId: userId,
      socketId: socketId,
    });
};

const removeUser = (socketId: string) => {
  users = users.filter((user) => socketId !== user.socketId);
};

const socketEvents = (
  io: SocketIOServer<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>
) => {
  io.on("connect", (socket) => {
    socket.on("addUser", (userId: string) => {
      addUser(userId, socket.id);
      socket.join(userId);

      io.emit("getUsers", users);
    });
    socket.on("addUserToGroupRoom", (groupId: string) => {
      console.log(groupId, "add user to group");
      socket.join(groupId);
    });

    socket.on("sendMessage", (newMessage: Message) => {
      if (newMessage.receiverType === ReceiverTypeEnum.SINGLE) {
        const newMessageUser = {
          senderId: newMessage.senderId,
          receiverId: newMessage.singleReceiverId,
        };
        socket
          .to(newMessage.singleReceiverId)
          .emit("receiveMessage", newMessageUser);
      } else if (newMessage.receiverType === ReceiverTypeEnum.GROUP) {
        const newMessageGroup = {
          senderId: newMessage.senderId,
          receiverId: newMessage.groupReceiverId,
        };
        socket
          .to(newMessage.groupReceiverId)
          .emit("receiveMessage", newMessageGroup);
      }
    });

    socket.on("disconnect", () => {
      removeUser(socket.id);
      io.emit("getUsers", users);
    });

    socket.broadcast.emit("welcome", `${socket.id} joined the chat`);
  });
};

export default socketEvents;

// export class RegisterSocketServices {
//   static io: SocketIOServer;
//   constructor() {}

//   static register(
//     server: http.Server<typeof IncomingMessage, typeof ServerResponse>
//   ) {
//     this.io = new SocketIOServer(server, { cors: { origin: "*" } });

//     this.io.sockets.on("connection", (socket: Socket) => {
//       socket.on("send", async (userId: string) => {
//         console.log("socket is connect", userId);
//         socket.join(userId);
//       });
//       socket.on("disconnect", () => {
//         console.log("disconnect server=====>");
//       });
//     });
//   }
// }
