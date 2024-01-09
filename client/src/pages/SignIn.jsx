import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { authSchema } from "../schemas";
import { useState } from "react";

import { FaEye } from "react-icons/fa";
import { BiSolidHide } from "react-icons/bi";

const onSubmit = (values, actions) => {
  console.log("submitted");
  console.log(values);
  console.log(actions);
  actions.resetForm();
};

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: authSchema,
    onSubmit,
  });
  console.log(errors);
  return (
    <section className="p-3 max-w-lg mx-auto">
      <h1 className="text-center py-7 font-semibold text-3xl text-slate-900">
        Sign In
      </h1>

      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="flex flex-col gap-5"
      >
        <input
          className={`p-3 rounded-lg border shadow w-full${
            errors.email && touched.email ? "border-2 border-red-800" : ""
          }`}
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          type="email"
          id="email"
          placeholder="Email"
        />
        {errors.email && touched.email && (
          <p className="mt-[-18px] text-red-600 text-xs sm:text-sm">
            {errors.email}
          </p>
        )}
        <div className="relative">
          <input
            className={`p-3 rounded-lg border shadow w-full ${
              errors.password && touched.password
                ? "border-2 border-red-700"
                : ""
            }`}
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Password"
          />
          {errors.password && touched.password && (
            <p className="text-red-600 text-xs sm:text-sm">{errors.password}</p>
          )}
          {showPassword ? (
            <FaEye
              onClick={() => setShowPassword((prevState) => !prevState)}
              className="absolute top-5 right-3 text-xl"
            />
          ) : (
            <BiSolidHide
              onClick={() => setShowPassword((prevState) => !prevState)}
              className="absolute top-5 right-3 text-xl"
            />
          )}
        </div>
        <button
          disabled={isSubmitting}
          className="p-3 rounded-lg border shadow bg-slate-700 uppercase font-semibold text-white hover:bg-slate-800 disabled:bg-opacity-85"
          type="submit"
        >
          sign in
        </button>
      </form>
      <p>
        Don&apos;t Have an account?
        <Link to="/signup" className="text-blue-600 ml-2">
          Sing up
        </Link>
      </p>
    </section>
  );
};

export default SignIn;
