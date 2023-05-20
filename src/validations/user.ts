import * as yup from "yup";

export const validateUserId = async (userId: string) => {
  let registrationSchema = yup.object().shape({
    userId: yup.string().required(),
  });
  try {
    await registrationSchema.validate({ userId });
    return true;
  } catch (error: any) {
    return error?.errors;
  }
};

export const validateRegistration = async (
  name: string,
  email: string,
  password: string
) => {
  let registrationSchema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup
      .string()
      .min(6, "password should be minimum 6 characters")
      .required(),
  });
  try {
    await registrationSchema.validate({ name, email, password });
    return true;
  } catch (error: any) {
    return error?.errors;
  }
};

export const validateLogin = async (email: string, password: string) => {
  let loginSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
  });
  try {
    await loginSchema.validate({ email, password });
    return true;
  } catch (error: any) {
    return error?.errors;
  }
};

export const validateString = async (str: string) => {
  let loginSchema = yup.object().shape({
    str: yup.string().required(),
  });
  try {
    await loginSchema.validate({ str });
    return true;
  } catch (error: any) {
    return error?.errors;
  }
};

export const validateBool = async (val: string) => {
  let loginSchema = yup.object().shape({
    val: yup.bool().required(),
  });
  try {
    await loginSchema.validate({ val });
    return true;
  } catch (error: any) {
    return error?.errors;
  }
};
