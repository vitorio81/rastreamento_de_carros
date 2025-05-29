"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessRequestPayload = void 0;
// src/model/AccessRequestPayload.ts
const authHelpers_1 = require("../utils/authHelpers");
const env_1 = require("../config/env");
class AccessRequestPayload {
    constructor(attributes) {
        this.appid = attributes.appid;
        this.time = attributes.time;
        this.signature = attributes.signature;
    }
    static create() {
        var _a;
        const { timestamp, signatureMd5 } = (0, authHelpers_1.generateSignature)();
        return new AccessRequestPayload({
            appid: (_a = env_1.config.appId) !== null && _a !== void 0 ? _a : "defaultAppId",
            time: timestamp,
            signature: signatureMd5,
        });
    }
    toJSON() {
        return {
            appid: this.appid,
            time: this.time,
            signature: this.signature,
        };
    }
}
exports.AccessRequestPayload = AccessRequestPayload;
