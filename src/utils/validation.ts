import { verify } from "argon2";
import { User } from "../entities";
import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

export const validateUsername = (username: string): FieldError | null => {
  if (username.length <= 2) {
    return {
      field: "username",
      message: "length must be greater than 2 characters",
    };
  }
  return null;
};

export const validatePassword = (password: string): FieldError | null => {
  if (password.length <= 2) {
    return {
      field: "password",
      message: "length must be greater than 2 characters",
    };
  }
  return null;
};

export const validateUserExists = (user: User | null): FieldError | null => {
  if (!user) {
    return {
      field: "user",
      message: "user does not exist",
    };
  }
  return null;
};

export const validateHashedPassword = (userPassword: string, hashedPassoword: string): FieldError | null => {
    const valid = verify(userPassword, hashedPassoword);
    if (!valid) {
      return {
        field: "password",
        message: "incorrect password",
      };
    }
    return null;
}
