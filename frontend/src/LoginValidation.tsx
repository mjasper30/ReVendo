interface FormValues {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

function Validation(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  if (!values.email) {
    errors.email = "Email is required";
  } else if (!emailPattern.test(values.email)) {
    errors.email = "Invalid email address";
  }

  if (!values.password) {
    errors.password = "Password is required";
  } else if (!passwordPattern.test(values.password)) {
    errors.password =
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number";
  }

  return errors;
}

export default Validation;
