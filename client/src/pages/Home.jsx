import { Link } from "react-router-dom";

import { Navigation, Pagination, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import { useEffect, useState } from "react";

import ListingItem from "../components/ListingItem";

const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [sellListings, setSellListings] = useState([]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent");
        const data = await res.json();
        setRentListings(data);
        fetchSellListings();
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchSellListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sell");
        const data = await res.json();
        setSellListings(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchOfferListings();
  }, []);
  return (
    <section className="mb-10">
      {/* top  */}
      <div className="flex flex-col gap-10 my-[6rem] p-3 max-w-6xl mx-auto">
        <p className="text-4xl md:text-6xl text-slate-700 font-bold">
          Find your next <span className="text-slate-600">perfect</span>
          <br />
          place with ease
        </p>
        <p className="text-sm text-slate-400">
          Arafat Estate will help you find your home fast, easy and comfortable.
          Our expert support are always available.
        </p>
        <Link to="/search" className="text-blue-800 hover:font-semibold">
          Let&apos; Start now...
        </Link>
      </div>

      {/* swiper */}
      <Swiper
        modules={[Navigation, Pagination, Scrollbar]}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
      >
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) no-repeat center center / cover`,
                }}
                className="h-[500px]"
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* places for offer */}
      <div className="p-3">
        {offerListings && offerListings.length > 0 && (
          <div>
            <h1 className="text-slate-700 mt-7 text-xl font-semibold">
              Recent offers
            </h1>
            <Link
              to="/search?offer=true"
              className="text-blue-700 hover:underline"
            >
              Show more offers
            </Link>
            <div className="flex flex-wrap gap-4 mt-2">
              {offerListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* places for rent */}
      <div className="p-3">
        {rentListings && rentListings.length > 0 && (
          <div>
            <h1 className="text-slate-700 mt-7 text-xl font-semibold">
              Recent places for rent
            </h1>
            <Link
              to="/search?type=rent"
              className="text-blue-700 hover:underline"
            >
              Show more places for rent
            </Link>
            <div className="flex flex-wrap gap-4 mt-2">
              {offerListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
      </div>
      {/* places for sell */}

      <div className="p-3">
        {sellListings && sellListings.length > 0 && (
          <div>
            <h1 className="text-slate-700 mt-7 text-xl font-semibold">
              Recent places for sale
            </h1>
            <Link
              to="/search?type=sell"
              className="text-blue-700 hover:underline"
            >
              Show more places for sale
            </Link>
            <div className="flex flex-wrap gap-4 mt-2">
              {offerListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Home;
