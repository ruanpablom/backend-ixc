export {}

declare global {
  namespace Express {
      // tslint:disable-next-line:no-empty-interface
      interface AuthInfo {}
      // tslint:disable-next-line:no-empty-interface
      interface User {
        id: string
        role?: "ADMIN" | "USER"
      }
  }
}