import { BaseEncryption } from "./base";

export class E2E extends BaseEncryption {
  async encrypt(message: string, _: string): Promise<string> {
    return message;
  }

  async decrypt(message: string, _: string): Promise<string> {
    return message;
  }
}