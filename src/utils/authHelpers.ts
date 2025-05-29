import * as Crypto from "crypto-js";
import { config } from "../config/env";

export interface ISignature {
  timestamp: string;
  signatureMd5: string;
}

function md5(text: string): string {
  return Crypto.MD5(text).toString(Crypto.enc.Hex);
}

export function generateSignature(): ISignature {
  if (!config.secretKey) {
    throw new Error("API_SECRET_KEY não configurada - verifique seu .env");
  }

  // 1. Gerar timestamp UNIX
  const timestamp = Math.floor(Date.now() / 1000).toString();

  // 2. Hash MD5 da chave secreta (exigência da API)
  const hashedKey = md5(config.secretKey);

  // 3. Combinar com timestamp e gerar hash final
  const signatureMd5 = md5(`${hashedKey}${timestamp}`);

  return {
    timestamp,
    signatureMd5,
  };
}
