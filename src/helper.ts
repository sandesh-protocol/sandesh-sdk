import { ethers } from "ethers"
export const getProvider = (alchemyKey: string | undefined) => {
  if (alchemyKey)
    return new ethers.providers.AlchemyProvider(undefined, alchemyKey)
  return new ethers.providers.Web3Provider((window as any).ethereum)
}