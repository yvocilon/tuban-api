"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var passport_jwt_1 = require("passport-jwt");
var passport_local_1 = require("passport-local");
var passport = require("passport");
var user_1 = require("../model/user");
var options = {
    secretOrKey: process.env.SECRET,
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken()
};
passport.use(new passport_jwt_1.Strategy(options, function (payload, done) {
    try {
        //Pass the user details to the next middleware
        return done(null, payload.user);
    }
    catch (error) {
        done(error);
    }
}));
var localStrategyOptions = {
    passReqToCallback: true,
    usernameField: "email",
    passwordField: "password"
};
passport.use("signup", new passport_local_1.Strategy(localStrategyOptions, signup));
passport.use("login", new passport_local_1.Strategy(localStrategyOptions, login));
function signup(req, email, password, done) {
    return __awaiter(this, void 0, void 0, function () {
        var user, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, user_1.UserModel.create({ email: email, password: password })];
                case 1:
                    user = _a.sent();
                    return [2 /*return*/, done(null, user)];
                case 2:
                    err_1 = _a.sent();
                    done(err_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function login(req, email, password, done) {
    return __awaiter(this, void 0, void 0, function () {
        var user, validate, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, user_1.UserModel.findOne({ email: email })];
                case 1:
                    user = (_a.sent());
                    if (!user) {
                        return [2 /*return*/, done(null, false, { message: "User not found" })];
                    }
                    return [4 /*yield*/, user.isValidPassword(password)];
                case 2:
                    validate = _a.sent();
                    if (!validate) {
                        return [2 /*return*/, done(null, false, { message: "Wrong Password" })];
                    }
                    //Send the user information to the next middleware
                    return [2 /*return*/, done(null, user, { message: "Logged in Successfully" })];
                case 3:
                    err_2 = _a.sent();
                    return [2 /*return*/, done(err_2)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports["default"] = passport;
