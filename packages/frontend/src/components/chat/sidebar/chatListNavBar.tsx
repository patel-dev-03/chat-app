import profile_photo from "../../../assets/profile-Pic.jpg";
import plus_Icon from "../../../assets/plus_Add.svg";
import drop_Down_Icon from "../../../assets/drop_Down_Arrow.svg";
import drop_Up_Icon from "../../../assets/drop_Up_Arrow.svg";
import greenDot from "../../../assets/green_Dot.svg";
import NewGroup from "./newGroup";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../../store/store";
import { ReceiverTypeEnum, RoleEnum, UserStatusEnum } from "../../../enum";
import {
  setConversationWithGroup,
  setConversationWithUser,
  setMessageArray,
} from "../../../reducerFeatures/ConversationWithUserSlice";
import { setChatListActive } from "../../../reducerFeatures/userChatListSlice";
import { getMessageList } from "../../../api/messageService";
import { socket } from "../../../socketFront";
type group = {
  groupId: string;
  groupName: string;
  description: string;
  creatorId: string;
  members: {
    groupMemberId: string;
    userId: string;
    role: RoleEnum;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  }[];
};
type user = {
  firstName: string;
  lastName: string;
  email: string;
  userStatus: UserStatusEnum;
  userId: string;
};
const emptyUser = {
  firstName: "",
  lastName: "",
  email: "",
  userStatus: UserStatusEnum.OFFLINE,
  userId: "",
};
const emptyGroup = {
  groupId: "",
  groupName: "",
  description: "",
  creatorId: "",
  members: [],
};

