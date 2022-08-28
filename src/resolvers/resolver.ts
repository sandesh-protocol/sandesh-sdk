import { getProviderWithCustomNetwork } from '../helper';
import { Config } from '../types';
import { BaseResolver } from './base'
import { EthResolver } from './supported/ethResolver';
import { UnstoppableDomainsResolver } from './supported/unstoppableDomainResolver';

// Either use alchemy to invoke smart contracts and check for resolving.
// or only support window.ethereum for it.
export class Resolver {
  private resolvers: BaseResolver[] = []

  constructor(config?: Config) {
    this.resolvers.push(new EthResolver("", "", "", getProviderWithCustomNetwork('homestead', config))); // use hardhat here or maybe eth contract address.
    this.resolvers.push(new UnstoppableDomainsResolver('ETH', '', ''));
  }

  addResolver(resolver: BaseResolver) {
    this.resolvers.push(resolver);
  }

  // Responds with the first resolved domain's address.
  // If domain not resolved the response is null. Hence, asking user that address can't be resolved.
  async resolve(domain: string): Promise<string | null> {
    console.log('domain', domain)
    for (let i = 0; i < this.resolvers.length; i++) {
      const resolvingResponse = await this.resolvers[i].resolve(domain);
      if (resolvingResponse != null) return resolvingResponse;
    }
    return null;
  }
}