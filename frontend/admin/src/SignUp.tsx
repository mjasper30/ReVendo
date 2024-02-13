import "./css/LoginAndSignUp.css";
import logo from "./assets/Revendo_logo.png";
import { Link, useNavigate } from "react-router-dom";
import Validation from "./SignupValidation";
import { useState } from "react";
import axios from "axios";

interface FormValues {
  fullname: string;
  email: string;
  password: string;
  confirm_password: string;
}

interface FormErrors {
  fullname?: string;
  email?: string;
  password?: string;
  confirm_password?: string;
}

const SignUp = () => {
  const [values, setValues] = useState<FormValues>({
    fullname: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Navigate after submit
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors(Validation(values));
    if (
      !errors.fullname &&
      !errors.email &&
      !errors.password &&
      !errors.confirm_password
    ) {
      axios
        .post("http://revendo-030702.et.r.appspot.com/signup", values)
        .then(() => {
          navigate("/");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prevValues) => ({
      ...prevValues,
      [event.target.id]: event.target.value,
    }));
  };

  return (
    <>
      <section className="sign-in">
        <article className="sign-in__details">
          <h1>Sign Up</h1>
          <p>Fill the form below to create your account</p>
          <form action="" className="sign-in__form" onSubmit={handleSubmit}>
            <div className="form__control">
              <label htmlFor="fullname">Full name</label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                placeholder="Enter your fullname"
                onChange={handleInput}
              />
              {errors.fullname && (
                <p className="text-red-500 flex items-center">
                  <span className="text-lg material-symbols-sharp">error</span>
                  {errors.fullname}
                </p>
              )}
            </div>
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
                  <span className="text-lg material-symbols-sharp">error</span>
                  {errors.password}
                </p>
              )}
            </div>
            <div className="form__control mb-3">
              <label htmlFor="confirm_password">Confirm Password</label>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                placeholder="Enter your confirm password"
                onChange={handleInput}
              />
              {errors.confirm_password && (
                <p className="text-red-500 flex items-center">
                  <span className="text-lg material-symbols-sharp">error</span>
                  {errors.confirm_password}
                </p>
              )}
            </div>
            <button className="btn primary" type="submit">
              Sign Up
            </button>
          </form>
          <small className="next__page">
            Already have an account? <Link to="/">Login</Link>
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
