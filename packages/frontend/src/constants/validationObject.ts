export const validation = {
  firstName: {
    required: true,
    message1: "First name is required",
    message2: "Please enter a valid name letters only",
    regex: /^[a-zA-Z]+$/,
  },
  lastName: {
    required: true,
    message1: "Last name is required",
    message2: "Please enter a valid name letters only",
    regex: /^[a-zA-Z]+$/,
  },
  email: {
    required: true,
    message1: "Email is required",
    message2: "Please enter a valid email",
    regex:
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
  },
  password: {
    required: true,
    message1: "Password is required",
    message2:
      "Password needs 8-18 characters, with at least one of each: uppercase, lowercase, number, and special character",
    regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,18}$/,
  },
  confirmPassword: {
    required: true,
    message1: "Confirm Password is required",
    message2:
      "Password needs 8-18 characters, with at least one of each: uppercase, lowercase, number, and special character",
    regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,18}$/,
  },
  termsandcondition: {
    required: true,
    message1: "Please agree to T & C",
    message2: "Please agree to T & C",
    regex: /^[a-zA-Z]+$/,
  },
};

export const groupValidation = {
  groupName: {
    required: true,
    message1: "Group Name is required",
    message2: "Please enter a valid name letters only",
    regex: /^[a-zA-Z]+$/,
  },
  groupDescription: {
    required: false,
    message1: "",
    message2: "Please enter a valid description letter only",
    regex: /^[a-zA-Z]+$/,
  },
};
