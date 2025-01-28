import { Server } from "http";

let server: Server | null = null;

const setServer = (instance: Server): void => {
  server = instance;
};

const shutdown = async (): Promise<void> => {
  console.log("Gracefully shutting down...");
  if (server) {
    await new Promise<void>((resolve, reject) => {
      server!.close((err) => {
        if (err) {
          console.error("Error closing server:", err);
          reject(err);
        } else {
          console.log("Server closed.");
          resolve();
        }
      });
    });
  }
  process.exit(0);
};

// Termination signal listeners
const setupSignalHandlers = (): void => {
  process.on("SIGINT", async () => {
    await shutdown();
  });
  process.on("SIGTERM", async () => {
    await shutdown();
  });
};

export { setServer, setupSignalHandlers, shutdown };
