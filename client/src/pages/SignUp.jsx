import { Link } from "react-router-dom";
const SignUp = () => {
  return (
    <section className="p-3 max-w-lg mx-auto">
      <h1 className="text-center py-7 text-3xl font-semibold text-slate-950">
        Sign Up
      </h1>
      <form className="flex flex-col gap-4">
        <input
          className="p-3 rounded-lg border shadow"
          type="text"
          placeholder="Username"
          id="username"
        />
        <input
          className="p-3 rounded-lg border shadow"
          type="email"
          placeholder="Email"
          id="email"
        />
        <input
          className="p-3 rounded-lg border shadow"
          type="password"
          placeholder="Password"
          id="password"
        />
        <button
          className="p-3 rounded-lg border shadow bg-slate-700 text-white uppercase font-semibold"
          type="submit"
        >
          sign up
        </button>
      </form>
      <p>
        Have an account?{" "}
        <Link className="text-blue-700" to="/signin">
          Sign in
        </Link>
      </p>
    </section>
  );
};

export default SignUp;
