import "./css/LoginAndSignUp.css";
import logo from "./assets/Revendo_logo.png";
import { Link } from "react-router-dom";

function Login() {
  return (
    <>
      <section className="sign-in">
        <article className="sign-in__details">
          <h1>Forgot Password</h1>
          <p>
            Please enter your email or mobile number to search for your account.
          </p>
          <form action="" className="sign-in__form">
            <div className="form__control">
              <label htmlFor="emailorphone">Email or Phone Number</label>
              <input
                type="text"
                id="emailorphone"
                placeholder="Enter your email or phone number"
              />
            </div>
            <button className="btn primary" type="submit">
              Search
            </button>
          </form>
          <small className="next__page">
            <Link to="/">Back to sign in</Link>
          </small>
        </article>
        <article className="sign-in__logo">
          <div>
            <img src={logo} alt="ReVendo Logo" />
          </div>
        </article>
      </section>
    </>
  );
}

export default Login;
