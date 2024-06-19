import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { RoleEnum, UserStatusEnum } from "../../../enum";
import {
  createGroupMember,
  nonGroupMemberService,
  removeGroupMember,
} from "../../../api/groupService";
import { setConversationWithGroup } from "../../../reducerFeatures/ConversationWithUserSlice";
import { setUpdatedGroupToList } from "../../../reducerFeatures/userChatListSlice";
type PropsType = {
  setAddMemberPopup: (addMemberPopup: boolean) => void;
};
type GroupMemberType = {
  groupMemberId: string;
  role: RoleEnum;
  userId: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
};

type NonGroupMemberType = {
  firstName: string;
  lastName: string;
  email: string;
  userStatus: UserStatusEnum;
  userId: string;
};

function AddMember(props: PropsType) {
  const objectuser = useAppSelector((store) => store.logedInUser.logedInUser);
  const userOrGroup = useAppSelector(
    (store) => store.conversationWithUser.userOrGroup
  );

  const group = useAppSelector(
    (store) => store.conversationWithUser.conversationWithGroup
  );
  const dispatch = useAppDispatch();

  const [groupMember, setGroupMember] = useState<GroupMemberType[]>(
    group.members
  );
  const [nonGroupMember, setNonGroupMember] = useState<NonGroupMemberType[]>(
    []
  );

  useEffect(() => {
    getNonGroupMemberFunc(group.groupId);
    setGroupMember(group.members);
  }, [group]);

  const getNonGroupMemberFunc = async (groupId: string) => {
    const getNonMembers = await nonGroupMemberService(
      groupId,
      objectuser.email
    );
    setNonGroupMember(getNonMembers);
  };
  const removeMemberFromGroup = async (groupMemberId: string) => {

    const response = await removeGroupMember(
      groupMemberId,
      group.groupId,
      objectuser.email
    );
    if (response) {
     
      dispatch(setConversationWithGroup(response.group));
      dispatch(setUpdatedGroupToList(response.group));
      setGroupMember(response.group.members);
      getNonGroupMemberFunc(group.groupId);
    }
  };
  const addMemberToGroup = async (userId: string) => {
    const response = await createGroupMember(
      group.groupId,
      userId,
      objectuser.email
    );
    if (response) {
      dispatch(setConversationWithGroup(response.group));
      dispatch(setUpdatedGroupToList(response.group));
      getNonGroupMemberFunc(group.groupId);
    }
  };
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-[#747c8fcf]  flex items-center justify-center ">
      <div className="bg-[#e3f6fc] p-5 rounded-2xl w-[550px] ">
        <div className="pb-4 flex justify-center">
          <span className="text-center ">Group Members</span>
        </div>
        <div className="flex flex-col h-80 gap-1 pb-3">
          {group.members.map((member, index) => (
            <div className="flex justify-between items-center" key={index}>
              <span>{`${member.user.firstName} ${member.user.lastName}`}</span>
              <div className="flex items-center gap-3">
                <span>{member.role}</span>
                {objectuser.userId === group.creatorId && (
                  <button
                    disabled={
                      member.userId === group.creatorId &&
                      member.role === RoleEnum.ADMIN
                    }
                    className={`${member.userId === group.creatorId && member.role === RoleEnum.ADMIN ? "bg-[#bdccf3] text-slate-600" : "bg-[#6588DE]"} py-1.5 px-3 rounded-md `}
                    onClick={() => {
                     
                      removeMemberFromGroup(member.groupMemberId);
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        {objectuser.userId === group.creatorId && (
          <>
            <hr className=" h-0.5 bg-black border-transparent" />
            <div className="flex justify-center">
              <span>Add users to Group</span>
            </div>
            <div className="flex flex-col gap-1 h-72 py-3">
              {nonGroupMember.map((nonMember, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center gap"
                >
                  <span>{`${nonMember.firstName} ${nonMember.lastName}`}</span>
                  {objectuser.userId === group.creatorId && (
                    <button
                      onClick={() => addMemberToGroup(nonMember.userId)}
                      className="bg-[#6588DE] py-1.5 px-3 rounded-md"
                    >
                      Add Member
                    </button>
                  )}
                </div>
              ))}
            </div>{" "}
          </>
        )}

        <div className="flex justify-center gap-3">
          <button
            className="bg-[#6588de] p-2 rounded-md"
            onClick={() => {
              props.setAddMemberPopup(false);
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddMember;
