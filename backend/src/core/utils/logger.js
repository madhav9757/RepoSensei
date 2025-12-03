export const logger = {
  log: (...args) => console.log("[LOG]", new Date().toISOString(), ...args),
  error: (...args) => console.error("[ERROR]", new Date().toISOString(), ...args),
  warn: (...args) => console.warn("[WARN]", new Date().toISOString(), ...args),
  info: (...args) => console.info("[INFO]", new Date().toISOString(), ...args),
};

export default logger;