import { combineReducers } from "@reduxjs/toolkit";
import { reducer as logedInUserReducer } from "../reducerFeatures/LogedInUserSlice";
import { reducer as userChatListReducer } from "../reducerFeatures/userChatListSlice";
import { reducer as conversationWithUserReducer } from "../reducerFeatures/ConversationWithUserSlice";
const rootReducer = combineReducers({
  logedInUser: logedInUserReducer,
  userChatList: userChatListReducer,
  conversationWithUser: conversationWithUserReducer,
});

export default rootReducer;
