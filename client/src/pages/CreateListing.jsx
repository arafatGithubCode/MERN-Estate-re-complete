import { useState } from "react";

import { app } from "../config/firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateListing = () => {
  const [imgUploadErr, setImgUploadErr] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [progressBar, setProgressBar] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    imageUrls: [],
    type: "rent",
    name: "",
    address: "",
    description: "",
    regularPrice: 0,
    discountedPrice: 0,
    bedrooms: 0,
    bathrooms: 0,
    furnished: false,
    parking: false,
    offer: false,
  });

  const handleImgUpload = async () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImgUploadErr(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImg(files[i]));
      }
      Promise.all(promises).then((urls) => {
        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.concat(urls),
        });
        setImgUploadErr(false);
        setUploading(false);
        setProgressBar(false);
      });
    } else {
      setImgUploadErr("You can only upload 6 images per listing!");
      setUploading(false);
      setProgressBar(false);
    }
  };

  const storeImg = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, `listingImg/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgressBar(Math.round(progress));
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl);
          });
        }
      );
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sell" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "text" ||
      e.target.type === "number" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1) {
        return setError("You must upload atleast one image!");
      }
      if (+formData.regularPrice < +formData.discountedPrice) {
        return setError("Regular price must lower then discounted price!");
      }
      setLoading(true);
      setError(false);
      const res = await axios.post(
        "/api/listing/create",
        { ...formData, userRef: currentUser._id },
        { headers: { "Content-Type": "application/json" } }
      );
      const data = res.data;
      if (data.success === false) {
        setError(data.message);
        toast.error("something went wrong!");
        return;
      }
      navigate(`/listing/${data._id}`);
      toast.success("A listing created successfully!");
    } catch (error) {
      toast.error("something went wrong!");
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-center my-7 text-3xl font-bold">Create a Listing</h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col gap-4 flex-1">
          <input
            className="p-3 rounded-lg border-gray-300 shadow border"
            type="text"
            id="name"
            placeholder="Name"
            onChange={handleChange}
            value={formData.name}
            required
          />
          <textarea
            className="p-3 rounded-lg border-gray-300 shadow border"
            id="description"
            cols="3"
            placeholder="Description"
            onChange={handleChange}
            value={formData.description}
            required
          ></textarea>
          <input
            className="p-3 rounded-lg border-gray-300 shadow border"
            type="text"
            id="address"
            placeholder="Address"
            onChange={handleChange}
            value={formData.address}
            required
          />
          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2">
              <input
                className="w-5"
                type="checkbox"
                id="sell"
                onChange={handleChange}
                checked={formData.type === "sell"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                className="w-5"
                type="checkbox"
                id="rent"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                className="w-5"
                type="checkbox"
                id="parking"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                className="w-5"
                type="checkbox"
                id="furnished"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                className="w-5"
                type="checkbox"
                id="offer"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min={1}
                max={50}
                onChange={handleChange}
                value={formData.bedrooms}
                required
                className="p-3 border border-gray-300 rounded-lg shadow"
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min={1}
                max={50}
                onChange={handleChange}
                value={formData.bathrooms}
                required
                className="p-3 border border-gray-300 rounded-lg shadow"
              />
              <p>Baths</p>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min={0}
                onChange={handleChange}
                value={formData.regularPrice}
                required
                className="p-3 border border-gray-300 rounded-lg shadow"
              />
              <div className="flex flex-col items-center justify-center">
                <span>Regular price</span>
                <span>($ / month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountedPrice"
                  min={0}
                  onChange={handleChange}
                  value={formData.discountedPrice}
                  required
                  className="p-3 border border-gray-300 rounded-lg shadow"
                />
                <div className="flex flex-col items-center justify-center">
                  <span>Discounted price</span>
                  <span>($ / month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-6 flex-1 mb-7">
          <p className="text-gray-500 text-sm">
            <span className="text-xl font-semibold text-slate-900">
              Images:{" "}
            </span>
            The first image will be the cover (max 6)
          </p>
          <div className="flex gap-4">
            <input
              className="border border-gray-300 rounded-lg flex-1 p-3 w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(e.target.files)}
              required
            />
            <button
              className="py-3 px-6 border uppercase border-green-700 rounded-lg disabled:text-opacity-[0.2]"
              type="button"
              disabled={uploading}
              onClick={handleImgUpload}
            >
              {uploading ? " uploading..." : "upload"}
            </button>
          </div>
          <p className="text-center mt-[-1rem]">
            {imgUploadErr ? imgUploadErr : null}
          </p>
          <p className="text-center mt-[-1rem]">
            {progressBar && `uploading ${progressBar} % done`}
          </p>
          <button
            disabled={uploading || loading}
            className="bg-slate-700 p-3 rounded-lg hover:bg-slate-800 text-white uppercase disabled:bg-opacity-[0.7]"
            type="submit"
          >
            create listing
          </button>
          {error && <p>{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
