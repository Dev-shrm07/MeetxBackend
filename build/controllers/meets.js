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
exports.DeleteMeet = exports.updateMeet = exports.createMeet = exports.getMeetbyID = exports.getMeet = void 0;
const meet_1 = __importDefault(require("../models/meet"));
const http_errors_1 = __importDefault(require("http-errors"));
const mongoose_1 = __importDefault(require("mongoose"));
const assertIsDefined_1 = require("../utils/assertIsDefined");
const getMeet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authuserid = req.session.userId;
    try {
        (0, assertIsDefined_1.assertIsDefined)(authuserid);
        const meet = yield meet_1.default.find({ user: authuserid }).exec();
        res.status(200).json(meet);
    }
    catch (error) {
        next(error);
    }
});
exports.getMeet = getMeet;
const getMeetbyID = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.meetid;
    const authuserid = req.session.userId;
    try {
        (0, assertIsDefined_1.assertIsDefined)(authuserid);
        if (!mongoose_1.default.isValidObjectId(id)) {
            throw (0, http_errors_1.default)(400, "Not a valid meet");
        }
        const meet = yield meet_1.default.findById(id).exec();
        if (!meet) {
            throw (0, http_errors_1.default)(404, "Not found");
        }
        (0, assertIsDefined_1.assertIsDefined)(meet.user);
        if (!meet.user.equals(authuserid)) {
            throw (0, http_errors_1.default)(401, "you are not allowed to acces the notes");
        }
        res.status(200).json(meet);
    }
    catch (error) {
        next(error);
    }
});
exports.getMeetbyID = getMeetbyID;
const createMeet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.name;
    const dt = req.body.Date;
    const time = req.body.Time;
    const desc = req.body.desc;
    const link = req.body.link;
    const authuserid = req.session.userId;
    try {
        (0, assertIsDefined_1.assertIsDefined)(authuserid);
        if (!name) {
            throw (0, http_errors_1.default)(400, "Title is Necessary");
        }
        const newMeet = yield meet_1.default.create({
            user: authuserid,
            name: name,
            Date: dt,
            Time: time,
            desc: desc,
            link: link,
        });
        res.status(201).json(newMeet);
    }
    catch (error) {
        next(error);
    }
});
exports.createMeet = createMeet;
const updateMeet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.meetid;
    const Name = req.body.name;
    const dt = req.body.Date;
    const time = req.body.Time;
    const desc = req.body.desc;
    const link = req.body.link;
    const authuserid = req.session.userId;
    try {
        (0, assertIsDefined_1.assertIsDefined)(authuserid);
        if (!mongoose_1.default.isValidObjectId(id)) {
            throw (0, http_errors_1.default)(400, "Not a valid meet");
        }
        if (!Name) {
            throw (0, http_errors_1.default)(400, "Title is Necessary");
        }
        const meet = yield meet_1.default.findById(id).exec();
        if (!meet) {
            throw (0, http_errors_1.default)(404, "Not found");
        }
        (0, assertIsDefined_1.assertIsDefined)(meet.user);
        if (!meet.user.equals(authuserid)) {
            throw (0, http_errors_1.default)(401, "you are not allowed to acces the notes");
        }
        meet.name = Name;
        meet.Date = dt;
        meet.Time = time;
        meet.desc = desc;
        meet.link = link;
        const updatemeet = yield meet.save();
        res.status(200).json(updatemeet);
    }
    catch (error) {
        next(error);
    }
});
exports.updateMeet = updateMeet;
const DeleteMeet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const mid = req.params.meetid;
    try {
        if (!mongoose_1.default.isValidObjectId(mid)) {
            throw (0, http_errors_1.default)(400, "Not a valid meet");
        }
        const meet = yield meet_1.default.findById(mid).exec();
        if (!meet) {
            throw (0, http_errors_1.default)(404, "Not found");
        }
        yield meet_1.default.deleteOne({ _id: mid });
        res.sendStatus(204);
    }
    catch (error) {
        next(error);
    }
});
exports.DeleteMeet = DeleteMeet;
