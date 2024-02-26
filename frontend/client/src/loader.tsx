import "./loader.css";
import loader from "./assets/Revendo.png";

function Loader() {
  return (
    <>
      <div className="loader">
        <div className="bg-background fixed inset-0 bg-cover bg-center fade-in">
          <div className="flex justify-center items-center flex-col pt-11 sm:pt-52">
            <img
              className="firstLoop bounce2 mx-auto w-96 h-96 sm:w-[120px] sm:h-[120px]"
              src={loader}
              alt="ReVendo Logo"
            />
            <div className="content mt-14 text-center">
              <h2 className="text-2xl mt-5 sm:text-sm md:text-3xl lg:text-4xl xl:text-5xl">
                ReVendo
              </h2>
              <h2 className="text-2xl mt-5 sm:text-sm md:text-3xl lg:text-4xl xl:text-5xl">
                ReVendo
              </h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Loader;
