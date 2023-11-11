import "./css/LoginAndSignUp.css";
import logo from "./assets/Revendo_logo.png";
import { Link } from "react-router-dom";
import Validation from "./ForgotPasswordValidation";
import { useState } from "react";

interface FormValues {
  emailorphone: string;
}

interface FormErrors {
  emailorphone?: string;
}

function Login() {
  const [values, setValues] = useState<FormValues>({
    emailorphone: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors(Validation(values));
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
          <h1>Forgot Password</h1>
          <p>
            Please enter your email or mobile number to search for your account.
          </p>
          <form action="" className="sign-in__form" onSubmit={handleSubmit}>
            <div className="form__control">
              <label htmlFor="emailorphone">Email or Phone Number</label>
              <input
                type="text"
                id="emailorphone"
                name="emailorphone"
                placeholder="Enter your email or phone number"
                onChange={handleInput}
              />
              {errors.emailorphone && (
                <p className="text-red-500 flex items-center">
                  <span className="text-lg material-symbols-sharp">error</span>
                  {errors.emailorphone}
                </p>
              )}
            </div>
            <button className="btn primary" type="submit">
              Search
            </button>
          </form>
          <small className="next__page">
            <Link to="/">Back to login</Link>
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
