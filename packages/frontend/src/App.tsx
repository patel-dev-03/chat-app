import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Settings from "./components/settings";
import { ClerkProvider } from "@clerk/clerk-react";
import AuthGuard from "./Guard/authGaurd";
import UnAuthGuard from "./Guard/unAuthGuard";
import Chat from "./components/chat/chat";
import { io } from "socket.io-client";
const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;


function App() {
  if (!PUBLISHABLE_KEY) {
    return <div>CLERK KEY NOT FOUND</div>;
  }
  

  return (
    <div className="App">
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <BrowserRouter>
          <Routes>
            <Route
              key={"SignUp"}
              path="/signUp"
              element={<UnAuthGuard />}
            ></Route>
            <Route key={"UserHome"} path="/" element={<AuthGuard />}>
              <Route key={"chat"} path="" element={<Chat />}></Route>
              <Route
                key={"Settings"}
                path="/Settings"
                element={<Settings />}
              ></Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ClerkProvider>
    </div>
  );
}

export default App;
