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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.Signup = exports.getauthenticatedUser = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const user_1 = __importDefault(require("../models/user"));
const password_hash_1 = __importDefault(require("password-hash"));
const getauthenticatedUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findById(req.session.userId).select('email username').exec();
        res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.getauthenticatedUser = getauthenticatedUser;
const Signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const email = req.body.email;
    const passwordraw = req.body.password;
    try {
        if (!username || !passwordraw || !email) {
            throw (0, http_errors_1.default)(400, "parameters are missing");
        }
        const existingusername = yield user_1.default.findOne({
            username: username,
        }).exec();
        if (existingusername) {
            throw (0, http_errors_1.default)(409, "Username already exists");
        }
        const existingemail = yield user_1.default.findOne({ email: email }).exec();
        if (existingemail) {
            throw (0, http_errors_1.default)(409, "Email already exists");
        }
        const passwordHashed = password_hash_1.default.generate(passwordraw);
        const newUser = yield user_1.default.create({
            email: email,
            username: username,
            password: passwordHashed,
        });
        req.session.userId = newUser._id;
        res.status(201).json(newUser);
    }
    catch (error) {
        next(error);
    }
});
exports.Signup = Signup;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    try {
        if (!username || !password) {
            throw (0, http_errors_1.default)(400, "parameters are missing");
        }
        const user = yield user_1.default.findOne({ username: username }).exec();
        if (!user) {
            throw (0, http_errors_1.default)(401, "invalid credentials");
        }
        const p = user.password;
        if (!p) {
            throw (0, http_errors_1.default)(403, "password not exist");
        }
        const matched = password_hash_1.default.verify(password, p);
        if (!matched) {
            throw (0, http_errors_1.default)(401, "wrong password");
        }
        req.session.userId = user._id;
        res.status(201).json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.session.destroy(error => {
        if (error) {
            next(error);
        }
        else {
            res.sendStatus(200);
        }
    });
});
exports.logout = logout;
