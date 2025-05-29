"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TK103PacketBuilder = void 0;
class TK103PacketBuilder {
    static fromDevice(device) {
        const now = new Date();
        const yy = String(now.getFullYear()).slice(2);
        const MM = String(now.getMonth() + 1).padStart(2, "0");
        const dd = String(now.getDate()).padStart(2, "0");
        const hh = String(now.getHours()).padStart(2, "0");
        const mm = String(now.getMinutes()).padStart(2, "0");
        const ss = String(now.getSeconds()).padStart(2, "0");
        const dateStamp = `${yy}${MM}${dd}${hh}${mm}${ss}`; // 0809231929
        const timeStamp = `${hh}${mm}${ss}.000`; // 192930.000 (no padrão do manual)
        const formatCoordinate = (coord, isLat) => {
            const abs = Math.abs(coord);
            const degrees = Math.floor(abs);
            const minutes = (abs - degrees) * 60;
            const minutesFormatted = minutes.toFixed(4);
            return `${degrees
                .toString()
                .padStart(isLat ? 2 : 3, "0")}${minutesFormatted}`;
        };
        const latitude = formatCoordinate(device.lat, true);
        const longitude = formatCoordinate(device.lng, false);
        const latDir = device.lat >= 0 ? "N" : "S";
        const lngDir = device.lng >= 0 ? "E" : "W";
        const speedKnots = (device.speed / 1.852).toFixed(2); // km/h → nós
        const raw = `imei:${device.imei},001,${dateStamp},,F,${timeStamp},A,${latitude},${latDir},${longitude},${lngDir},${speedKnots},,;\r\n`;
        return {
            imei: device.imei,
            raw,
        };
    }
}
exports.TK103PacketBuilder = TK103PacketBuilder;
