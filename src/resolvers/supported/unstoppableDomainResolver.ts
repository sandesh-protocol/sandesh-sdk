import { BaseResolver } from "../base";
import { Resolution } from '@unstoppabledomains/resolution';
const resolution = new Resolution();

export class UnstoppableDomainsResolver extends BaseResolver {
  async resolve(domain: string): Promise<string | null> {
    try {
      const response = await resolution
        .addr(domain, this.chain);
      return response;
    } catch (e) {
      console.log('Unable to resolve with Unstoppable domains.', e)
      return null;
    }
  }
}