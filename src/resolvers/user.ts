import { User } from "../entities";
import { MyContext } from "../types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
} from "type-graphql";
import { argon2id, hash, verify } from "argon2";
import {
  validatePassword,
  validateUsername,
  validateUserExists,
  validateHashedPassword,
  FieldError,
} from "../utils";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

// @ObjectType()
// class FieldError {
//   @Field()
//   field: string;
//   @Field()
//   message: string;
// }

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  // Register
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    const errors = [
      validateUsername(options.username),
      validatePassword(options.password),
    ].filter((error) => error !== null) as FieldError[];

    console.log("Errors", errors);

    const hashedPassword = await hash(options.password, { type: argon2id });
    const user = new User();
    user.username = options.username;
    user.password = hashedPassword;

    if (errors.length > 0) {
      return { errors };
    } else {
      try {
        await em.persistAndFlush(user);
      } catch (error) {
        if (error.code === "23505") {
          return {
            errors: [
              {
                field: "username",
                message: "username already exists",
              },
            ],
          };
        }
      }
      return { user };
    }
  }

  // Login
  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });

    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "Username does not exist",
          },
        ],
      };
    }

    const valid = await verify(user.password, options.password);

    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }

    return { user };
  }
}
