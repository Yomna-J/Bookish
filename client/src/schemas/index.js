import * as yup from "yup";

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
// min 5 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit.

export const searchSchema = yup.object().shape({
  search: yup.string(),
});

export const registerSchema = yup.object().shape({
  email: yup.string().email("Please enter a valid email").required("Required"),
  firstName: yup
    .string()
    .min(2, "First Name must be at least 2 characters long")
    .required("Required"),
  lastName: yup
    .string()
    .min(2, "Last Name must be at least 2 characters long")
    .required("Required"),
  password: yup
    .string()
    .min(5)
    .matches(passwordRules, { message: "Please create a stronger password" })
    .required("Required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Required"),
  phone: yup
    .string()
    .matches(/^\+?\d+$/, "Phone Number must contain only numbers")
    .min(10, "Phone Number must contain at least 10 characters")
    .max(15, "Phone Number must be at most 15 digits")
    .required("Phone Number is required"),
});

export const signInSchema = yup.object().shape({
  email: yup.string().email("Please enter a valid email").required("Required"),
  password: yup.string().required("Required"),
});
