import net from "net";

export const findAvailablePort: (
  startPort?: number
) => Promise<number> = async (startPort: number = 4000): Promise<number> => {
  const isPortAvailable = (port: number): Promise<boolean> => {
    return new Promise((resolve) => {
      const server: net.Server = net.createServer();
      server.once("error", () => {
        resolve(false);
      });
      server.once("listening", () => {
        server.close();
        resolve(true);
      });
      server.listen(port);
    });
  };

  let port: number = startPort;
  while (!(await isPortAvailable(port))) {
    port++;
  }
  return port;
};
