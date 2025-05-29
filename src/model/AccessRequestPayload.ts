// src/model/AccessRequestPayload.ts
import { generateSignature } from "../utils/authHelpers";
import { config } from "../config/env";

interface IAccessRequestPayload {
  appid: string;
  time: string;
  signature: string;
}

export class AccessRequestPayload {
  appid: string;
  time: string;
  signature: string;

  private constructor(attributes: IAccessRequestPayload) {
    this.appid = attributes.appid;
    this.time = attributes.time;
    this.signature = attributes.signature;
  }

  public static create(): AccessRequestPayload {
    const { timestamp, signatureMd5 } = generateSignature();

    return new AccessRequestPayload({
      appid: config.appId ?? "defaultAppId",
      time: timestamp,
      signature: signatureMd5,
    });
  }

  public toJSON(): IAccessRequestPayload {
    return {
      appid: this.appid,
      time: this.time,
      signature: this.signature,
    };
  }
}
