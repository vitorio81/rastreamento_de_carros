import winston from "winston";
import { config } from "../config/env";

// Formato personalizado para logs
const logFormat = winston.format.printf(
  ({ level, message, timestamp, ...metadata }) => {
    return `${timestamp} [${level}] ${message} ${
      Object.keys(metadata).length ? JSON.stringify(metadata) : ""
    }`;
  }
);

// Configuração dos níveis de log
const logger = winston.createLogger({
  level: config.logLevel || "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.json(),
    logFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "logs/application.log",
      maxsize: 5 * 1024 * 1024, // 5MB
    }),
  ],
});

export default logger;
