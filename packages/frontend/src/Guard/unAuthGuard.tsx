import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import SignUp from "../components/signUp";

const UnAuthGuard = () => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <>
        <div>Clerk Loading</div>
      </>
    );
  }

  if (isSignedIn) {
    return <Navigate to="/" />;
  }

  return <SignUp />;
};

export default UnAuthGuard;
