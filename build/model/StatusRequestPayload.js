"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusRequestPayload = void 0;
const Launcher_1 = require("../controller/Launcher");
class StatusRequestPayload {
    constructor(attributes) {
        this.accessToken = attributes.accessToken;
    }
    static create() {
        const accessToken = Launcher_1.Launcher.accessToken;
        return new StatusRequestPayload({ accessToken });
    }
    toJSON() {
        return {
            accessToken: this.accessToken
        };
    }
}
exports.StatusRequestPayload = StatusRequestPayload;
