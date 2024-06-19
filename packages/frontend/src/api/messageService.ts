import axios from "axios";
import { ReceiverTypeEnum } from "../enum";
const apiroute = process.env.REACT_APP_API_BASE_ROUTE;
type Message = {
  senderEmail: string;
  messageData: string;
  senderId: string;
  receiverId: string;
  receiverType: ReceiverTypeEnum;
};
type query = {
  userEmail: string;
  chatWithUser: string;
  userId: string;
  receiverType: ReceiverTypeEnum;
};

export const getMessageList = async (query: query) => {
  try {
    const messageList = await axios.get(`${apiroute}/api/message/`, {
      headers: {
        Authorization: query.userEmail,
      },
      params: {
        userId: query.userId,
        chatWithUserId: query.chatWithUser,
        receiverType: query.receiverType,
      },
    });
    return messageList.data.data;
  } catch (error) {
    console.error(error);
  }
};
export const getLatestMessageList = async (query: query) => {
  try {
    const messageList = await axios.get(
      `${apiroute}/api/message/latestMessage/`,
      {
        headers: {
          Authorization: query.userEmail,
        },
        params: {
          userId: query.userId,
          chatWithUserId: query.chatWithUser,
          receiverType: query.receiverType,
        },
      }
    );
    return messageList.data.data;
  } catch (error) {
    console.error(error);
  }
};
export const createMessage = async (message: Message) => {
  try {
    const messageCreateResponse = await axios.post(
      `${apiroute}/api/message/`,
      {
        messageData: message.messageData,
        senderId: message.senderId,
        receiverId: message.receiverId,
        receiverType: message.receiverType,
      },
      {
        headers: {
          Authorization: message.senderEmail,
        },
      }
    );

    if (messageCreateResponse) {
      return messageCreateResponse.data.data;
    }
  } catch (error) {
    console.error(error);
  }
};
