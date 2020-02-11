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
var express = require("express");
var auth_1 = require("./auth/auth");
var bodyParser = require("body-parser");
var jwt = require("jsonwebtoken");
var mongoose = require("mongoose");
var task_1 = require("./model/task");
require("dotenv").config();
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true
});
mongoose.connection.on("error", function (error) { return console.log(error); });
var app = express();
app.use(bodyParser.json());
app.use(auth_1["default"].initialize());
app.get("/", function (req, res) { return res.send("hello world"); });
app.get("/tasks", auth_1["default"].authenticate("jwt", { session: false }), function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var user, tasks;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = req.user;
                    return [4 /*yield*/, task_1.TaskModel.find({ user: user._id })];
                case 1:
                    tasks = _a.sent();
                    res.json(tasks);
                    return [2 /*return*/];
            }
        });
    });
});
app.post("/tasks", auth_1["default"].authenticate("jwt", { session: false }), function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var user, _a, title, lane, task;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    user = req.user;
                    _a = req.body, title = _a.title, lane = _a.lane;
                    return [4 /*yield*/, task_1.TaskModel.create({ title: title, lane: lane, user: user })];
                case 1:
                    task = _b.sent();
                    task.save();
                    res.statusCode = 201;
                    res.end();
                    return [2 /*return*/];
            }
        });
    });
});
app.post("/signup", auth_1["default"].authenticate("signup", { session: false }), function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            res.json({
                success: true
            });
            return [2 /*return*/];
        });
    });
});
app.post("/login", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        auth_1["default"].authenticate("login", function (err, user, info) { return __awaiter(void 0, void 0, void 0, function () {
            var error;
            return __generator(this, function (_a) {
                try {
                    if (!user) {
                        return [2 /*return*/, res.json({
                                message: "user doesnt fucking exist"
                            })];
                    }
                    if (err || !user) {
                        console.log(err, user);
                        error = new Error("An Error occurred");
                        return [2 /*return*/, next(error)];
                    }
                    req.login(user, { session: false }, function (error) { return __awaiter(void 0, void 0, void 0, function () {
                        var body, token;
                        return __generator(this, function (_a) {
                            if (error)
                                return [2 /*return*/, next(error)];
                            body = { _id: user._id, email: user.email };
                            token = jwt.sign({ user: body }, process.env.SECRET);
                            //Send back the token to the user
                            return [2 /*return*/, res.json({ token: token })];
                        });
                    }); });
                }
                catch (error) {
                    return [2 /*return*/, next(error)];
                }
                return [2 /*return*/];
            });
        }); })(req, res, next);
        return [2 /*return*/];
    });
}); });
app.listen(process.env.PORT || 3000, function () { return console.log("🚀 Listening!"); });
