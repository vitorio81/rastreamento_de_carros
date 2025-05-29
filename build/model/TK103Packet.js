"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TK103PacketBuilder = void 0;
class TK103PacketBuilder {
    static fromDevice(device) {
        const now = new Date();
        // Data e hora no formato YYMMDDHHMMSS
        const yy = String(now.getFullYear()).slice(2);
        const MM = String(now.getMonth() + 1).padStart(2, "0");
        const dd = String(now.getDate()).padStart(2, "0");
        const hh = String(now.getHours()).padStart(2, "0");
        const mm = String(now.getMinutes()).padStart(2, "0");
        const ss = String(now.getSeconds()).padStart(2, "0");
        const dateStamp = `${yy}${MM}${dd}${hh}${mm}${ss}`;
        // Timestamp no formato HHMMSS.000 (milissegundos fixos em .000)
        const timeStamp = `${hh}${mm}${ss}.000`;
        // Função que converte decimal graus para o formato "ddmm.mmmm" ou "dddmm.mmmm"
        // Latitudes tem 2 dígitos de graus, longitudes 3 dígitos
        const formatCoordinate = (coord, isLat) => {
            const abs = Math.abs(coord);
            const degrees = Math.floor(abs);
            const minutes = (abs - degrees) * 60;
            // Para latitude: grau 2 dígitos + minutos 2 inteiros + 4 decimais
            // Para longitude: grau 3 dígitos + minutos 2 inteiros + 4 decimais
            const degStr = degrees.toString().padStart(isLat ? 2 : 3, "0");
            // minutos fixos em 2 inteiros + 4 decimais
            const minStr = minutes.toFixed(4).padStart(7, "0"); // Ex: "09.1234"
            return degStr + minStr;
        };
        const latitude = formatCoordinate(device.lat, true);
        const longitude = formatCoordinate(device.lng, false);
        // Direção N/S e E/W
        const latDir = device.lat >= 0 ? "N" : "S";
        const lngDir = device.lng >= 0 ? "E" : "W";
        // Velocidade em nós (knots) - 1 km/h = 0.53996 knots
        const speedKnotsNum = Math.max(0, device.speed / 1.852);
        const speedKnots = speedKnotsNum.toFixed(2);
        const raw = `imei:${device.imei},001,${dateStamp},,F,${timeStamp},A,${latitude},${latDir},${longitude},${lngDir},${speedKnots},,;\r\n`;
        return {
            imei: device.imei,
            raw,
        };
    }
}
exports.TK103PacketBuilder = TK103PacketBuilder;
