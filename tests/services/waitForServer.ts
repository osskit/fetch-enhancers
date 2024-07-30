import type { Server } from 'node:http';

export const waitForServer = (server: Server) =>
  new Promise<void>((resolve) => {
    server.listen(() => {
      resolve();
    });
  });
