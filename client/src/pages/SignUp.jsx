import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignUp = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { username, email, password } = formData;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
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

  return (
    <section className="p-3 max-w-lg mx-auto">
      <h1 className="text-center py-7 text-3xl font-semibold text-slate-950">
        Sign Up
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="p-3 rounded-lg border shadow"
          type="text"
          placeholder="Username"
          id="username"
          value={username}
          onChange={handleChange}
          required
        />
        <input
          className="p-3 rounded-lg border shadow"
          type="email"
          placeholder="Email"
          id="email"
          value={email}
          onChange={handleChange}
          required
        />
        <input
          className="p-3 rounded-lg border shadow"
          type="password"
          placeholder="Password"
          id="password"
          value={password}
          onChange={handleChange}
          required
        />
        <button
          disabled={loading}
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
      {username.length == 1 && (
        <p className="text-red-600 mt-5">
          username must be atleast 2 characters!
        </p>
      )}
      {error && <p className="text-red-600 mt-5">{error}</p>}
    </section>
  );
};

export default SignUp;
