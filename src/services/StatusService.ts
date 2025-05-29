import axios from "axios";
import { config } from "../config/env";
import { StatusRequestPayload } from "../model/StatusRequestPayload";

export class StatusService {
  static async authenticate(payload: StatusRequestPayload) {
    if (!config.hostStatus) {
      throw new Error("host is not defined in the configuration.");
    }
    const response = await axios.get(config.hostStatus, {
      params: {
        accessToken: payload.accessToken,
      },
    });
    return response.data;
  }
}
