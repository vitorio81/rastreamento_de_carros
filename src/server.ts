import express from 'express';
import { getLocalIp } from './utils/netWork';
import { Launcher } from "./controller/Launcher";

const app = express();


const PORT = process.env.PORT || 3000;
const HOST = getLocalIp()

app.listen(PORT, () => {
  console.log(`Server is running on address ${HOST} end port ${PORT}`);
});

Launcher.start();

process.on("SIGINT", () => {
  Launcher.stop();
  process.exit();
});

process.on("SIGTERM", () => {
  Launcher.stop();
  process.exit();
});

