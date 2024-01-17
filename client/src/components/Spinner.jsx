import spinnerImg from "../assets/spinner.svg";

export default function Spinner() {
  return (
    <div className="flex justify-center items-center fixed inset-0 z-50 bg-opacity-50 bg-black">
      <img className="h-20 rounded-full" src={spinnerImg} alt="Loading" />
    </div>
  );
}
