import logger from "../utils/logger";
import { StatusService } from "../services/StatusService";
import { StatusRequestPayload } from "../model/StatusRequestPayload";
import { TK103SenderService } from "../services/TCPClient";
import { TK103PacketBuilder, Device } from "../model/TK103Packet"; // <- novo import

export class RequestStatus {

  public static start(): void {
    const payload = StatusRequestPayload.create();
    logger.debug("Payload criado", { payload: payload.toJSON() });

    const executeRequest = async () => {
      try {
        logger.info("Iniciando requisição de status dos dispositivos");
        const result = await StatusService.authenticate(payload);
        logger.debug("Resposta da API recebida", { result });

        if (result?.data?.length > 0) {
          const devices = this.processDevices(result.data);

          logger.info(`Dispositivos processados: ${devices.length}`, {
            sample: devices.slice(0, 3),
          });

          this.sendDevicesData(devices);
        } else {
          logger.warn("Nenhum dispositivo encontrado na resposta da API");
        }
      } catch (err) {
        logger.error("Falha na requisição de status", {
          error: err instanceof Error ? err.message : err,
        });
      }
    };

    executeRequest();
  }

  private static processDevices(apiData: any[]): Device[] {
    return apiData
      .map((device: any): Device => {
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
          logger.warn(`IMEI inválido ignorado: ${device.imei}`);
          return false;
        }
        return true;
      });
  }

  private static sendDevicesData(devices: Device[]): void {
    devices.forEach((device) => {
      try {
        const packet = TK103PacketBuilder.fromDevice(device);
        TK103SenderService.send(packet);
      } catch (err) {
        logger.error(
          `Erro ao enviar dados do dispositivo ${device.imei} via TK103`,
          {
            error: err instanceof Error ? err.message : err,
          }
        );
      }
    });
  }
}
