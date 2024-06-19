import React, { useState } from "react";
import { createGroup } from "../../../api/groupService";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import {
  setAddNewGroupToList,
  setChatListActive,
} from "../../../reducerFeatures/userChatListSlice";
import { setConversationWithGroup } from "../../../reducerFeatures/ConversationWithUserSlice";
type newGroup = {
  groupName: string;
  groupDescription: string;
};
type PropsType = {
  setNewGroupPopup: (newGroup: boolean) => void;
};
function NewGroup(props: PropsType) {
  const objectUser = useAppSelector((state) => state.logedInUser.logedInUser);
  const dispatch = useAppDispatch();
  const [newGroup, setNewGroup] = useState<newGroup>({
    groupName: "",
    groupDescription: "",
  });
  const [errorMessage, setErrorMessage] = useState<newGroup>({
    groupName: "",
    groupDescription: "",
  });
  const handleChange = (name: string, value: string) => {
    setNewGroup((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
    fieldValidation(name, value);
  };
  const handleSubmit = () => {
    const keyArray = Object.keys(newGroup);
    let tempError: newGroup = { ...errorMessage };
    let count = 0;
    keyArray.forEach((key) => {
      tempError = {
        ...tempError,
        [key]: fieldValidation(key, ""),
      };
      if (tempError[key as keyof typeof tempError] === "") {
        count++;
      }
    });

    if (count === keyArray.length) {
      createNewGroup();
    }
  };

  const createNewGroup = async () => {
    const createNewGroup = {
      groupName: newGroup.groupName,
      description: newGroup.groupDescription,
      creatorId: objectUser.userId,
    };

    const response = await createGroup(createNewGroup, objectUser.email);

    if (response) {
      setNewGroup({
        groupDescription: "",
        groupName: "",
      });
      dispatch(setAddNewGroupToList(response));
      dispatch(setConversationWithGroup(response));
      dispatch(setChatListActive(false));
    }

    props.setNewGroupPopup(false);
  };

  const fieldValidation = (key: string, value: string) => {
    let validatingFormData = newGroup;
    if (value !== "") {
      validatingFormData[key as keyof typeof newGroup] = value;
    }

    if (key === "groupDescription" && validatingFormData.groupDescription) {
      setErrorMessage((prev) => {
        return {
          ...prev,
          [key]: /^[a-zA-Z\s]*$/.test(validatingFormData.groupDescription)
            ? ""
            : "Please enter letters only",
        };
      });
      return /^[a-zA-Z\s]*$/.test(validatingFormData.groupDescription)
        ? ""
        : "Please enter letters only";
    }
    if (key === "groupName") {
      if (!validatingFormData.groupName) {
        setErrorMessage((prev) => {
          return {
            ...prev,
            [key]: "Group Name is compulsory",
          };
        });
        return "Group Name is compulsory";
      } else {
        setErrorMessage((prev) => {
          return {
            ...prev,
            [key]: /^[a-zA-Z\s]*$/.test(validatingFormData.groupName)
              ? ""
              : "Please enter letters only",
          };
        });
        return /^[a-zA-Z\s]*$/.test(validatingFormData.groupName)
          ? ""
          : "Please enter letters only";
      }
    }
  };

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-[#747c8fcf]  flex items-center justify-center z-10">
      <div className="bg-[#e3f6fc] p-5 rounded-2xl">
        <div className="pb-4">
          <span>Enter the Group Name and Description</span>
        </div>
        <div className="">
          <div className="flex flex-col">
            <label htmlFor="groupName">Group Name: </label>
            <input
              type="text"
              id="groupName"
              name="groupName"
              placeholder="chatApplication"
              onChange={(e) => {
                handleChange(e.target.name, e.target.value);
              }}
              onBlur={(e) => {
                fieldValidation(e.target.name, "");
              }}
              className="border-gray-300 rounded-md border py-2 px-3 "
            />
            <span className="text-xs text-red-500">
              {errorMessage.groupName}
            </span>
          </div>
          <div className="flex flex-col py-2">
            <label htmlFor="groupDisc">Group Description: </label>
            <input
              type="text"
              id="groupDescription"
              name="groupDescription"
              placeholder="End to end chat app"
              onChange={(e) => {
                handleChange(e.target.name, e.target.value);
              }}
              onBlur={(e) => {
                fieldValidation(e.target.name, "");
              }}
              className="border-gray-300 rounded-md border py-2 px-3 "
            />
            <span className="text-xs text-red-500">
              {errorMessage.groupDescription}
            </span>
          </div>
        </div>
        <div className="flex justify-center gap-3">
          <button
            className="bg-[#6588de] p-2 rounded-md"
            onClick={() => {
              handleSubmit();
            }}
          >
            Submit
          </button>
          <button
            className="bg-[#6588de] p-2 rounded-md"
            onClick={() => {
              setErrorMessage({
                groupName: "",
                groupDescription: "",
              });
              setNewGroup({
                groupName: "",
                groupDescription: "",
              });
              props.setNewGroupPopup(false);
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewGroup;
