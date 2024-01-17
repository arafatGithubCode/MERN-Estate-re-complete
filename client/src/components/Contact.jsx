import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
        console.log(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchUser();
  }, []);

  const onChange = (e) => {
    setMessage(e.target.value);
  };
  return (
    <>
      {landlord && (
        <div>
          <p>
            Contact{" "}
            <span className="font-semibold px-2 text-green-700">
              {landlord.username}
            </span>
            for{" "}
            <span className="font-semibold px-2 text-yellow-500">
              {listing.name}
            </span>
          </p>
          <div className="flex flex-col gap-4 mb-5">
            <textarea
              className="rounded p-2 border border-gray-300 shadow"
              value={message}
              onChange={onChange}
              placeholder="Enter your message here..."
              required
            ></textarea>
            <Link
              to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
              className="bg-slate-700 p-3 rounded-lg text-white uppercase hover:bg-slate-800 shadow-lg text-center"
            >
              Send message
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

Contact.propTypes = {
  listing: PropTypes.shape({
    userRef: PropTypes.string.isRequired,
    name: PropTypes.string,
  }).isRequired,
};

export default Contact;
