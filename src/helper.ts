import { ethers } from "ethers"
import { Config } from "./types"
export const getProvider = (_: Config) => {
  // if (config.alchemyKey && config.networkForAlchemy)
  //   return new ethers.providers.AlchemyProvider(config.networkForAlchemy, config.alchemyKey)
  return new ethers.providers.Web3Provider((window as any).ethereum)
}

export const getProviderWithCustomNetwork = (network: string, config?: Config): ethers.providers.JsonRpcProvider | undefined => {
  if (config && config.alchemyKey) {
    return new ethers.providers.AlchemyProvider(network, config.alchemyKey)
  }
  return undefined;
}