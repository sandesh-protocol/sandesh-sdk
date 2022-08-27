import { ethers } from "ethers"
export const getProvider = (config: Config) => {
  if (config.alchemyKey && config.networkForAlchemy)
    return new ethers.providers.AlchemyProvider(config.networkForAlchemy, config.alchemyKey)
  return new ethers.providers.Web3Provider((window as any).ethereum)
}