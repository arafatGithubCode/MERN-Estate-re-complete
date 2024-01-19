import { Link, useLocation, useNavigate } from "react-router-dom";

import { FaSearch } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { useEffect, useState } from "react";

import { useSelector } from "react-redux";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const pathMatchRoute = (route) => {
    if (route === location.pathname) {
      return true;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search/?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlParamsFromUrl = urlParams.get("searchTerm");
    if (urlParamsFromUrl) {
      setSearchTerm(urlParamsFromUrl);
    }
  }, [location.search]);

  return (
    <div className="fixed w-full inset-x-0 top-0 z-50">
      <header className="bg-slate-200 p-3 shadow-md hover:shadow-lg transition-shadow relative">
        <div className="flex justify-between items-center   max-w-6xl mx-auto">
          <Link to="/" className="text-slate-700 font-bold lg:text-xl">
            <span className="text-slate-500">Arafat</span>Estate
          </Link>
          <form
            onSubmit={handleSubmit}
            className="flex items-center bg-white rounded-lg p-3"
          >
            <input
              className="bg-transparent rounded-lg focus:outline-none w-24 sm:w-64"
              type="text"
              placeholder="Search..."
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch />
          </form>
          <nav className="flex justify-center items-center gap-4">
            <Link
              to="/"
              className={`hidden sm:inline text-gray-400 text-sm pb-1 ${
                pathMatchRoute("/") &&
                "text-slate-900 font-semibold border-b-[3px] border-b-red-500"
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`hidden sm:inline text-sm pb-1 text-gray-400 ${
                pathMatchRoute("/about") &&
                "text-slate-900 font-semibold border-b-[3px] border-b-red-500"
              }`}
            >
              About
            </Link>
            {currentUser ? (
              <Link to="/profile" className="hidden sm:inline">
                <img
                  className="w-12 h-12 rounded-full border cursor-pointer"
                  src={currentUser.avatar}
                  alt="profile"
                />
              </Link>
            ) : (
              <Link
                to="/signin"
                className={`hidden sm:inline text-sm pb-1 text-gray-400 ${
                  pathMatchRoute("/signin") &&
                  "text-slate-900 font-semibold border-b-[3px] border-b-red-500"
                }`}
              >
                Sign In
              </Link>
            )}

            <IoMenu
              onClick={() => setShowMenu(!showMenu)}
              className="sm:hidden text-4xl cursor-pointer mr-7"
            />
          </nav>
        </div>
        {showMenu && (
          <div className="flex flex-col absolute top-[4.5rem] right-0 bg-slate-200 h-screen w-[8rem] bg-opacity-[0.5] border-l-2 pl-3 pt-5 gap-5 sm:hidden z-50">
            {currentUser ? (
              <Link to="/profile" onClick={() => setShowMenu(false)}>
                <img
                  className="w-12 h-12 rounded-full border cursor-pointer"
                  src={currentUser.avatar}
                  alt="profile"
                />
              </Link>
            ) : (
              <Link
                className="font-semibold text-black text-lg hover:text-green-700"
                to="/signin"
                onClick={() => setShowMenu(false)}
              >
                Sign In
              </Link>
            )}

            <Link
              className="font-semibold text-black text-lg hover:text-green-700"
              to="/"
              onClick={() => setShowMenu(false)}
            >
              Home
            </Link>
            <Link
              className="font-semibold text-black text-lg hover:text-green-700"
              to="/about"
              onClick={() => setShowMenu(false)}
            >
              About
            </Link>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;
