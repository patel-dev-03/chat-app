import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RoleEnum, UserStatusEnum } from "../enum";

type userChatList = {
  firstName: string;
  lastName: string;
  email: string;
  userStatus: UserStatusEnum;
  userId: string;
  unReadMessages: Number;
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
type userGroup = {
  groupId: string;
  groupName: string;
  description: string;
  creatorId: string;
  members: groupMember[];
};
type InitialStateProps = {
  userChatList: userChatList[];
  chatListActive: boolean;
  userGroupList: userGroup[];
};
const initialState: InitialStateProps = {
  userChatList: [],
  chatListActive: true,
  userGroupList: [],
};

export const UserChatListSlice = createSlice({
  name: "UserChatList",
  initialState,
  reducers: {
    setUserChatList(state, action: PayloadAction<userChatList[]>) {
      state.userChatList = action.payload;
    },
    setChatListActive(state, action: PayloadAction<boolean>) {
      state.chatListActive = action.payload;
    },
    setUserGroupList(state, action: PayloadAction<userGroup[]>) {
      state.userGroupList = action.payload;
    },
    setAddNewGroupToList(state, action: PayloadAction<userGroup>) {
      state.userGroupList.push(action.payload);
    },
    setUpdatedGroupToList(state, action: PayloadAction<userGroup>) {
      state.userGroupList = state.userGroupList.map((group) => {
        if (group.groupId === action.payload.groupId) {
          group = action.payload;
        }
        return group;
      });
    },
  },
});

export const { reducer } = UserChatListSlice;
export const {
  setUserChatList,
  setChatListActive,
  setUserGroupList,
  setAddNewGroupToList,
  setUpdatedGroupToList,
} = UserChatListSlice.actions;
export default UserChatListSlice.reducer;
