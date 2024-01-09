import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { authSchema } from "../schemas";

import { FaEye } from "react-icons/fa";
import { BiSolidHide } from "react-icons/bi";

const SignUp = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        toast.error("Something went broke!");
        setLoading(false);
        return;
      }
      setLoading(false);
      setError(null);
      navigate("/signin");
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confPassword: "",
    },
    validationSchema: authSchema,
    onSubmit,
  });

  return (
    <section className="p-3 max-w-lg mx-auto">
      <h1 className="text-center py-7 text-3xl font-semibold text-slate-950">
        Sign Up
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          className={`p-3 rounded-lg border shadow${
            errors.username && touched.username ? "border-2 border-red-700" : ""
          }`}
          type="text"
          id="username"
          placeholder="Username"
          value={values.username}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
        {errors.username && touched.username && (
          <p className="mt-[-18px] text-xs sm:text-sm text-red-600">
            {errors.username}
          </p>
        )}
        <input
          className={`p-3 rounded-lg border shadow${
            errors.email && touched.email ? "border-2 border-red-700" : ""
          }`}
          type="email"
          id="email"
          placeholder="Email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
        {errors.email && touched.email && (
          <p className="mt-[-18px] text-xs sm:text-sm text-red-600">
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
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            id="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {errors.password && touched.password && (
            <p className="text-xs sm:text-sm text-red-600">{errors.password}</p>
          )}
          {showPassword ? (
            <FaEye
              className="absolute top-5 right-3 text-xl"
              onClick={() => setShowPassword((prevState) => !prevState)}
            />
          ) : (
            <BiSolidHide
              className="absolute top-5 right-3 text-xl"
              onClick={() => setShowPassword((prevState) => !prevState)}
            />
          )}
        </div>
        <input
          className={`p-3 rounded-lg border shadow w-full${
            errors.confPassword && touched.confPassword
              ? "border-2 border-red-700"
              : ""
          }`}
          type="password"
          placeholder="confirm password"
          id="confPassword"
          value={values.confPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
        {errors.confPassword && touched.confPassword && (
          <p className="mt-[-18px] text-xs sm:text-sm text-red-600">
            {errors.confPassword}
          </p>
        )}
        <button
          disabled={isSubmitting}
          className="p-3 rounded-lg border shadow bg-slate-700 text-white uppercase font-semibold hover:bg-slate-800 disabled:bg-opacity-80"
          type="submit"
        >
          {loading && !error ? "Loading..." : "sign up"}
        </button>
      </form>
      <p>
        Have an account?{" "}
        <Link className="text-blue-700" to="/signin">
          Sign in
        </Link>
      </p>

      {error && <p className="text-red-600 mt-5">{error}</p>}
    </section>
  );
};

export default SignUp;
