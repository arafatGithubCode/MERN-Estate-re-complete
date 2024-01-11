import { useSelector } from "react-redux";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <section className="flex flex-col gap-4 p-3 max-w-lg mx-auto">
      <h1 className="text-center my-7 text-2xl font-semibold">Profile</h1>
      <img
        className="w-[6.5rem] h-[6.5rem] rounded-full border self-center"
        src={currentUser.avatar}
        alt="profile"
      />
      <form className="flex flex-col gap-4">
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
