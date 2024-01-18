import PropTypes from "prop-types";

import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { FaBath, FaBed, FaChair, FaParking } from "react-icons/fa";

export default function ListingItem({ listing }) {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0]}
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="truncate text-lg font-semibold text-slate-700">
            {listing.name}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="text-sm text-gray-600 truncate w-full">
              {listing.address}
            </p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>
          <p className="text-slate-500 mt-2 font-semibold ">
            $
            {listing.offer
              ? listing.discountedPrice.toLocaleString("en-US")
              : listing.regularPrice.toLocaleString("en-US")}
            {listing.type === "rent" && " / month"}
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
      </Link>
    </div>
  );
}
ListingItem.propTypes = {
  listing: PropTypes.shape({
    imageUrls: PropTypes.string.isRequired,
    name: PropTypes.string,
    address: PropTypes.string,
    description: PropTypes.string,
    discountedPrice: PropTypes.number,
    regularPrice: PropTypes.number,
    offer: PropTypes.bool,
    type: PropTypes.string,
    bedrooms: PropTypes.number,
    bathrooms: PropTypes.number,
    furnished: PropTypes.bool,
    parking: PropTypes.bool,
    _id: PropTypes.string,
  }).isRequired,
};
