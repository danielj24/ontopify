export interface TokenErrorResponse {
  error: string;
}

export enum TokenType {
  ACCESS = "access_token",
  REFRESH = "refresh_token",
}
