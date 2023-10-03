import { resolve } from "path";

export const ALIAS = {
  "@": resolve(__dirname, "./src"),
  "~": resolve(__dirname, "."),
  "@renderer": resolve(__dirname, "./src/renderer"),
};

export const BASE_CONFIG = {
  include: ["src/**/*.ts", "src/**/*.tsx"],
};
