"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MeetSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, require: true },
    name: { type: String, require: true },
    Date: { type: String },
    Time: { type: String },
    desc: { type: String },
    link: { type: String }
});
exports.default = (0, mongoose_1.model)("Meet", MeetSchema);
