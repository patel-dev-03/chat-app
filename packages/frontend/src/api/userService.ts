import axios from "axios";
import { UserStatusEnum, UserSocialEnum } from "../enum";
import { UserResource } from "@clerk/types";
const apiroute = process.env.REACT_APP_API_BASE_ROUTE;

type verifiedUserEntry = {
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  clerkId: string | null;
  social: UserSocialEnum;
  isVerified: boolean;
};
type loggedInUser = {
  firstName: string;
  lastName: string;
  email: string;
  userStatus: UserStatusEnum;
  userId: string;
};
type UpdateProps = {
  firstName?: string;
  lastName?: string;
};
if (!apiroute) {
  console.error("Api route not found");
}

export const createUser = async (completeSignUp: verifiedUserEntry) => {
  try {
    const createUserResponse = await axios.post(
      `${apiroute}/api/user`,
      {
        email: completeSignUp.email,
        firstName: completeSignUp.firstName,
        lastName: completeSignUp.lastName,
        clerkId: completeSignUp.clerkId,
        social: completeSignUp.social,
        isVerified: completeSignUp.isVerified,
      },
      {
        headers: {
          Authorization: completeSignUp.email,
        },
      }
    );
    if (createUserResponse) {
      return createUserResponse.data.data;
    }
  } catch (err: any) {
    console.error(err);
  }
};
export const getUser = async (clerkUser: UserResource) => {
  if (
    clerkUser.createdAt &&
    clerkUser.primaryEmailAddress?.linkedTo &&
    clerkUser.primaryEmailAddress?.linkedTo.length > 0 &&
    clerkUser.primaryEmailAddress?.linkedTo[0].type == "oauth_google"
  ) {
    const currentTime = new Date();

    const differenceBetweenTime =
      currentTime.getTime() - clerkUser.createdAt.getTime();
    if (differenceBetweenTime < 30000) {
      const user = {
        email: clerkUser.primaryEmailAddress?.emailAddress,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        clerkId: clerkUser.id,
        social: UserSocialEnum.GOOGLE,
        isVerified: true,
      };
      createUser(user);
    }
  }
  const emailAddress = clerkUser.primaryEmailAddress?.emailAddress;

  if (emailAddress) {
    const getUserResponse = await axios.get(
      `${apiroute}/api/user/${clerkUser.id}`,
      {
        headers: {
          Authorization: emailAddress,
        },
      }
    );

    const user: loggedInUser = {
      firstName: getUserResponse.data.data.firstName,
      lastName: getUserResponse.data.data.lastName,
      email: getUserResponse.data.data.email,
      userStatus: getUserResponse.data.data.userStatus,
      userId: getUserResponse.data.data.userId,
    };

    return user;
  }
};
export const updateUserapi = async (
  clerkId: string,
  updatedUser: UpdateProps,
  userEmail: string
) => {
  

  try {
    const userUpdate = updatedUser.firstName
      ? updatedUser.lastName
        ? { firstName: updatedUser.firstName, lastName: updatedUser.lastName }
        : { firstName: updatedUser.firstName }
      : { lastName: updatedUser.lastName };

    const responceUserResponse = await axios.put(
      `${apiroute}/api/user/${clerkId}`,
      userUpdate,
      {
        headers: {
          Authorization: userEmail,
        },
      }
    );
    return responceUserResponse.data.data;
  } catch (error) {
    console.error(error);
  }
};
