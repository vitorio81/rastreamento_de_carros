"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const network_1 = require("./utils/network");
const Launcher_1 = require("./controller/Launcher");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const HOST = (0, network_1.getLocalIp)();
app.listen(PORT, () => {
    console.log(`Server is running on address ${HOST} end port ${PORT}`);
});
Launcher_1.Launcher.start();
process.on("SIGINT", () => {
    Launcher_1.Launcher.stop();
    process.exit();
});
process.on("SIGTERM", () => {
    Launcher_1.Launcher.stop();
    process.exit();
});
