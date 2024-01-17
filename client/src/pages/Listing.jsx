import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar } from "swiper/modules";
import "swiper/css/bundle";

const Listing = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [listing, setListing] = useState([]);
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
      </main>
    </>
  );
};

export default Listing;
