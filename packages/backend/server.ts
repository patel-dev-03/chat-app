import "dotenv/config";
import http from "http";
import express, { Express } from "express";
import cors from "cors";
import UserRoutes from "./routers/user.router";
import MessageRoutes from "./routers/message.router";
import ConversationRoutes from "./routers/conversation.routers";
import GroupRoutes from "./routers/group.routers";
import socketEvents from "./socket";
import { Server } from "socket.io";
import { loginPerson } from "./middleware/auth.middleware";

const app: Express = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
export const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

socketEvents(io);

const port = process.env.PORT || 4500;
app.use("/api/user", UserRoutes);

app.use("/api/message", loginPerson, MessageRoutes);

app.use("/api/conversation", loginPerson, ConversationRoutes);
app.use("/api/group", loginPerson, GroupRoutes);

server.listen(port, () => {
  console.log(`socket server listening at the port ${port}`);
});
