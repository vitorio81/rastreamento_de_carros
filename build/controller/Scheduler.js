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
exports.Scheduler = void 0;
// src/controller/Scheduler.ts
const AccessRequestPayload_1 = require("../model/AccessRequestPayload");
const AuthService_1 = require("../services/AuthService");
const logger_1 = __importDefault(require("../utils/logger"));
let requestInterval = null;
class Scheduler {
    static start() {
        // Parar qualquer intervalo existente
        if (requestInterval) {
            clearInterval(requestInterval);
            logger_1.default.info("Intervalo anterior limpo");
        }
        // Criar payload (usando factory method)
        const payload = AccessRequestPayload_1.AccessRequestPayload.create();
        logger_1.default.debug("Payload criado", { payload: payload.toJSON() });
        // Função de requisição encapsulada
        const executeRequest = () => __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info("Executando requisição de autenticação");
                const result = yield AuthService_1.AuthService.authenticate(payload);
                logger_1.default.debug("Resposta da API", { result });
            }
            catch (err) {
                logger_1.default.error("Falha na requisição", { error: err });
            }
        });
        // Execução imediata + intervalo
        executeRequest().then(() => {
            requestInterval = setInterval(executeRequest, 60 * 1000);
            logger_1.default.info("Loop de requisições iniciado automaticamente");
        });
    }
    static stop() {
        if (requestInterval) {
            clearInterval(requestInterval);
            requestInterval = null;
            logger_1.default.info("Loop de requisições parado");
        }
        else {
            logger_1.default.warn("Tentativa de parar loop não existente");
        }
    }
}
exports.Scheduler = Scheduler;
