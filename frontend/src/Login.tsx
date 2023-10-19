import "./css/LoginAndSignUp.css";
import logo from "./assets/Revendo_logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Validation from "./LoginValidation";
import axios from "axios";
import Swal from "sweetalert2";

function Login() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  // Navigate after submit
  const navigate = useNavigate();

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setErrors(Validation(values));

    axios
      .post("http://localhost:3001/login", values)
      .then((res) => {
        if (res.data === "Success") {
          Swal.fire({
            icon: "success",
            title: "Login Success!",
            text: "",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/dashboard");
            }
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Login Failed!",
            text: "",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
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
          <h1>Login</h1>
          <p>Login your account</p>
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
              {/* <div>
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Keep me signed in</label>
              </div> */}
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
            <button className="btn primary mb-5" type="submit">
              Login
            </button>
          </form>
          {/* <small className="next__page">
            Dont have an account? <Link to="/signup">Sign up</Link>
          </small> */}
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
