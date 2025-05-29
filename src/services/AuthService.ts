import axios from "axios";
import { config } from "../config/env";
import { AccessRequestPayload } from "../model/AccessRequestPayload";

export class AuthService {
  static async authenticate(payload: AccessRequestPayload) {
    if (!config.hostAuth) {
      throw new Error("hostAuth is not defined in the configuration.");
    }
    const response = await axios.post(config.hostAuth, {
      appid: payload.appid,
      time: payload.time,
      signature: payload.signature,
    });
    return response.data;
  }
}
