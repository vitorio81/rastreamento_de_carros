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
exports.RequestStatus = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const StatusService_1 = require("../services/StatusService");
const StatusRequestPayload_1 = require("../model/StatusRequestPayload");
const TCPClient_1 = require("../services/TCPClient");
const TK103Packet_1 = require("../model/TK103Packet"); // <- novo import
class RequestStatus {
    static start() {
        const payload = StatusRequestPayload_1.StatusRequestPayload.create();
        logger_1.default.debug("Payload criado", { payload: payload.toJSON() });
        const executeRequest = () => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                logger_1.default.info("Iniciando requisição de status dos dispositivos");
                const result = yield StatusService_1.StatusService.authenticate(payload);
                logger_1.default.debug("Resposta da API recebida", { result });
                if (((_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                    const devices = this.processDevices(result.data);
                    logger_1.default.info(`Dispositivos processados: ${devices.length}`, {
                        sample: devices.slice(0, 3),
                    });
                    this.sendDevicesData(devices);
                }
                else {
                    logger_1.default.warn("Nenhum dispositivo encontrado na resposta da API");
                }
            }
            catch (err) {
                logger_1.default.error("Falha na requisição de status", {
                    error: err instanceof Error ? err.message : err,
                });
            }
        });
        executeRequest();
    }
    static processDevices(apiData) {
        return apiData
            .map((device) => {
            const imei = String(device.imei || "")
                .padStart(15, "0")
                .slice(0, 15);
            const lat = parseFloat(device.lat) || 0;
            const lng = parseFloat(device.lng) || 0;
            const speed = parseFloat(device.speed) || 0;
            return { imei, lat, lng, speed };
        })
            .filter((device) => {
            if (!/^\d{15}$/.test(device.imei)) {
                logger_1.default.warn(`IMEI inválido ignorado: ${device.imei}`);
                return false;
            }
            return true;
        });
    }
    static sendDevicesData(devices) {
        devices.forEach((device) => {
            try {
                const packet = TK103Packet_1.TK103PacketBuilder.fromDevice(device);
                TCPClient_1.TK103SenderService.send(packet);
            }
            catch (err) {
                logger_1.default.error(`Erro ao enviar dados do dispositivo ${device.imei} via TK103`, {
                    error: err instanceof Error ? err.message : err,
                });
            }
        });
    }
}
exports.RequestStatus = RequestStatus;
