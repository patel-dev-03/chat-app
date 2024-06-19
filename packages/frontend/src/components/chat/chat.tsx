import SideBar from "./sidebar/sideBar";
import ChatBody from "./chatBody/chatBody";
import Loading from "../../constants/loading";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { getUser } from "../../api/userService";
import { getUserChatList } from "../../api/conversationService";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { setUser } from "../../reducerFeatures/LogedInUserSlice";
import {
  setUserChatList,
  setUserGroupList,
} from "../../reducerFeatures/userChatListSlice";
import { socket } from "../../socketFront";
import { UserStatusEnum } from "../../enum";
import { getUserGroupList } from "../../api/groupService";

type userChatList = {
  firstName: string;
  lastName: string;
  email: string;
  userStatus: UserStatusEnum;
  userId: string;
  unReadMessages: Number;
};

type socketUser = {
  userId: string;
  socketId: string;
};
const Chat = () => {
  const dispatch = useAppDispatch();
  const [onlineUser, setOnlineUser] = useState<socketUser[]>([]);
  const [chatList, setChatList] = useState<userChatList[]>([]);

  const { isLoaded, user } = useUser();

  useEffect(() => {
    setUserData();
  }, []);

  useEffect(() => {
    if (chatList.length > 0) {
      const newChatList: userChatList[] = chatList.map((user) => {
        const index = onlineUser.findIndex(
          (element) => element.userId === user.userId
        );

        if (index > -1) {
          return {
            ...user,
            userStatus: UserStatusEnum.ONLINE,
          };
        } else {
          return user;
        }
      });
      if (newChatList) {
        dispatch(setUserChatList(newChatList));
      }
    }
  }, [onlineUser]);

  const setUserData = async () => {
    if (user?.id) {
      const userD = await getUser(user);
      if (userD) {
        dispatch(setUser(userD));
        const chatList = await getUserChatList(userD.userId, userD.email);

        if (chatList) {
          dispatch(setUserChatList(chatList));

          setChatList(chatList);
          socket.emit("addUser", userD.userId);

          socket.on("getUsers", (getUsers: socketUser[]) => {
            setOnlineUser(getUsers);
          });
        }
        const groupList = await getUserGroupList(userD.userId, userD.email);
        if (groupList) {
          dispatch(setUserGroupList(groupList));
        }
      }
    }
  };
  const chatListActive = useAppSelector(
    (state) => state.userChatList.chatListActive
  );

  if (!isLoaded) {
    return <Loading></Loading>;
  }
  return (
    <div className="flex h-screen w-full">
      <div
        className={`w-1/4 h-full max-lg:w-1/3  ${chatListActive ? "max-md:w-full " : "max-md:hidden "} `}
      >
        <SideBar />
      </div>
      <div
        className={`w-3/4 h-full max-lg:w-2/3 ${chatListActive ? "max-md:hidden" : "max-md:w-full"} `}
      >
        <ChatBody />
      </div>
    </div>
  );
};

export default Chat;
