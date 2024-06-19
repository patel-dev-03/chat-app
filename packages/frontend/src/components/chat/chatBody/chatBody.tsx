import { useEffect, useState } from "react";
import profile_photo from "../../../assets/profile-Pic.jpg";
import searchIcon from "../../../assets/search_Icon.svg";
import threeDots from "../../../assets/three_Vertical.svg";
import attachIcon from "../../../assets/attach_Icon.svg";
import micVoice from "../../../assets/mic_Voice_Record.svg";
import sendMessage from "../../../assets/send_Message_Icon.svg";
import leftArrow from "../../../assets/left_Arrow.svg";
import { createMessage } from "../../../api/messageService";
import { useAppSelector, useAppDispatch } from "../../../store/store";
import { ReceiverTypeEnum, UserStatusEnum } from "../../../enum";
import UserChat from "../chatBody/userChat";
import { setChatListActive } from "../../../reducerFeatures/userChatListSlice";
import {
  setConversationWithGroup,
  setConversationWithUser,
} from "../../../reducerFeatures/ConversationWithUserSlice";
import { setNewMessage } from "../../../reducerFeatures/ConversationWithUserSlice";
import AddMember from "./addMember";
import { socket } from "../../../socketFront";

function ChatBody() {
  const objectUser = useAppSelector((state) => state.logedInUser.logedInUser);
  const chatWithUser = useAppSelector(
    (state) => state.conversationWithUser.conversationWithUser
  );
  const chatWithGroup = useAppSelector(
    (state) => state.conversationWithUser.conversationWithGroup
  );

  const chatListActive = useAppSelector(
    (state) => state.userChatList.chatListActive
  );
  const userOrGroup = useAppSelector(
    (state) => state.conversationWithUser.userOrGroup
  );

  const dispatch = useAppDispatch();

  const [message, setMessage] = useState<string>("");
  const [receiverId, setReceiverId] = useState<string>("");
  const [sidePanel, setSidePanel] = useState<boolean>(false);
  const [addMemberPopup, setAddMemberPopup] = useState<boolean>(false);
  useEffect(() => {
    if (userOrGroup && chatWithUser.userId) {
      setReceiverId(chatWithUser.userId);
    } else if (!userOrGroup && chatWithGroup.groupId) {
      setReceiverId(chatWithGroup.groupId);
    }
  });
  useEffect(() => {
    setSidePanel(false);
    setAddMemberPopup(false);
  }, [receiverId]);


  

  const handleMessageSubmit = async (e: any) => {
    const message: string = e.target[0].value.trim();

    if (message !== "") {
      const wholeMessage = {
        senderEmail: objectUser.email,
        senderId: objectUser.userId,
        receiverId: receiverId,
        messageData: message,
        receiverType: userOrGroup
          ? ReceiverTypeEnum.SINGLE
          : ReceiverTypeEnum.GROUP,
      };

      setMessage("");

      const newMessage = await createMessage(wholeMessage);
      if (newMessage) {
        dispatch(
          setNewMessage({
            messageData: newMessage.messageData,
            senderId: newMessage.senderId,
            groupReceiverId: newMessage.groupReceiverId,
            singleReceiverId: newMessage.SingleReceiverId,

            createdAt: newMessage.createdAt,
            receiverType: newMessage.receiverType,
          })
        );
        socket.emit("sendMessage", newMessage);
      }
    }
    setMessage("");
  };
  return (
    <div
      className={`w-full flex  h-full   ${chatListActive ? "max-md:hidden" : ""} `}
    >
      {receiverId ? (
        <div className="w-full h-full flex flex-col justify-between  ">
          <div className="flex p-2 justify-between md:pr-5">
            <button
              className={`${chatListActive ? "" : "md:hidden"}`}
              onClick={() => {
                dispatch(setChatListActive(true));
                dispatch(
                  setConversationWithUser({
                    firstName: "",
                    lastName: "",
                    email: "",
                    userStatus: UserStatusEnum.OFFLINE,
                    userId: "",
                  })
                );
                dispatch(
                  setConversationWithGroup({
                    creatorId: "",
                    groupId: "",
                    members: [],
                    groupName: "",
                    description: "",
                  })
                );
                setReceiverId("");
              }}
            >
              <img
                alt=""
                src={leftArrow}
                className="h-8 md:hidden max-[350px]:h-7"
              />
            </button>
            <div className="flex justify-between grow">
              <div className="flex items-center gap-4">
                <img alt="" src={profile_photo} className="h-12" />
                <div className="flex flex-col">
                  <span className="text-lg max-[350px]:text-sm overflow-hidden">
                    {userOrGroup
                      ? `${chatWithUser.firstName} ${chatWithUser.lastName}`
                      : `${chatWithGroup.groupName}`}
                  </span>
                  <span className="text-[13px] max-[350px]:text-[10] text-gray-600 flex gap-2 overflow-hidden">
                    {userOrGroup
                      ? `${chatWithUser.userStatus}`
                      : chatWithGroup.members.map((members, index) => (
                          <div key={index}>
                            {members.user.firstName} {members.user.lastName}-
                            {members.role}
                          </div>
                        ))}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 max-[350px]:gap-1 ">
                <button>
                  <img
                    alt=""
                    src={searchIcon}
                    className="h-7 max-md:h-6 max-sm:h-5"
                  />
                </button>
                {/* <button className="">
                  <img
                    src={videoCall}
                    
                    className="h-8 max-md:h-7 max-sm:h-6 max-[320px]:hidden"
                  />
                </button>
                <button>
                  <img
                    src={normalCall}
                    
                    className="h-8 max-md:h-7 max-sm:h-6"
                  />
                </button> */}
                <div className="flex items-center relative">
                  <button
                    onClick={() => {
                      setSidePanel(!sidePanel);
                    }}
                  >
                    <img
                      alt=""
                      src={threeDots}
                      className="h-10 max-md:h-8 max-sm:h-7"
                    />
                  </button>
                  {sidePanel && !userOrGroup && (
                    <div className="absolute top-[52px] right-2.5 min-w-max bg-[rgb(215,245,254)] p-4 rounded-md">
                      <button
                        className="bg-white p-2 rounded-lg"
                        onClick={() => {
                          setAddMemberPopup(true);
                          setSidePanel(false);
                        }}
                      >
                        <span>Add Members</span>
                      </button>
                    </div>
                  )}
                  {addMemberPopup && (
                    <AddMember setAddMemberPopup={setAddMemberPopup} />
                  )}
                </div>
              </div>
            </div>
          </div>
          <UserChat></UserChat>
          <div className="flex pr-3 py-4 max-md:pr-2 max-sm:pr-1 max-[350px]:pr-0 bg-[rgb(215,245,254)]">
            <button
              onClick={() => {
                if (!userOrGroup) {
                }
              }}
            >
              <img alt="" src={threeDots} className="h-10 px-2 max-sm:p-1 " />
            </button>
            <div className="flex border-[#96A9BA] bg-white border rounded-xl pl-4 max-md:pl-3 max-sm:pl-1 grow overflow-hidden">
              <button>
                <img alt="" src={attachIcon} className="h-7 max-md:h-6 " />
              </button>
              <button>
                <img
                  alt=""
                  src={micVoice}
                  className="h-7 pr-3 pl-2 max-md:hidden"
                />
              </button>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleMessageSubmit(e);
                }}
                className="flex grow justify-between"
              >
                <input
                  type="text"
                  id="messageInput"
                  placeholder="type here"
                  className="grow pl-3 focus:outline-none max-md:pl-1 max-[350px]:max-w-40 "
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                />
                <button
                  id="submitButton"
                  type="submit"
                  className="flex items-center bg-[#6588DE] px-3 "
                >
                  <span className="max-sm:hidden text-white"> send</span>{" "}
                  <img
                    src={sendMessage}
                    className="h-6 max-md:h-5 max-sm:h-4"
                  />
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex  items-center justify-center  h-screen">
          <div className="bg-white p-8 rounded-lg shadow-lg flex justify-center flex-col">
            <h1 className="text-2xl font-semibold mb-4">
              Select a Friend to Converse With
            </h1>
            <div className="flex items-center space-x-2 mb-4 flex-col justify-center">
              <span className="text-gray-500">Here is the Friends List</span>
              <img alt="" src={leftArrow} className="h-16" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBody;
