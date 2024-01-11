import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { app } from "../config/firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [fileUploadError, setFileUploadError] = useState(null);
  const fileRef = useRef(null);
  const [filePerc, setFilePerc] = useState(0);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const fileStorageRef = ref(storage, fileName);
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

  return (
    <section className="flex flex-col gap-4 p-3 max-w-lg mx-auto">
      <h1 className="text-center my-7 text-2xl font-semibold">Profile</h1>
      <form className="flex flex-col gap-4 relative">
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
          placeholder="you may update your username"
        />
        <input
          className="p-3 rounded-lg border-gray-300 border shadow"
          type="email"
          defaultValue={currentUser.email}
          placeholder="you may update your email"
        />
        <input
          className="p-3 rounded-lg border-gray-300 border shadow"
          type="password"
          placeholder="password"
        />
        <button
          className="p-3 rounded-lg border-gray-300 border shadow bg-slate-700 text-white uppercase hover:bg-slate-800 disabled:bg-opacity-80 hover:shadow-lg transition duration-150 ease-in-out"
          type="button"
        >
          update
        </button>
        <button
          className="p-3 rounded-lg border-gray-300 border shadow bg-green-700 text-white uppercase hover:bg-green-800 disabled:bg-opacity-80 hover:shadow-lg transition duration-150 ease-in-out"
          type="submit"
        >
          create listing
        </button>
      </form>
      <div className="flex justify-between">
        <button type="button" className="text-red-600">
          Delete Account
        </button>
        <button type="button" className="text-red-600">
          Sign out{" "}
        </button>
      </div>
    </section>
  );
};

export default Profile;
