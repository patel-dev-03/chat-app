import axios from "axios";
import { RoleEnum } from "../enum";
const apiroute = process.env.REACT_APP_API_BASE_ROUTE;
type createGroup = {
  creatorId: string;
  description?: string;
  groupName: string;
};

export const getUserGroupList = async (userId: string, userEmail: string) => {
  try {
    const userGroupList = await axios.get(`${apiroute}/api/group/${userId}`, {
      headers: {
        Authorization: userEmail,
      },
    });
    return userGroupList.data.data;
  } catch (error) {
    console.error(error);
  }
};

export const createGroup = async (
  createGroup: createGroup,
  userEmail: string
) => {
  try {
    const createGroupResponce = await axios.post(
      `${apiroute}/api/group/createGroup/${createGroup.creatorId}`,
      {
        description: createGroup.description,
        groupName: createGroup.groupName,
      },
      {
        headers: {
          Authorization: userEmail,
        },
      }
    );
    return createGroupResponce.data.data;
  } catch (error) {
    console.error(error);
  }
};

export const createGroupMember = async (
  groupId: string,
  groupMemberUserId: string,
  userEmail: string
) => {
  const groupMember = {
    groupId: groupId,
    userId: groupMemberUserId,
    role: RoleEnum.MEMBER,
  };

  try {
    const createGroupMember = await axios.post(
      `${apiroute}/api/group/groupMember/${groupId}`,
      groupMember,
      {
        headers: {
          Authorization: userEmail,
        },
      }
    );
    return createGroupMember.data.data;
  } catch (error) {
    console.error(error);
  }
};
export const removeGroupMember = async (
  groupMemberId: string,
  groupId: string,
  userEmail: string
) => {
 

  try {
    const deleteGroupMember = await axios.delete(
      `${apiroute}/api/group/groupMember/${groupMemberId}`,
      {
        headers: {
          Authorization: userEmail,
        },
        params: {
          groupId: groupId,
        },
      }
    );
    return deleteGroupMember.data.data;
  } catch (error) {
    console.error(error);
  }
};
export const nonGroupMemberService = async (
  groupId: string,
  userEmail: string
) => {
  try {
    const getNonGroupMembers = await axios.get(
      `${apiroute}/api/group/nonGroupMember/${groupId}`,
      {
        headers: {
          Authorization: userEmail,
        },
      }
    );

    return getNonGroupMembers.data.data;
  } catch (error) {
    console.error(error);
  }
};
