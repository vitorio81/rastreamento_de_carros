"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocalIp = getLocalIp;
const os_1 = __importDefault(require("os"));
function getLocalIp() {
    const interfaces = os_1.default.networkInterfaces();
    for (const name in interfaces) {
        const iface = interfaces[name];
        if (iface) {
            for (const alias of iface) {
                if (alias.family === 'IPv4' && !alias.internal) {
                    return alias.address;
                }
            }
        }
    }
    return '127.0.0.1';
}
