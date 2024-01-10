import { app } from "../config/firebase";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import { toast } from "react-toastify";

import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";

import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      toast.error("something went wrong!");
      console.log(error);
    }
  };
  return (
    <button
      onClick={handleGoogleClick}
      className="bg-red-800 rounded-lg text-white font-semibold text-md uppercase hover:bg-red-900 p-3 disabled:bg-opacity-80 shadow hover:shadow-lg"
      type="button"
    >
      continue with google
    </button>
  );
};

export default OAuth;
