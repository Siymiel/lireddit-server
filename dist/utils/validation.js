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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateHashedPassword = exports.validateUserExists = exports.validatePassword = exports.validateUsername = exports.FieldError = void 0;
const argon2_1 = require("argon2");
const type_graphql_1 = require("type-graphql");
let FieldError = class FieldError {
};
exports.FieldError = FieldError;
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], FieldError.prototype, "field", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], FieldError.prototype, "message", void 0);
exports.FieldError = FieldError = __decorate([
    (0, type_graphql_1.ObjectType)()
], FieldError);
const validateUsername = (username) => {
    if (username.length <= 2) {
        return {
            field: "username",
            message: "length must be greater than 2 characters",
        };
    }
    return null;
};
exports.validateUsername = validateUsername;
const validatePassword = (password) => {
    if (password.length <= 2) {
        return {
            field: "password",
            message: "length must be greater than 2 characters",
        };
    }
    return null;
};
exports.validatePassword = validatePassword;
const validateUserExists = (user) => {
    if (!user) {
        return {
            field: "user",
            message: "user does not exist",
        };
    }
    return null;
};
exports.validateUserExists = validateUserExists;
const validateHashedPassword = (userPassword, hashedPassoword) => {
    const valid = (0, argon2_1.verify)(userPassword, hashedPassoword);
    if (!valid) {
        return {
            field: "password",
            message: "incorrect password",
        };
    }
    return null;
};
exports.validateHashedPassword = validateHashedPassword;
//# sourceMappingURL=validation.js.map