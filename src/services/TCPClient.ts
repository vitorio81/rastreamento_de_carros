
import net from "net";
import logger from "../utils/logger";
import { TK103Packet } from "../model/TK103Packet";
import { config } from "../config/env";

export class TK103SenderService {

  public static send(packet: TK103Packet): void {
    const client = new net.Socket();

    logger.info(
      `Enviando pacote TK103 para ${packet.imei}: ${packet.raw.trim()}`
    );
    const port = Number(config.ixcPort);
    if (isNaN(port)) {
      throw new Error("Porta IXC não definida ou inválida.");
    }
    if (!config.ixcIp) {
      throw new Error("IP do IXC não definido.");
    }
    client.connect(port, config.ixcIp, () => {
      client.write(packet.raw);
    });

    client.on("data", (data) => {
      const response = data.toString().trim();
      logger.info(`🛰️ Resposta do IXC para IMEI ${packet.imei}: "${response}"`);
      client.destroy();
    });

    client.on("error", (err) => {
      logger.error(`Erro na conexão TK103 (${packet.imei}):`, {
        error: err.message,
      });
      client.destroy();
    });

    client.on("close", () => {
      logger.debug(`Conexão com IXC encerrada para ${packet.imei}`);
    });
  }
}
