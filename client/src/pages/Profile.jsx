import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { app } from "../config/firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import { toast } from "react-toastify";

import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
} from "../redux/user/userSlice";

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const [file, setFile] = useState(undefined);
  const [fileUploadError, setFileUploadError] = useState(null);
  const fileRef = useRef(null);
  const [filePerc, setFilePerc] = useState(0);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const fileStorageRef = ref(storage, `profile/${fileName}`);
    const uploadTask = uploadBytesResumable(fileStorageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        console.log("upload error" + error + fileUploadError);
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) =>
          setFormData({ ...formData, avatar: downloadUrl })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        toast.error("something went wrong!");
        return;
      }
      dispatch(updateUserSuccess(data));
      toast.success("user updated successfully!");
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      toast.error("something went wrong!");
    }
  };

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        toast.error("something went wrong!");
        return;
      }
      dispatch(deleteUserSuccess(data));
      toast.success("User deleted successfully!");
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      toast.error("something went wrong!");
    }
  };

  return (
    <section className="flex flex-col gap-4 p-3 max-w-lg mx-auto">
      <h1 className="text-center my-7 text-2xl font-semibold">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          ref={fileRef}
          hidden
        />
        <div className="relative group w-[6.5rem] self-center mb-5">
          <img
            className="w-[6.5rem] h-[6.5rem] rounded-full border cursor-pointer"
            src={formData.avatar || currentUser.avatar}
            alt="profile"
            onClick={() => fileRef.current.click()}
          />
          <p>
            {fileUploadError ? (
              <span className="absolute left-[-6.5rem] top-[6.5rem] w-[30rem] mt-1 text-red-800">
                Error upload image (image must be less then 2 mb)
              </span>
            ) : filePerc > 0 && filePerc < 100 ? (
              <span>{`uploading ${filePerc}`}</span>
            ) : filePerc === 100 ? (
              <span className="absolute left-[-2.5rem] top-[6.5rem] w-[30rem] mt-1 text-green-700">
                image successfully uploaded!
              </span>
            ) : (
              ""
            )}
          </p>
          <div className="w-[20rem] opacity-0 group-hover:opacity-100 duration-300 absolute left-[-7rem] top-[-20px] flex justify-center items-end text-sm text-black font-semibold">
            click to update profile
          </div>
        </div>
        <input
          className="p-3 rounded-lg border-gray-300 border shadow"
          type="text"
          defaultValue={currentUser.username}
          onChange={handleChange}
          id="username"
          placeholder="you may update your username"
        />
        <input
          className="p-3 rounded-lg border-gray-300 border shadow"
          type="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
          id="email"
          placeholder="you may update your email"
        />
        <input
          className="p-3 rounded-lg border-gray-300 border shadow"
          type="password"
          onChange={handleChange}
          id="password"
          placeholder="password"
        />
        <button
          className="p-3 rounded-lg border-gray-300 border shadow bg-slate-700 text-white uppercase hover:bg-slate-800 disabled:bg-opacity-80 hover:shadow-lg transition duration-150 ease-in-out"
          type="submit"
        >
          {loading ? "Loading" : "update"}
        </button>
        <button
          disabled={loading}
          className="p-3 rounded-lg border-gray-300 border shadow bg-green-700 text-white uppercase hover:bg-green-800 disabled:bg-opacity-80 hover:shadow-lg transition duration-150 ease-in-out"
          type="submit"
        >
          create listing
        </button>
      </form>
      <div className="flex justify-between">
        <button onClick={handleDelete} type="button" className="text-red-600">
          Delete Account
        </button>
        <button type="button" className="text-red-600">
          Sign out{" "}
        </button>
      </div>
      {error && <p>{error}</p>}
    </section>
  );
};

export default Profile;
