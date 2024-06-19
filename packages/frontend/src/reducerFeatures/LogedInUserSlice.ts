import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserStatusEnum } from "../enum";
type LogedInUserProps = {
  firstName: string;
  lastName: string;
  email: string;
  userStatus: UserStatusEnum;
  userId: string;
};
type InitialStateProps = {
  logedInUser: LogedInUserProps;
};
const initialState: InitialStateProps = {
  logedInUser: {
    firstName: "",
    lastName: "",
    email: "",
    userStatus: UserStatusEnum.OFFLINE,
    userId: "",
  },
};

export const LogedInUserSlice = createSlice({
  name: "LogedInUserSlice",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<LogedInUserProps>) {
      state.logedInUser = action.payload;
    },
    updateSignedUser(state, action) {
      state.logedInUser = {
        ...state.logedInUser,
        ...action.payload,
      };
    },
  },
});
export const { reducer } = LogedInUserSlice;
export const { setUser, updateSignedUser } = LogedInUserSlice.actions;
export default LogedInUserSlice.reducer;
