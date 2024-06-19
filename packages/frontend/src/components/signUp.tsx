import React, { useState } from "react";
import officePhoto from "../assets/sign_Up_Office.svg";
import googleLogo from "../assets/Google_G_logo.svg";
import passwordShow from "../assets/password_show.svg";
import passwordHide from "../assets/password_hide.svg";
import { Link, useNavigate } from "react-router-dom";
import { useSignIn, useSignUp } from "@clerk/clerk-react";
import { createUser } from "../api/userService";
import { validation } from "../constants/validationObject";
import Loading from "../constants/loading";
import { UserSocialEnum } from "../enum";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsandcondition: string;
};

type SignInData = {
  email: string;
  password: string;
};
function SignUp() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsandcondition: "",
  });
  const navigate = useNavigate();
  const [isSigningIn, setSignIn] = useState(true);
  const [errorMessage, setErrorMessage] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsandcondition: "",
  });
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const { isLoaded, signUp, setActive } = useSignUp();
  const { signIn } = useSignIn();
  const [emailVerificaion, setEmailVerification] = useState(false);
  const [code, setCode] = useState("");
  function handleChange(name: string, value: string) {
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
    fieldValidation(name, value);
  }
  function handleTandC(name: string, checked: boolean) {
    setFormData((prev) => {
      return {
        ...prev,
        [name]: checked,
      };
    });
  }
  async function onSignUpsubmit() {
    const keyArray = Object.keys(formData);
    let tempError: FormData = { ...errorMessage };
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

    if (count === keyArray.length && !isSigningIn) {
      clerkSignUp();
    }
    if (count === 2 && isSigningIn) {
      let signData = {
        email: formData.email,
        password: formData.password,
      };

      clerkSignIn(signData);
    }
    count = 0;
  }

  function fieldValidation(key: string, value: string) {
    let validatingFormData = formData;
    if (value !== "") {
      validatingFormData[key as keyof typeof formData] = value;
    }

    if (
      validation[key as keyof typeof validation].required &&
      !validatingFormData[key as keyof typeof formData]
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
        validatingFormData[key as keyof typeof formData]
      )
    ) {
      if (key === "password" && validatingFormData.confirmPassword !== "") {
        fieldValidation("confirmPassword", "");
      }
      if (
        key === "confirmPassword" &&
        validatingFormData[key as keyof typeof formData] !==
          validatingFormData.password
      ) {
        setErrorMessage((prev) => {
          return {
            ...prev,
            [key]: "Password does not match",
          };
        });
        return "Password does not match";
      } else {
        setErrorMessage((prev) => {
          return {
            ...prev,
            [key]: validation[key as keyof typeof validation].message2,
          };
        });
        return validation[key as keyof typeof validation].message2;
      }
    } else if (
      validation[key as keyof typeof validation].regex.test(
        validatingFormData[key as keyof typeof formData]
      ) &&
      key === "confirmPassword" &&
      validatingFormData[key as keyof typeof formData] !==
        validatingFormData.password
    ) {
      setErrorMessage((prev) => {
        return {
          ...prev,
          [key]: "Password does not match",
        };
      });
      return "Password does not match";
    } else if (
      validation[key as keyof typeof validation].regex.test(
        validatingFormData[key as keyof typeof formData]
      ) &&
      key === "password" &&
      validatingFormData[key as keyof typeof validation] !==
        validatingFormData.confirmPassword &&
      validation["confirmPassword"].regex.test(
        validatingFormData.confirmPassword
      )
    ) {
      setErrorMessage((prev) => {
        return {
          ...prev,
          confirmPassword: "Password does not match",
        };
      });
      return "Password does not match";
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
  function formChange() {
    setSignIn(!isSigningIn);
    Object.keys(errorMessage).forEach((key) => {
      setErrorMessage((prev) => {
        return {
          ...prev,
          [key]: "",
        };
      });
    });
    Object.keys(formData).forEach((key) => {
      setFormData((prev) => {
        return {
          ...prev,
          [key]: "",
        };
      });
    });
  }
  function handleShowPassword(pwd: string) {
    return function () {
      setShowPassword((prev) => {
        return {
          ...prev,
          [pwd]: !showPassword[pwd as keyof typeof showPassword],
        };
      });
    };
  }
  async function clerkSignIn(signData: SignInData) {
    if (!isLoaded) {
      console.error("not loaded");
      return;
    }
    try {
      const signInAttempt = await signIn?.create({
        strategy: "password",
        password: signData.password,
        identifier: signData.email,
      });

      if (signInAttempt?.status !== "complete") {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
      if (signInAttempt?.status === "complete") {
        navigate(`/`);

        await setActive({ session: signInAttempt.createdSessionId });
      }
    } catch (err: any) {
      console.error("error", err.errors[0].longMessage);
    }
  }
  async function clerkSignUp() {
    if (!isLoaded) {
      console.error("not loaded");
      return;
    }
    try {
      const signUpAttempt = await signUp.create({
        emailAddress: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
      });

      await signUpAttempt.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setEmailVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  }
  async function onPressVerify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp?.status !== "complete") {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
      if (completeSignUp?.status === "complete") {
        navigate(`/`);

        await setActive({ session: completeSignUp.createdSessionId });

        const verifiedUser = {
          email: completeSignUp.emailAddress,
          firstName: completeSignUp.firstName,
          lastName: completeSignUp.lastName,
          clerkId: completeSignUp.createdUserId,
          social: UserSocialEnum.EMAIL,
          isVerified:
            completeSignUp.verifications.emailAddress.status === "verified"
              ? true
              : false,
        };
        createUser(verifiedUser);
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  }
  async function gooleSignInAuth() {
    if (!isLoaded) {
      return <Loading></Loading>;
    }
    await signIn?.authenticateWithRedirect({
      redirectUrl: "/",
      redirectUrlComplete: "/",
      strategy: "oauth_google",
    });
  }
  async function googleSignUpAuth() {
    if (!isLoaded) {
      return <Loading></Loading>;
    }
    try {
      const value = await signUp.authenticateWithRedirect({
        redirectUrl: "/signUp",
        redirectUrlComplete: "/signUp",
        strategy: "oauth_google",
        continueSignUp: true,
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex flex-grow h-screen w-full  bg-cyan-100">
      <div className="flex  justify-center items-center w-1/2 h-full  max-lg:w-1/3 max-md:hidden">
        <img src={officePhoto} alt="office" className="w-2/3 max-lg:w-3/4" />
      </div>

      <div className="flex  justify-center items-center w-1/2 h-full max-lg:w-2/3 max-md:w-full   ">
        <div className="bg-white flex-c items-center justify-center p-7 rounded-2xl w-[32rem] max-sm:w-full">
          <div className=" text-center py-2 text-red-800 font-bold text-2xl">
            {isSigningIn ? "Sign In" : "Sign Up"}
          </div>
          <div className="flex justify-center border p-1 rounded-md">
            <button
              className="flex "
              onClick={() =>
                isSigningIn ? gooleSignInAuth() : googleSignUpAuth()
              }
            >
              <img alt="" src={googleLogo} />
              <span>Google</span>
            </button>
          </div>

          <div className=" flex py-2 items-center">
            <div className="flex-grow border-t border-gray-400"></div>
            <span className="flex-shrink items-center mx-4 text-black text-xs bg-gray-200 px-5 py-1 rounded-md">
              {" "}
              Or Continue email{" "}
            </span>
            <div className="flex-grow border-t border-gray-400"></div>
          </div>
          {!isSigningIn && (
            <div className="flex gap-3 py-2 xs:max-sm:flex xs:max-sm:flex-col firstLast">
              <div className="flex flex-col w-full">
                <label htmlFor="firstName" className="text-sm font-medium">
                  Firstname <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter the first name"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
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
              <div className="flex flex-col w-full">
                <label htmlFor="lastName" className="text-sm font-medium">
                  Lastname <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter the Last name"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={(e) => {
                    handleChange(e.target.name, e.target.value);
                  }}
                  onBlur={(e) => {
                    fieldValidation(e.target.name, "");
                  }}
                  className="border-gray-300 rounded-md border py-2 px-3"
                />
                <span className="text-xs text-red-500">
                  {errorMessage.lastName}
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-col py-2">
            <label htmlFor="email" className="text-sm font-">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              placeholder="Enter the email"
              id="email"
              name="email"
              value={formData.email}
              onChange={(e) => {
                handleChange(e.target.name, e.target.value);
              }}
              onBlur={(e) => {
                fieldValidation(e.target.name, "");
              }}
              className="border-gray-300 rounded-md border py-2 px-3"
            />
            <span className="text-xs text-red-500">{errorMessage.email}</span>
          </div>
          <div className="flex flex-col  py-2 relative">
            <label htmlFor="password" className="text-sm font-medium">
              Password <span className="text-red-600">*</span>
            </label>
            <input
              type={showPassword.password ? "text" : "password"}
              placeholder="Enter the password"
              id="password"
              name="password"
              value={formData.password}
              onChange={(e) => {
                handleChange(e.target.name, e.target.value);
              }}
              onBlur={(e) => {
                fieldValidation(e.target.name, "");
              }}
              className="border-gray-300 rounded-md border py-2 px-3"
            />
            <span
              className="flex justify-around items-center cursor-pointer absolute top-8 right-2  p-1 rounded-md"
              onClick={handleShowPassword("password")}
            >
              <img
                alt=""
                src={showPassword.password ? passwordHide : passwordShow}
                className="h-6"
              />
            </span>
            <span className="text-xs text-red-500">
              {errorMessage.password}
            </span>
          </div>

          {isSigningIn ? (
            <div>
              <div>
                <span>
                  <button
                    onClick={() => setSignIn(false)}
                    className="text-orange-500 text-sm pt-1 pb-5"
                  >
                    Forgot Password?
                  </button>
                </span>
              </div>

              {/* 

                        <div className='flex gap-2 text-sm items-center pt-1 pb-5'>
                            <input type="checkbox" id='rememberme' name='rememberme' onChange={e => { }} />
                            <label htmlFor="rememberme">Remember me</label>
                        </div> */}
              <button
                onClick={() => {
                  onSignUpsubmit();
                }}
                className="w-full bg-orange-500 rounded-md text-sm p-2 text-slate-700"
              >
                SignIn
              </button>
            </div>
          ) : (
            <div>
              <div className="flex flex-col py-2 relative">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  Confirm Password <span className="text-red-600">*</span>
                </label>
                <input
                  type={showPassword.confirmPassword ? "text" : "password"}
                  placeholder="Enter the password Again"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    handleChange(e.target.name, e.target.value);
                  }}
                  onBlur={(e) => {
                    fieldValidation(e.target.name, "");
                  }}
                  className="border-gray-300 rounded-md border py-2 px-3 "
                />
                <span
                  className="flex justify-around items-center cursor-pointer absolute top-8 right-2  p-1 rounded-md"
                  onClick={handleShowPassword("confirmPassword")}
                >
                  <img
                    alt=""
                    src={
                      showPassword.confirmPassword ? passwordHide : passwordShow
                    }
                    className="h-6"
                  />
                </span>
                <span className="text-xs text-red-500 ">
                  {errorMessage.confirmPassword}
                </span>
              </div>
              <div className="flex gap-2 text-sm items-center pt-1 pb-5">
                <input
                  type="checkbox"
                  id="termsandcondition"
                  name="termsandcondition"
                  value={formData.termsandcondition}
                  onChange={(e) => {
                    handleTandC(e.target.name, e.target.checked);
                  }}
                  onBlur={(e) => {
                    fieldValidation(e.target.name, "");
                  }}
                />
                <label htmlFor="termsandcondition">
                  I agree to the{" "}
                  <a href="/" className="text-orange-500">
                    terms of use{" "}
                  </a>{" "}
                  and
                  <a href="/" className="text-orange-500">
                    {" "}
                    privacy policy
                  </a>
                  .{" "}
                </label>
                <span className="text-xs text-red-500">
                  {errorMessage.termsandcondition}
                </span>
              </div>
              <button
                onClick={() => {
                  onSignUpsubmit();
                }}
                className="w-full bg-orange-500 rounded-md text-sm p-2 text-slate-700"
              >
                SignUp
              </button>
            </div>
          )}

          <div className="pt-4">
            {isSigningIn ? (
              <span>
                Don't have an account?{" "}
                <button
                  onClick={() => formChange()}
                  className="text-orange-500"
                >
                  Sign Up
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{" "}
                <button
                  onClick={() => formChange()}
                  className="text-orange-500"
                >
                  Log in
                </button>
              </span>
            )}
            
            {emailVerificaion && (
              <div>
                <form onSubmit={(e) => onPressVerify(e)}>
                  <input
                    value={code}
                    placeholder="Code..."
                    onChange={(e) => setCode(e.target.value)}
                  />
                  <button type="submit">Verify Email</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
