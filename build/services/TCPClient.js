"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TK103SenderService = void 0;
const net_1 = __importDefault(require("net"));
const logger_1 = __importDefault(require("../utils/logger"));
class TK103SenderService {
    static send(packet) {
        const client = new net_1.default.Socket();
        logger_1.default.info(`Enviando pacote TK103 para ${packet.imei}: ${packet.raw.trim()}`);
        client.connect(this.IXC_PORT, this.IXC_IP, () => {
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
TK103SenderService.IXC_IP = "131.72.68.163";
TK103SenderService.IXC_PORT = 10000;
