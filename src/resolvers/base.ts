import { ethers } from "ethers";

export abstract class BaseResolver {
  chain: string;
  contractAddress: string;
  methodName: string;
  provider?: ethers.providers.JsonRpcProvider

  constructor(chain: string, contractAddress: string, methodName: string, provider?: ethers.providers.JsonRpcProvider) {
    this.chain = chain;
    this.contractAddress = contractAddress;
    this.methodName = methodName;
    this.provider = provider
  }

  // Return null if the domain can't be resolved.
  abstract resolve(domain: string): Promise<string | null>;
}