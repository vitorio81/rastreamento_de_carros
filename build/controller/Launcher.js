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
exports.Launcher = void 0;
// src/controller/Scheduler.ts
const AccessRequestPayload_1 = require("../model/AccessRequestPayload");
const AuthService_1 = require("../services/AuthService");
const logger_1 = __importDefault(require("../utils/logger"));
const RequestStatus_1 = require("./RequestStatus");
let requestInterval = null;
class Launcher {
    static start() {
        if (requestInterval) {
            clearInterval(requestInterval);
            logger_1.default.info("Intervalo anterior limpo");
        }
        const checkAndRenewToken = () => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if (Launcher.accessToken) {
                    yield RequestStatus_1.RequestStatus.start();
                    logger_1.default.debug("Token ainda válido. Mantendo uso.");
                    return;
                }
            }
            catch (error) {
                if (((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
                    logger_1.default.info("Token inválido (401). Gerando novo token...");
                    Launcher.accessToken = null;
                }
                else {
                    logger_1.default.error("Erro no RequestStatus", { error });
                }
            }
            try {
                const payload = AccessRequestPayload_1.AccessRequestPayload.create();
                const result = yield AuthService_1.AuthService.authenticate(payload);
                if (result === null || result === void 0 ? void 0 : result.accessToken) {
                    Launcher.accessToken = result.accessToken;
                    logger_1.default.info("Novo AccessToken gerado", {
                        accessToken: Launcher.accessToken,
                    });
                    yield RequestStatus_1.RequestStatus.start();
                }
            }
            catch (err) {
                logger_1.default.error("Falha na renovação do token", { error: err });
            }
        });
        checkAndRenewToken();
        requestInterval = setInterval(checkAndRenewToken, 60 * 1000);
        logger_1.default.info("Verificação de token iniciada (60s)");
    }
    static stop() {
        if (requestInterval) {
            clearInterval(requestInterval);
            requestInterval = null;
            logger_1.default.info("Loop de requisições parado");
        }
    }
}
exports.Launcher = Launcher;
Launcher.accessToken = null;
