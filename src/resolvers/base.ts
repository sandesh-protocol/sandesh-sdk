export abstract class BaseResolver {
  contractAddress: string;
  methodName: string;

  constructor(contractAddress: string, methodName: string) {
    this.contractAddress = contractAddress;
    this.methodName = methodName;
  }

  // Return null if the domain can't be resolved.
  abstract resolve(domain: string): Promise<string | null>;
}