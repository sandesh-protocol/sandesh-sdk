import { ethers } from "ethers"
import { getProvider } from "../helper"
import { SANDESH_CONTRACT_ADDRESS } from '../config'

import ABI from '../abi/Sandesh.json'

export class Sandesh {
  // private config: Config
  private provider: ethers.providers.JsonRpcProvider
  private contract: ethers.Contract

  constructor(configDetails: Config) {
    this.provider = getProvider(configDetails.alchemyKey)
    this.contract = new ethers.Contract(SANDESH_CONTRACT_ADDRESS, ABI.abi, this.provider)
  }

  // Fetching all conversations for an address.
  async fetchAllConversations(address?: string): Promise<string> {
    if (address == null) {
      // Using ethers.js to get account address.
      await this.provider.send("eth_requestAccounts", []);
      const signer = this.provider.getSigner()
      address = await signer.getAddress()
    }
    const response = await this.contract.getConversations(address)
    return response;
  }
}