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
const env_1 = require("../config/env");
function md5(text) {
    return Crypto.MD5(text).toString(Crypto.enc.Hex);
}
function generateSignature() {
    if (!env_1.config.secretKey) {
        throw new Error("API_SECRET_KEY não configurada - verifique seu .env");
    }
    // 1. Gerar timestamp UNIX
    const timestamp = Math.floor(Date.now() / 1000).toString();
    // 2. Hash MD5 da chave secreta (exigência da API)
    const hashedKey = md5(env_1.config.secretKey);
    // 3. Combinar com timestamp e gerar hash final
    const signatureMd5 = md5(`${hashedKey}${timestamp}`);
    return {
        timestamp,
        signatureMd5,
    };
}
