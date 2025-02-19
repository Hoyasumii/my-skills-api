declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: "development" | "production" | "testing";
    PORT: string;
    PASSWORD: string;
  }
}
