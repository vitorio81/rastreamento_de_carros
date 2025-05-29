"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSignature = generateSignature;
const Crypto = __importStar(require("crypto-js"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
function getUnixTimestamp() {
    return Math.floor(Date.now() / 1000).toString();
}
function md5(text) {
    return Crypto.MD5(text).toString(Crypto.enc.Hex);
}
function generateSignature() {
    const secretKey = process.env.API_SECRET_KEY;
    if (!secretKey) {
        throw new Error("API_SECRET_KEY não definida no aqrquivo .env");
    }
    const timestamp = getUnixTimestamp();
    const hashedKey = md5(`${secretKey}`);
    const combined = `${hashedKey}${timestamp}`;
    const signatureMd5 = md5(combined);
    return { timestamp, signatureMd5 };
}
