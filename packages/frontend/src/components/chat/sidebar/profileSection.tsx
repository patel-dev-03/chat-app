import React, { useState } from "react";
import { useAuth } from "@clerk/clerk-react";

import { useAppSelector } from "../../../store/store";
import Update from "./update";
import three_vertical from "../../../assets/three_Vertical.svg";
import yelloDot from "../../../assets/yellow_Dot.svg";
import profile_photo from "../../../assets/profile-Pic.jpg";

function ProfileSection() {
  const { signOut } = useAuth();

  const [profilePopupBox, setPropfilePopUpBox] = useState(false);
  const [updateUserPopUp, setupdateUserPopup] = useState(false);
  const objectUser = useAppSelector((state) => state.logedInUser.logedInUser);

  const profilePopUp = () => {
    setPropfilePopUpBox(!profilePopupBox);
  };

  const signOutUser = async (signOutUser: boolean) => {
    if (signOutUser) {
      signOut();
    }
  };

  return (
    <div className="mb-3 ">
      <div className="pl-5 py-2 pr-2 flex items-center bg-[#E3F6FC] justify-between rounded-br-md  ">
        <div className="flex items-center gap-2.5  ">
          <div>
            <img alt="" src={profile_photo} className="h-12 rounded-2xl" />
          </div>

          <div>
            <div className="flex">
              <span className="text-xl block first-letter:uppercase">{`${objectUser.firstName}`}</span>
              &nbsp;
              <span className="text-xl block first-letter:uppercase">
                {`${objectUser.lastName}`}
              </span>
            </div>
            <button className="flex items-center gap-1 py-0.5 px-1.5 bg-[#6588DE] rounded-md text-xs">
              <img alt="" src={yelloDot} className="h-1  " />
              <span>{objectUser.userStatus}</span>
            </button>
          </div>
        </div>
        <div className="">
          <button
            onClick={() => {
              profilePopUp();
            }}
          >
            <img alt="" src={three_vertical} className="h-9" />
          </button>
        </div>
      </div>
      {profilePopupBox ? (
        <div className=" bg-[#fdfdfd] px-4 py-2 rounded-lg flex flex-col items-center">
          <div>
            <span className="text-xl">{objectUser.email}</span>
          </div>
          <div className="flex gap-3">
            <button
              className="bg-[#6588de] rounded-md p-2"
              onClick={() => {
                setupdateUserPopup(true);
              }}
            >
              Update User
            </button>
            {updateUserPopUp ? (
              <Update setUpdateUserPopup={setupdateUserPopup} />
            ) : (
              ""
            )}
            <button
              className="bg-[#6588de] rounded-md p-2"
              onClick={() => {
                signOutUser(true);
              }}
            >
              SignOut
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default ProfileSection;
