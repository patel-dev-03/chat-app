import singleuser from "../../../assets/single_user_icon.svg";
import groupusers from "../../../assets/group_user_icon.svg";
import startFavIcon from "../../../assets/star_Shape.svg";
import searchIcon from "../../../assets/search_Icon.svg";

import ChatListNavBar from "./chatListNavBar";

import ProfileSection from "./profileSection";
const SideBar = () => {
  return (
    <div className={` w-full  flex flex-col h-full justify-between  `}>
      <ProfileSection />
      <ChatListNavBar />
      <div className="px-5 pt-[21px] bg-[#E3F6FC] border-[#D0D9DF] border-t-[2px] h-max  ">
        <div className="flex justify-between">
          <button className="pb-6 border-[#6588DE] border-b-2 px-1">
            <img alt="" src={singleuser} className="h-6" />
          </button>
          <button className="pb-6 border-[#6588DE] border-b-2 px-1">
            <img alt="" src={groupusers} className="h-6" />
          </button>
          <button className="pb-6 border-[#6588DE] border-b-2 px-1">
            <img alt="" src={startFavIcon} className="h-6" />
          </button>
          <button className="pb-6 border-[#6588DE] border-b-2 px-1">
            <img alt="" src={searchIcon} className="h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
