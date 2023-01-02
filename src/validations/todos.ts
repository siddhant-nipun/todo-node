import * as yup from "yup";

interface createTaskInterface {
  userId: string;
  description: string;
}

interface updateTaskInterface {
  userId: string;
  description: string;
  todoId: string;
  isCompleted: boolean;
}

export const validateCreateTask = async ({
  userId,
  description,
}: createTaskInterface) => {
  let createTaskSchema = yup.object().shape({
    userId: yup.string().required(),
    description: yup.string().required(),
  });
  try {
    await createTaskSchema.validate({ userId, description });
    return true;
  } catch (error: any) {
    return error?.errors;
  }
};

export const validateUpdateTask = async ({
  userId,
  todoId,
  isCompleted,
  description,
}: updateTaskInterface) => {
  let createTaskSchema = yup.object().shape({
    userId: yup.string().required(),
    todoId: yup.string().required(),
    description: yup.string(),
    isCompleted: yup.bool(),
  });
  try {
    await createTaskSchema.validate({
      userId,
      todoId,
      description,
      isCompleted,
    });
    return true;
  } catch (error: any) {
    return error?.errors;
  }
};

export const validateArchiveTask = async ({
  userId,
  todoId,
}: {
  userId: string;
  todoId: string;
}) => {
  let createTaskSchema = yup.object().shape({
    userId: yup.string().required(),
    todoId: yup.string().required(),
  });
  try {
    await createTaskSchema.validate({
      userId,
      todoId,
    });
    return true;
  } catch (error: any) {
    return error?.errors;
  }
};
