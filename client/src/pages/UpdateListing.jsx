import { useFormik } from "formik";
import { useEffect, useState } from "react";

import { app } from "../config/firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import axios from "axios";

import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateListing() {
  const [files, setFiles] = useState([]);
  const [imgUploadErr, setImgUploadErr] = useState(false);
  const [imgUploading, setImgUploading] = useState(false);
  const [progressBar, setProgressBar] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        toast.error("something went wrong!");
        return;
      }

      formik.setValues(data);
    };
    fetchListing();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      address: "",
      type: "rent",
      parking: false,
      furnished: false,
      offer: false,
      bedrooms: 1,
      bathrooms: 1,
      regularPrice: 0,
      discountedPrice: 0,
      imageUrls: [],
    },
    onSubmit: async (values) => {
      console.log(values);
      try {
        if (formik.values.imageUrls < 1) {
          return setError("You must upload atleast one image!");
        }
        if (+formik.values.regularPrice < +formik.values.discountedPrice) {
          return setError("Discounted price  must be lower then regular price");
        }
        setLoading(true);
        setError(false);
        const res = await axios.post(
          `/api/listing/update/${params.listingId}`,
          { ...formik.values, userRef: currentUser._id },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = res.data;
        setLoading(false);
        setError(false);
        if (data.success === false) {
          setError(data.message);
          setLoading(false);
          toast.error("something went  wrong!");
          return;
        }
        navigate(`/listing/${data._id}`);
        toast.success("listing updated successfully");
      } catch (error) {
        setError(error.message);
        setLoading(false);
        toast.error("something went  wrong!");
      }
    },
  });

  const handleUploadImage = async () => {
    console.log("test");
    if (files.length > 0 && files.length + formik.values.imageUrls.length < 7) {
      setImgUploading(true);
      setImgUploadErr(false);

      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storageImg(files[i]));
      }

      try {
        const urls = await Promise.all(promises);
        formik.setFieldValue("imageUrls", [
          ...formik.values.imageUrls,
          ...urls,
        ]);
        setImgUploadErr(false);
        setImgUploading(false);
      } catch (error) {
        setImgUploadErr("Image upload failed (2 mb max per image");
        setImgUploading(false);
        console.log(error);
      }
    }
  };

  const storageImg = async (file) => {
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
          console.log(progress);
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

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update a Listing
      </h1>
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            {...formik.getFieldProps("name")}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            {...formik.getFieldProps("description")}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            {...formik.getFieldProps("address")}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                checked={formik.values.type === "sale"}
                onChange={() =>
                  formik.setFieldValue(
                    "type",
                    formik.values.type === "sale" ? "" : "sale"
                  )
                }
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                checked={formik.values.type === "rent"}
                onChange={() =>
                  formik.setFieldValue(
                    "type",
                    formik.values.type === "rent" ? "" : "rent"
                  )
                }
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                checked={formik.values.parking}
                {...formik.getFieldProps("parking")}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                checked={formik.values.furnished}
                {...formik.getFieldProps("furnished")}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                checked={formik.values.offer}
                {...formik.getFieldProps("offer")}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                required
                className="p-3 border border-gray-300 rounded-lg"
                {...formik.getFieldProps("bedrooms")}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                required
                className="p-3 border border-gray-300 rounded-lg"
                {...formik.getFieldProps("bathrooms")}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="1"
                required
                className="p-3 border border-gray-300 rounded-lg"
                {...formik.getFieldProps("regularPrice")}
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            {formik.values.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="1"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  {...formik.getFieldProps("discountedPrice")}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted price</p>
                  <span className="text-xs">($ / month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(e.target.files)}
              required
            />
            <button
              type="button"
              onClick={handleUploadImage}
              disabled={imgUploading}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {imgUploading ? "uploading" : "Upload"}
            </button>
          </div>
          <p className="text-center">
            {imgUploading ? `uploading ${progressBar} % done` : null}
          </p>
          <p className="text-center text-red-600">
            {imgUploadErr && imgUploadErr}
          </p>
          <button
            type="submit"
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "updating" : "Update Listing"}
          </button>
          {error && <p className="text-red-600">{error}</p>}
        </div>
      </form>
    </main>
  );
}
