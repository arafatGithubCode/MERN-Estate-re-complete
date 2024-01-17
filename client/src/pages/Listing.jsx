import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar } from "swiper/modules";
import "swiper/css/bundle";

import { FaShare } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaBed } from "react-icons/fa";
import { FaBath } from "react-icons/fa";
import { FaParking } from "react-icons/fa";
import { FaChair } from "react-icons/fa";

const Listing = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [listing, setListing] = useState([]);
  const [linkCopied, setLinkCopied] = useState(false);
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      setError(false);
      const res = await axios.get(`/api/listing/get/${params.listingId}`);
      const data = res.data;
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        toast.error("something went wrong!");
        return;
      }
      setListing(data);
      setLoading(false);
    };
    fetchListing();
  }, []);
  return (
    <>
      <main>
        {loading && <Spinner />}
        {error && (
          <p className="text-red-500 p-7 text-2xl text-center">
            something went wrong!
          </p>
        )}
        {listing && !loading && !error && (
          <Swiper
            modules={[Navigation, Pagination, Scrollbar]}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            className="relative"
          >
            {listing.imageUrls?.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[500px]"
                  style={{
                    background: `url(${url}) no-repeat center center / cover`,
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
        <FaShare
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setLinkCopied(true);
            setTimeout(() => {
              setLinkCopied(false);
            }, 900);
          }}
          className="absolute top-[8rem] right-[3rem] z-50 text-white text-2xl hover:scale-105 cursor-pointer"
        />
        {linkCopied && (
          <p className="absolute top-[9.8rem] right-[3rem] z-40 text-slate-800 text-lg hover:scale-105 cursor-pointer bg-white p-1 rounded">
            Link Copied!
          </p>
        )}
        <div className="p-3 flex flex-col gap-5">
          <p className="mt-3 text-black text-2xl">{`${listing.name} - $ ${
            listing.offer
              ? listing.discountedPrice.toLocaleString("en-US")
              : listing.regularPrice.toLocaleString("en-US")
          }`}</p>
          <p className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-green-700" />
            <span className="text-sm text-slate-700">{listing.address}</span>
          </p>
          <div className="flex gap-3">
            <span className="bg-red-800 p-2 rounded-lg text-white w-[8rem] text-center">
              {listing.type === "rent" ? "For Rent" : "For Sale"}
            </span>
            <span className="bg-green-800 p-2 rounded-lg text-white">
              {listing.offer
                ? `$ ${listing.discountedPrice} discount`
                : `$ ${listing.regularPrice}`}
            </span>
          </div>
          <p>
            <span className="text-slate-900 font-semibold text-lg">
              Description -{" "}
            </span>
            {listing.description}
          </p>
          <ul className="text-green-800 flex flex-wrap gap-4 mb-5">
            <li className="flex gap-2 items-center">
              <FaBed />
              <span>
                {listing.bedrooms} {listing.bedrooms > 1 ? "Beds" : "Bed"}
              </span>
            </li>
            <li className="flex gap-2 items-center">
              <FaBath />
              <span>
                {listing.bathrooms} {listing.bathrooms > 1 ? "Baths" : "Bath"}
              </span>
            </li>
            <li className="flex gap-2 items-center">
              <FaParking />
              <span>{listing.parking ? "Parking" : "No Parking"}</span>
            </li>
            <li className="flex gap-2 items-center">
              <FaChair />
              <span>{listing.furnished ? "Furnished" : "Not Furnished"}</span>
            </li>
          </ul>
        </div>
      </main>
    </>
  );
};

export default Listing;
