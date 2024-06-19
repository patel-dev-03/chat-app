import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ReceiverTypeEnum, RoleEnum, UserStatusEnum } from "../enum";

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
type ConversationWithUser = {
  firstName: string;
  lastName: string;
  email: string;
  userStatus: UserStatusEnum;
  userId: string;
};
type groupMember = {
  groupMemberId: string;
  userId: string;
  role: RoleEnum;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
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
type userGroup = {
  groupId: string;
  groupName: string;
  description: string;
  creatorId: string;
  members: groupMember[];
};
type InitialStateProps = {
  conversationWithUser: ConversationWithUser;
  userOrGroup: boolean;
  conversationWithGroup: userGroup;
  messages: Message[];
};

const initialState: InitialStateProps = {
  conversationWithUser: emptyUser,
  messages: [],
  conversationWithGroup: emptyGroup,
  userOrGroup: true,
};
export const ConversationWithUser = createSlice({
  name: "ConversationWithUser",
  initialState,
  reducers: {
    setConversationWithUser(
      state,
      action: PayloadAction<ConversationWithUser>
    ) {
      state.conversationWithUser = action.payload;
      state.conversationWithGroup = emptyGroup;
      state.userOrGroup = true;
    },
    setMessageArray(state, action: PayloadAction<Message[]>) {
      state.messages = action.payload;
    },
    setLatestMessageArray(state, action: PayloadAction<Message[]>) {
      const allMessages = action.payload.concat(state.messages);
      state.messages = allMessages;
    },
    setNewMessage(state, action: PayloadAction<Message>) {
      state.messages.unshift(action.payload);
    },
    setConversationWithGroup(state, action: PayloadAction<userGroup>) {
      state.conversationWithGroup = action.payload;
      state.conversationWithUser = emptyUser;
      state.userOrGroup = false;
    },
  },
});
export const { reducer } = ConversationWithUser;
export const {
  setConversationWithUser,
  setMessageArray,
  setNewMessage,
  setConversationWithGroup,
  setLatestMessageArray,
} = ConversationWithUser.actions;
export default ConversationWithUser.reducer;
