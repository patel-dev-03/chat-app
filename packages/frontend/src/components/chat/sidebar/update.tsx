import { useEffect, useState } from "react";
import { validation } from "../../../constants/validationObject";
import { useAppSelector, useAppDispatch } from "../../../store/store";
import { useUser } from "@clerk/clerk-react";
import { updateUserapi } from "../../../api/userService";
import { Navigate } from "react-router-dom";
import Loading from "../../../constants/loading";
import { updateSignedUser } from "../../../reducerFeatures/LogedInUserSlice";

type PropsType = {
  setUpdateUserPopup: (updateUser: boolean) => void;
};
type UpdateProps = {
  firstName: string;
  lastName: string;
};

type clerkUpdate = {
  firstName?: string;

  lastName?: string;
};

function Update(props: PropsType) {
  const dispatch = useAppDispatch();
  const { isLoaded, isSignedIn, user } = useUser();

  const logedInUserInitial = {
    firstName: useAppSelector(
      (state) => state.logedInUser.logedInUser.firstName
    ),
    lastName: useAppSelector((state) => state.logedInUser.logedInUser.lastName),
  };

  const [updateUser, setUpdateUser] = useState<UpdateProps>({
    firstName: "",
    lastName: "",
  });
  const [errorMessage, setErrorMessage] = useState<UpdateProps>({
    firstName: "",
    lastName: "",
  });
  useEffect(() => {
    setUpdateUser(logedInUserInitial);
  }, []);
  if (!isLoaded) {
    return <Loading></Loading>;
  }
  if (!isSignedIn) {
    return <Navigate to="/signUp" />;
  }
  const handleChange = (name: string, value: string) => {
    setUpdateUser((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
    fieldValidation(name, value);
  };
  function fieldValidation(key: string, value: string) {
    let validatingupdateUser = updateUser;
    if (value !== "") {
      validatingupdateUser[key as keyof typeof updateUser] = value;
    }

    if (
      validation[key as keyof typeof validation]["required"] &&
      !validatingupdateUser[key as keyof typeof updateUser]
    ) {
      setErrorMessage((prev) => {
        return {
          ...prev,
          [key]: validation[key as keyof typeof validation].message1,
        };
      });
      return validation[key as keyof typeof validation].message1;
    } else if (
      validation[key as keyof typeof validation].regex &&
      !validation[key as keyof typeof validation].regex.test(
        validatingupdateUser[key as keyof typeof updateUser]
      )
    ) {
      setErrorMessage((prev) => {
        return {
          ...prev,
          [key]: validation[key as keyof typeof validation].message2,
        };
      });
      return validation[key as keyof typeof validation].message2;
    } else {
      setErrorMessage((prev) => {
        return {
          ...prev,
          [key]: "",
        };
      });
      return "";
    }
  }
  const submitUpdateUser = () => {
    const keyArray = Object.keys(updateUser);
    let tempError: UpdateProps = { ...errorMessage };
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
      if (
        updateUser.firstName === logedInUserInitial.firstName &&
        updateUser.lastName === logedInUserInitial.lastName
      ) {
        props.setUpdateUserPopup(false);
      } else if (
        updateUser.firstName === logedInUserInitial.firstName &&
        updateUser.lastName !== logedInUserInitial.lastName
      ) {
        const editedDetails = {
          lastName: updateUser.lastName,
        };
        clerkUpdate(editedDetails);
        setUpdateUser({
          firstName: "",
          lastName: "",
        });
        props.setUpdateUserPopup(false);
      } else if (
        updateUser.firstName !== logedInUserInitial.firstName &&
        updateUser.lastName === logedInUserInitial.lastName
      ) {
        const editedDetails = {
          firstName: updateUser.firstName,
        };
        clerkUpdate(editedDetails);
        setUpdateUser({
          firstName: "",
          lastName: "",
        });
        props.setUpdateUserPopup(false);
      } else {
        clerkUpdate(updateUser);
        setUpdateUser({
          firstName: "",
          lastName: "",
        });
        props.setUpdateUserPopup(false);
      }
    }
  };

  const clerkUpdate = async (editedUser: clerkUpdate) => {
    try {
      const userDetails = await user.update(editedUser);
      if (userDetails.primaryEmailAddress?.emailAddress)
        updateUserapi(
          userDetails.id,
          editedUser,
          userDetails.primaryEmailAddress.emailAddress
        );
      dispatch(updateSignedUser(editedUser));
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
    }
  };

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-[#747c8fcf]  flex items-center justify-center z-[2] ">
      <div className="bg-[#e3f6fc] p-5 rounded-2xl">
        <div>
          <div className="flex flex-col">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              placeholder="Enter the first name"
              id="firstName"
              name="firstName"
              value={updateUser.firstName}
              onChange={(e) => {
                handleChange(e.target.name, e.target.value);
              }}
              onBlur={(e) => {
                fieldValidation(e.target.name, "");
              }}
              className="border-gray-300 rounded-md border py-2 px-3 "
            />
            <span className="text-xs text-red-500">
              {errorMessage.firstName}
            </span>
          </div>
          <div className="flex flex-col py-2">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={updateUser.lastName}
              onChange={(e) => {
                handleChange(e.target.name, e.target.value);
              }}
              onBlur={(e) => {
                fieldValidation(e.target.name, "");
              }}
              className="border-gray-300 rounded-md border py-2 px-3 "
            />
            <span className="text-xs text-red-500">
              {errorMessage.lastName}
            </span>
          </div>
        </div>
        <div className="flex justify-center gap-3">
          <button
            className="bg-[#6588de] p-2 rounded-md"
            onClick={() => {
              submitUpdateUser();
            }}
          >
            Update User
          </button>
          <button
            className="bg-[#6588de] p-2 rounded-md"
            onClick={() => {
              setUpdateUser({
                firstName: "",
                lastName: "",
              });
              setErrorMessage({
                firstName: "",
                lastName: "",
              });
              props.setUpdateUserPopup(false);
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default Update;
