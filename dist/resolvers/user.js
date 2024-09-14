"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const entities_1 = require("../entities");
const type_graphql_1 = require("type-graphql");
const argon2_1 = require("argon2");
const utils_1 = require("../utils");
let UsernamePasswordInput = class UsernamePasswordInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UsernamePasswordInput.prototype, "username", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UsernamePasswordInput.prototype, "password", void 0);
UsernamePasswordInput = __decorate([
    (0, type_graphql_1.InputType)()
], UsernamePasswordInput);
let UserResponse = class UserResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [utils_1.FieldError], { nullable: true }),
    __metadata("design:type", Array)
], UserResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => entities_1.User, { nullable: true }),
    __metadata("design:type", entities_1.User)
], UserResponse.prototype, "user", void 0);
UserResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], UserResponse);
let UserResolver = class UserResolver {
    // Me Query
    me(_a) {
        return __awaiter(this, arguments, void 0, function* ({ em, req }) {
            console.log("Session:", req.session);
            if (!req.session.userId) {
                return null;
            }
            const user = yield em.findOne(entities_1.User, { id: req.session.userId });
            return user;
        });
    }
    // Register
    register(options_1, _a) {
        return __awaiter(this, arguments, void 0, function* (options, { em }) {
            const errors = [
                (0, utils_1.validateUsername)(options.username),
                (0, utils_1.validatePassword)(options.password),
            ].filter((error) => error !== null);
            const hashedPassword = yield (0, argon2_1.hash)(options.password, { type: argon2_1.argon2id });
            const user = new entities_1.User();
            user.username = options.username;
            user.password = hashedPassword;
            if (errors.length > 0) {
                return { errors };
            }
            else {
                try {
                    yield em.persistAndFlush(user);
                }
                catch (error) {
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
        });
    }
    // Login
    login(options_1, _a) {
        return __awaiter(this, arguments, void 0, function* (options, { em, req }) {
            const user = yield em.findOne(entities_1.User, { username: options.username });
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
            const valid = yield (0, argon2_1.verify)(user.password, options.password);
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
            // Check if session exists before setting userId
            if (req.session) {
                req.session.userId = user.id;
            }
            else {
                throw new Error("Session not initialized");
            }
            return { user };
        });
    }
};
exports.UserResolver = UserResolver;
__decorate([
    (0, type_graphql_1.Query)(() => entities_1.User, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "me", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("options")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UsernamePasswordInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("options")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UsernamePasswordInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
exports.UserResolver = UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
//# sourceMappingURL=user.js.map