function ChatListNavBar() {
  const userList = useAppSelector((state) => state.userChatList.userChatList);
  const groupList = useAppSelector((state) => state.userChatList.userGroupList);
  const chatListActive = useAppSelector(
    (state) => state.userChatList.chatListActive
  );
  const objectUser = useAppSelector((state) => state.logedInUser.logedInUser);
  const conversationWithSelectedUser = useAppSelector(
    (state) => state.conversationWithUser.conversationWithUser
  );
  const conversationWithSelectedGroup = useAppSelector(
    (state) => state.conversationWithUser.conversationWithGroup
  );

  const dispatch = useAppDispatch();

  const [showGroupList, setShowGroupList] = useState<boolean>(false);
  const [showUserList, setShowUserList] = useState<boolean>(false);
  const [newGroupPopup, setNewGroupPopup] = useState<boolean>(false);
  const [selectedConversationUser, setSelectedConversationUser] =
    useState<user>(emptyUser);
  const [SelectedConversationGroup, setSelectedConversationGroup] =
    useState<group>(emptyGroup);

  const setConversation = (user: user, group: group) => {
    if (user.userId) {
      dispatch(setConversationWithUser(user));
    }
    if (group.groupId) {
      dispatch(setConversationWithGroup(group));
      socket.emit("addUserToGroupRoom", group.groupId);
    }
    dispatch(setChatListActive(false));
    setSelectedConversationUser(user);
    setSelectedConversationGroup(group);
  };
  useEffect(() => {
    if (!conversationWithSelectedUser.userId) {
      setSelectedConversationUser(emptyUser);
    } else {
      setSelectedConversationUser(conversationWithSelectedUser);
    }
  }, [conversationWithSelectedUser]);
  useEffect(() => {
    if (!conversationWithSelectedGroup.groupId) {
      setSelectedConversationGroup(emptyGroup);
    } else {
      setSelectedConversationGroup(conversationWithSelectedGroup);
      socket.emit("addUserToGroupRoom", conversationWithSelectedGroup.groupId);
    }
  }, [conversationWithSelectedGroup]);

  useEffect(() => {
    if (selectedConversationUser.userId && !SelectedConversationGroup.groupId) {
      setMessage(selectedConversationUser.userId, ReceiverTypeEnum.SINGLE);
    }

    if (SelectedConversationGroup.groupId && !selectedConversationUser.userId) {
      setMessage(SelectedConversationGroup.groupId, ReceiverTypeEnum.GROUP);
    }
  }, [selectedConversationUser, SelectedConversationGroup]);

  const setMessage = async (
    chatWithUser: string,
    receiverType: ReceiverTypeEnum
  ) => {
    const query = {
      userEmail: objectUser.email,
      chatWithUser: chatWithUser,
      userId: objectUser.userId,
      receiverType: receiverType,
    };
    const messageArray = await getMessageList(query);
    dispatch(setMessageArray(messageArray));
  };

  return (
    <div className="bg-[#E3F6FC] flex flex-col gap-5 px-2 py-3 overflow-y-auto flex-grow  sideBarChatList">
      <div className="rounded-md">
        <div className="flex justify-between items-center">
          <button
            className="grow text-left"
            onClick={() => setShowGroupList(!showGroupList)}
          >
            <span className=" text-xl pl-4">Groups</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setNewGroupPopup(true);
                setShowGroupList(true);
              }}
            >
              <img src={plus_Icon} alt="" className="h-6" />
            </button>
            <button
              onClick={() => {
                setShowGroupList(!showGroupList);
              }}
            >
              <img
                src={!showGroupList ? drop_Down_Icon : drop_Up_Icon}
                alt=""
                className="h-8"
              />
            </button>
          </div>
        </div>
        <div className="py-3">
          {groupList &&
            showGroupList &&
            groupList.map((group, index) => (
              <button
                key={index}
                className={`flex items-center pl-4 py-1 w-full gap-3 active:bg-cyan-400 ${
                  SelectedConversationGroup.groupId === group.groupId
                    ? `bg-violet-400 rounded-2xl ${chatListActive ? "max-md:bg-transparent hover:bg-cyan-200 rounded-2xl" : ""}`
                    : " hover:bg-cyan-200 rounded-2xl"
                }`}
                onClick={() => {
                  setConversation(emptyUser, group);
                }}
              >
                <img
                  alt=""
                  src={profile_photo}
                  className="h-10 w-10 rounded-full "
                />
                <div className="flex grow overflow-hidden text-ellipsis text-left">
                  <span className="text-xl grow">{`${group.groupName} `}</span>
                </div>
              </button>
            ))}
        </div>
        {newGroupPopup ? <NewGroup setNewGroupPopup={setNewGroupPopup} /> : ""}
      </div>
      <div className="rounded-md">
        <div className="flex justify-between items-center">
          <button
            className="grow text-left"
            onClick={() => {
              setShowUserList(!showUserList);
            }}
          >
            <span className="text-xl pl-4">Users</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowUserList(!showUserList);
              }}
            >
              <img
                src={!showUserList ? drop_Down_Icon : drop_Up_Icon}
                alt=""
                className="h-8"
              />
            </button>
          </div>
        </div>
        <div className="py-3">
          {userList &&
            showUserList &&
            userList.map((user, index) => (
              <button
                key={index}
                className={`flex items-center pl-4 py-1 w-full gap-3 active:bg-cyan-400 ${
                  selectedConversationUser.userId === user.userId
                    ? `bg-violet-400 rounded-2xl ${chatListActive ? "max-md:bg-transparent hover:bg-cyan-200 rounded-2xl" : ""}`
                    : " hover:bg-cyan-200 rounded-2xl"
                }`}
                onClick={() => setConversation(user, emptyGroup)}
              >
                <div className="relative">
                  <img
                    alt=""
                    src={profile_photo}
                    className="h-10 w-10 rounded-full "
                  />
                  {user.userStatus === UserStatusEnum.ONLINE && (
                    <img
                      src={greenDot}
                      alt=""
                      className="absolute top-[1px] right-[0.5px] h-2.5 z-0"
                    />
                  )}
                </div>
                <div className="flex grow overflow-hidden text-ellipsis text-left">
                  <span className="text-xl grow">{`${user.firstName} ${user.lastName}`}</span>
                </div>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

export default ChatListNavBar;
