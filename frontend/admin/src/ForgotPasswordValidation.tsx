interface FormValues {
  emailorphone: string;
}

interface FormErrors {
  emailorphone?: string;
}

function Validation(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^\d{11}$/;

  if (!values.emailorphone) {
    errors.emailorphone = "Email or phone is required";
  } else if (
    !emailPattern.test(values.emailorphone) ||
    !phonePattern.test(values.emailorphone)
  ) {
    errors.emailorphone = "Invalid phone or email address";
  }

  return errors;
}

export default Validation;
