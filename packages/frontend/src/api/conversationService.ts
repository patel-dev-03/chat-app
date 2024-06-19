import axios from "axios";
const apiroute = process.env.REACT_APP_API_BASE_ROUTE;

export const getUserChatList = async (userId: string, email: string) => {
  try {
    const userChatList = await axios.get(
      `${apiroute}/api/conversation/${userId}`,
      {
        headers: {
          Authorization: email,
        },
      }
    );


    return userChatList.data.data;
  } catch (error) {
    console.error(error);
  }
};
