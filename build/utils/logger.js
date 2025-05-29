"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const env_1 = require("../config/env");
// Formato personalizado para logs
const logFormat = winston_1.default.format.printf((_a) => {
    var { level, message, timestamp } = _a, metadata = __rest(_a, ["level", "message", "timestamp"]);
    return `${timestamp} [${level}] ${message} ${Object.keys(metadata).length ? JSON.stringify(metadata) : ""}`;
});
// Configuração dos níveis de log
const logger = winston_1.default.createLogger({
    level: env_1.config.logLevel || "info",
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.default.format.json(), logFormat),
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.File({
            filename: "logs/application.log",
            maxsize: 5 * 1024 * 1024, // 5MB
        }),
    ],
});
exports.default = logger;
