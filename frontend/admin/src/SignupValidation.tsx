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

function Validation(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  if (!values.fullname.trim()) {
    errors.fullname = "Name is required";
  } else {
    errors.fullname = "";
  }

  if (!values.email) {
    errors.email = "Email is required";
  } else if (!emailPattern.test(values.email)) {
    errors.email = "Invalid email address";
  } else {
    errors.email = "";
  }

  if (!values.password) {
    errors.password = "Password is required";
  } else if (!passwordPattern.test(values.password)) {
    errors.password =
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number";
  } else {
    errors.password = "";
  }

  if (!values.confirm_password) {
    errors.confirm_password = "Confirm password is required";
  } else if (values.password !== values.confirm_password) {
    errors.confirm_password = "Passwords do not match";
  } else {
    errors.confirm_password = "";
  }

  return errors;
}

export default Validation;
