export {};

declare global {
  namespace SocketIO {
    interface Socket {
      request: {
        user: any;
      };
    }
  }
}