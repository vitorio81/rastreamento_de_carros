
import net from "net";
import logger from "../utils/logger";
import { TK103Packet } from "../model/TK103Packet";

export class TK103SenderService {
  private static readonly IXC_IP = "131.72.68.163";
  private static readonly IXC_PORT = 10000;

  public static send(packet: TK103Packet): void {
    const client = new net.Socket();

    logger.info(
      `Enviando pacote TK103 para ${packet.imei}: ${packet.raw.trim()}`
    );

    client.connect(this.IXC_PORT, this.IXC_IP, () => {
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
