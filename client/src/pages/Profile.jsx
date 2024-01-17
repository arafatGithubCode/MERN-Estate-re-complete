import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { app } from "../config/firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutFailure,
  signOutStart,
  signOutSuccess,
} from "../redux/user/userSlice";

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const [file, setFile] = useState(undefined);
  const [fileUploadError, setFileUploadError] = useState(null);
  const fileRef = useRef(null);
  const [filePerc, setFilePerc] = useState(0);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [showListingErr, setShowListingErr] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [deleteListingErr, setDeleteListingErr] = useState(null);

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

  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const res = await axios.get("/api/auth/signout");
      const data = res.data;
      if (data.success === false) {
        dispatch(signOutFailure(data.message));
        toast.error("something went wrong!");
        return;
      }
      dispatch(signOutSuccess(data));
      toast.success("User logged out successfully!");
    } catch (error) {
      toast.error("something went wrong!");
    }
  };

  const handleShowListing = async () => {
    try {
      setShowListingErr(false);
      const res = await axios.get(`/api/user/listings/${currentUser._id}`);
      const data = res.data;
      if (data.success === false) {
        setShowListingErr(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingErr(true);
    }
  };

  const deleteListing = async (listingId) => {
    const res = await axios.delete(`/api/listing/delete/${listingId}`);
    const data = res.data;
    if (data.success === false) {
      setDeleteListingErr(data.message);
      toast.error("something went wrong");
    }
    setUserListings((prev) =>
      prev.filter((listing) => listing._id !== listingId)
    );
    setDeleteListingErr(false);
    toast.success("Listing deleted successfully!");
  };

  return (
    <section className="flex flex-col gap-4 p-3 max-w-lg mx-auto mb-7">
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
        <Link
          to={`/create-listing`}
          className="p-3 rounded-lg border-gray-300 border shadow bg-green-700 text-white uppercase hover:bg-green-800 disabled:bg-opacity-80 hover:shadow-lg transition duration-150 ease-in-out text-center"
        >
          create listing
        </Link>
      </form>
      <div className="flex justify-between">
        <button onClick={handleDelete} type="button" className="text-red-600">
          Delete Account
        </button>
        <button onClick={handleSignOut} type="button" className="text-red-600">
          Sign out{" "}
        </button>
      </div>
      <button
        onClick={handleShowListing}
        disabled={loading}
        className="text-green-600 hover:font-semibold transition duration-150 ease-in-out disabled:opacity-[0.5]"
        type="button"
      >
        {loading ? "Loading..." : "Show Listings"}
      </button>
      {error && <p className="text-red-600">{error}</p>}
      {showListingErr && <p className="text-red-600">Error showing listings</p>}
      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="font-semibold text-xl text-center">Your listings</h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="flex gap-2 items-center justify-between bg-white rounded-lg px-4 py-1 border border-gray-300 shadow"
            >
              <Link
                to={`/listing/${listing._id}`}
                className="flex items-center gap-2 flex-1"
              >
                <img
                  className="w-[4rem]"
                  src={listing.imageUrls[0]}
                  alt="Image"
                />
                <p className="truncate font-semibold hover:underline flex-1">
                  {listing.name}
                </p>
              </Link>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => deleteListing(listing._id)}
                  className="text-red-500 hover:text-red-800 hover:font-semibold uppercase"
                  type="button"
                >
                  delete
                </button>
                <Link
                  to={`/update-listing/${listing._id}`}
                  className="text-green-500 hover:text-green-800 hover:font-semibold uppercase"
                  type="button"
                >
                  edit
                </Link>
              </div>
            </div>
          ))}
          {deleteListingErr && (
            <p className="text-red-500">{deleteListingErr}</p>
          )}
        </div>
      )}
    </section>
  );
};

export default Profile;
