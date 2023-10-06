import "./css/LoginAndSignUp.css";
import logo from "./assets/Revendo_logo.png";
import googleLogo from "./assets/google-logo.png";

function Login() {
  return (
    <>
      <section className="sign-in">
        <article className="sign-in__details">
          <h1>Sign in</h1>
          <p>Log in to your account using your credentials</p>
          <form action="" className="sign-in__form">
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
            <div className="sign-in__extras">
              <div>
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Keep me signed in</label>
              </div>
              <a href="">Forgot password?</a>
            </div>
            <button className="btn primary" type="submit">
              Sign In
            </button>
            <button className="btn">
              <img src={googleLogo} alt="Google logo" />
              <p>Sign in with Google</p>
            </button>
          </form>
          <small className="next__page">
            Dont have an account? <a href="sign-up.html">Sign up</a>
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
