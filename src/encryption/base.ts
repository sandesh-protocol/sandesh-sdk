import { Signer } from "ethers";

export abstract class BaseEncryption {
  private signer: Signer

  getSigner(): Signer {
    return this.signer;
  }

  constructor(signer: Signer) {
    this.signer = signer;
  }

  abstract encrypt(message: string, key: string): Promise<string>;
  abstract decrypt(message: string, key: string): Promise<string>;
}