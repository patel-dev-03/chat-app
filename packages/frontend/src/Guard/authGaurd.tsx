import { useUser } from "@clerk/clerk-react";

import {  Navigate, Outlet } from "react-router-dom";

import Loading from "../constants/loading";

const AuthGuard = () => {
  const { isSignedIn, isLoaded } = useUser();
 
  
  if (!isLoaded) {
    return (
      
<Loading></Loading>      
    );
  }
  if (isSignedIn) {
    return <Outlet />;
  } else {
    return <Navigate to="/signUp" />;
  }
};

export default AuthGuard;
