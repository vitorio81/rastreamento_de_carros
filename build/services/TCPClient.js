"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TK103SenderService = void 0;
const net_1 = __importDefault(require("net"));
const logger_1 = __importDefault(require("../utils/logger"));
const env_1 = require("../config/env");
class TK103SenderService {
    static send(packet) {
        const client = new net_1.default.Socket();
        logger_1.default.info(`Enviando pacote TK103 para ${packet.imei}: ${packet.raw.trim()}`);
        const port = Number(env_1.config.ixcPort);
        if (isNaN(port)) {
            throw new Error("Porta IXC não definida ou inválida.");
        }
        if (!env_1.config.ixcIp) {
            throw new Error("IP do IXC não definido.");
        }
        client.connect(port, env_1.config.ixcIp, () => {
            client.write(packet.raw);
        });
        client.on("data", (data) => {
            const response = data.toString().trim();
            logger_1.default.info(`🛰️ Resposta do IXC para IMEI ${packet.imei}: "${response}"`);
            client.destroy();
        });
        client.on("error", (err) => {
            logger_1.default.error(`Erro na conexão TK103 (${packet.imei}):`, {
                error: err.message,
            });
            client.destroy();
        });
        client.on("close", () => {
            logger_1.default.debug(`Conexão com IXC encerrada para ${packet.imei}`);
        });
    }
}
exports.TK103SenderService = TK103SenderService;
