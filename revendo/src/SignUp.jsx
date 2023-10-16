import "./css/LoginAndSignUp.css";
import logo from "./assets/Revendo_logo.png";

const SignUp = () => {
  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=Sign, initial-scale=1.0" />
      <title>ReVendo - Sign Up</title>
      <link rel="stylesheet" href="style.css" />
      <link rel="icon" href="assets/Revendo_logo.png" type="image/x-icon" />
      <section className="sign-in">
        <article className="sign-in__details">
          <h1>Sign Up</h1>
          <p>Fill the form below to create your account</p>
          <form action="" className="sign-in__form">
            <div className="form__control">
              <label htmlFor="fullname">Full name</label>
              <input
                type="text"
                id="fullname"
                placeholder="Enter your fullname"
              />
            </div>
            <div className="form__control">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="Enter your email" />
            </div>
            <div className="form__control">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
              />
            </div>
            <div className="form__control">
              <label htmlFor="confirm_password">Confirm Password</label>
              <input
                type="password"
                id="confirm_password"
                placeholder="Enter your confirm password"
              />
            </div>
            <button className="btn primary" type="submit">
              Sign Up
            </button>
          </form>
          <small className="next__page">
            Already have an account? <a href="index.html">Sign in</a>
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
};

export default SignUp;
