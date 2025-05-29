// src/controller/Scheduler.ts
import { AccessRequestPayload } from "../model/AccessRequestPayload";
import { AuthService } from "../services/AuthService";
import logger from "../utils/logger";
import { RequestStatus } from "./RequestStatus";


let requestInterval: NodeJS.Timeout | null = null;

export class Launcher {
  public static accessToken: string | null = null;

  public static start(): void {
   

    if (requestInterval) {
      clearInterval(requestInterval);
      logger.info("Intervalo anterior limpo");
    }

    const checkAndRenewToken = async () => {
      try {
        if (Launcher.accessToken) {
          await RequestStatus.start(); 
          logger.debug("Token ainda válido. Mantendo uso.");
          return; 
        }
      } catch (error) {
        
        if ((error as any)?.response?.status === 401) {
          logger.info("Token inválido (401). Gerando novo token...");
          Launcher.accessToken = null;
        } else {
          logger.error("Erro no RequestStatus", { error });
        }
      }

      
      try {
        const payload = AccessRequestPayload.create();
        const result = await AuthService.authenticate(payload);

        if (result?.accessToken) {
          Launcher.accessToken = result.accessToken;
          logger.info("Novo AccessToken gerado", {
            accessToken: Launcher.accessToken,

          });
          await RequestStatus.start(); 
        }
      } catch (err) {
        logger.error("Falha na renovação do token", { error: err });
      }
    };


    checkAndRenewToken();
    requestInterval = setInterval(checkAndRenewToken, 60 * 1000);
    logger.info("Verificação de token iniciada (60s)");
  }

  public static stop(): void {
    if (requestInterval) {
      clearInterval(requestInterval);
      requestInterval = null;
      logger.info("Loop de requisições parado");
    }
  }
}
