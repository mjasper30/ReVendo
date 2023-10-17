import "./css/LoginAndSignUp.css";
import logo from "./assets/Revendo_logo.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import Validation from "./LoginValidation";

function Login() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setErrors(Validation(values));
  };

  const handleInput = (event: any) => {
    setValues((values) => ({
      ...values,
      [event.target.id]: event.target.value,
    }));
  };

  return (
    <>
      <section className="sign-in">
        <article className="sign-in__details">
          <h1>Sign in</h1>
          <p>Log in to your account</p>
          <form action="" className="sign-in__form" onSubmit={handleSubmit}>
            <div className="form__control">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                onChange={handleInput}
              />
              {errors.email && (
                <p className="text-red-500 flex items-center">
                  <span className="text-lg material-symbols-sharp">error</span>
                  {errors.email}
                </p>
              )}
            </div>
            <div className="form__control">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                onChange={handleInput}
              />
              {errors.password && (
                <p className="text-red-500 flex items-center">
                  <span className="text-lg material-symbols-sharp">
                    {" "}
                    error{" "}
                  </span>
                  {errors.password}
                </p>
              )}
            </div>
            <div className="sign-in__extras">
              <div>
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Keep me signed in</label>
              </div>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
            <button className="btn primary" type="submit">
              Sign In
            </button>
          </form>
          <small className="next__page">
            Dont have an account? <Link to="/signup">Sign up</Link>
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
