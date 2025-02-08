import winston from "winston";

// Logger configuration: output only to console with a custom format that shows only the file name
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
      let logMessage = `[${timestamp}] [${level.toUpperCase()}]`;
      logMessage += ` ${message}`;
      if (stack) {
        logMessage += `\n${stack}`;
      } else if (Object.keys(meta).length > 0) {
        logMessage += ` ${JSON.stringify(meta)}`;
      }
      return logMessage;
    }),
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
