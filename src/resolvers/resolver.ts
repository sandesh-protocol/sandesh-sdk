import { BaseResolver } from './base'

export class Resolver {
  private resolvers: BaseResolver[]

  constructor() {
    // this.resolvers.push(UnstoppableDomainsResolver);
    // this.resolvers.push(LensResolver)
  }


  // Responds with the first resolved domain's address.
  // If domain not resolved the response is null. Hence, asking user that address can't be resolved.
  async resolve(domain: string): Promise<string | null> {
    for (let i = 0; i<this.resolvers.length; i++){
      const resolvingResponse = await this.resolvers[i].resolve(domain);
      if(resolvingResponse != null) return resolvingResponse;
    }
    return null;
  }
}