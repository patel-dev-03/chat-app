import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { socket } from "../../../socketFront";
import { ReceiverTypeEnum } from "../../../enum";
import { getLatestMessageList } from "../../../api/messageService";
import { setLatestMessageArray } from "../../../reducerFeatures/ConversationWithUserSlice";

function UserChat() {
  const messageArray = useAppSelector(
    (state) => state.conversationWithUser.messages
  );
  const conversationWithUser = useAppSelector(
    (state) => state.conversationWithUser.conversationWithUser
  );
  const conversationWithGroup = useAppSelector(
    (state) => state.conversationWithUser.conversationWithGroup
  );

  const objectUser = useAppSelector((state) => state.logedInUser.logedInUser);
  const dispatch = useAppDispatch();
  useEffect(() => {
    socket.on(
      "receiveMessage",
      (message: { senderId: string; receiverId: string }) => {
        console.log(message, "message in userChat up");

        if (
          message.senderId === conversationWithUser.userId &&
          message.receiverId === objectUser.userId
        ) {
          getNewMessage();
        } else if (message.receiverId === conversationWithGroup.groupId) {
          console.log(message);
          getNewMessage();
        }
      }
    );
    return () => {
      socket.off("receiveMessage");
    };
  });
  const getNewMessage = async () => {
    if (conversationWithUser.userId) {
      const query = {
        userEmail: objectUser.email,
        chatWithUser: conversationWithUser.userId,
        userId: objectUser.userId,
        receiverType: ReceiverTypeEnum.SINGLE,
      };
      const messageArray = await getLatestMessageList(query);
      dispatch(setLatestMessageArray(messageArray));
    } else if (conversationWithGroup.groupId) {
      const query = {
        userEmail: objectUser.email,
        chatWithUser: conversationWithGroup.groupId,
        userId: objectUser.userId,
        receiverType: ReceiverTypeEnum.GROUP,
      };
      const messageArray = await getLatestMessageList(query);
      dispatch(setLatestMessageArray(messageArray));
    }
  };

  return (
    <div className="flex flex-col-reverse flex-grow justify-start overflow-y-scroll sideBarChatList pb-1 px-5 max-md:px-4 max-sm:px-3 max-md:text-sm gap-0.5  ">
      {messageArray &&
        messageArray.map((message, index) => {
          const date = new Date(message.createdAt);

          return (
            <div
              className={`flex  ${
                message.senderId === objectUser.userId
                  ? "justify-end"
                  : "justify-start"
              }`}
              key={index}
            >
              <div
                className={`   bg-[#E3F6FC] p-2 flex flex-col rounded-b-md max-w-[70%]    ${message.senderId === objectUser.userId ? "rounded-tl-md xl:ml-10" : " rounded-tr-md xl:mr-10 "}`}
              >
                {message.senderId !== objectUser.userId ? (
                  <span className="text-sm text-slate-800">
                    {message.sender?.firstName} {message.sender?.lastName}
                  </span>
                ) : (
                  ""
                )}
                <span
                  style={{
                    overflowWrap: "break-word",
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                  }}
                  className=" text-base  max-w-full max-sm:text-sm "
                >
                  {message.messageData}
                </span>
                <span className="text-xs text-right ">
                  {date.toLocaleTimeString("en-US").replace(/:\d+ /, " ")}
                </span>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default UserChat;
