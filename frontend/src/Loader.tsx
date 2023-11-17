import "./css/loader.css";
function Loader() {
  return (
    <>
      <div className="loader">
        <div className="bg-background fixed inset-0 bg-cover bg-center fade-in">
          <div className="flex justify-center items-center flex-col pt-11">
            <img
              className="firstLoop bounce2"
              src="/src/assets/Revendo.png"
              style={{ width: "480px", height: "480px" }}
            />
            <div className="content mt-14 tablet:text-[32px] laptop:text-[37px]">
              <h2>ReVendo</h2>
              <h2>ReVendo</h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Loader;
