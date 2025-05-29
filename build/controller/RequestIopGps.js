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
exports.requestIopGps = void 0;
const AccessRequestPayload_1 = require("../model/AccessRequestPayload");
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "/srv/api_rastreio/.env" });
// Sua função agora retorna uma Promise<string> com o token
const requestIopGps = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { appid, time, signature } = req.body;
        const payload = new AccessRequestPayload_1.AccessRequestPayload({ appid, time, signature });
        if (payload) {
            const hostAuth = process.env.HOST_AUTH || "default_secret_key";
            const data = {
                appid,
                time,
                signature
            };
            const response = yield axios_1.default.post(`${hostAuth}`, {
                data
            });
            console.log(response.data);
            res.status(200).json({
                message: "Requisção realizada com sucesso: "
            });
            return;
        }
        res.json({ message: "Não ouve payloda" });
        return;
    }
    catch (error) {
        next(error);
        return;
    }
});
exports.requestIopGps = requestIopGps;
