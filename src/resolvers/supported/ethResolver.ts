import { BaseResolver } from "../base";

export class EthResolver extends BaseResolver {
  async resolve(domain: string): Promise<string | null> {
    if (this.provider == null) return null;

    try {
      console.log(domain)
      const response = await this.provider.resolveName(domain);
      return response;
    } catch (e) {
      console.log('Unable to resolve ENS', e)
      return null;
    }
  }
}