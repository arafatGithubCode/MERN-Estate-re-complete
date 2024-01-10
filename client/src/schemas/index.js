import * as yup from "yup";

const passwordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{5,}$/;

export const signUpSchema = yup.object().shape({
  username: yup.string().min(2).required("Required"),
  email: yup.string().email("please, enter a valid email").required("Required"),
  password: yup
    .string()
    .min(5)
    .matches(passwordRule, {
      message:
        "create a stronger password(atleast one uppercase, lowercase and digit)",
    })
    .required("Required"),
  confPassword: yup
    .string()
    .oneOf(
      [yup.ref("password"), null],
      "confirm password must match with password!"
    )
    .required("Required"),
});

export const signInSchema = yup.object().shape({
  email: yup.string().email("please, enter a valid email").required("Required"),
  password: yup.string().required("Required"),
});
