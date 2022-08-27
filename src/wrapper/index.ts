import { ethers } from "ethers"
import { getProvider } from "../helper"
import { SANDESH_CONTRACT_ADDRESS } from '../config'

import ABI from '../abi/Sandesh.json'

export class Sandesh {
  private config: Config
  private provider: ethers.providers.JsonRpcProvider
  private contract: ethers.Contract

  constructor(configDetails: Config) {
    this.config = configDetails ?? {}
    this.provider = getProvider(configDetails.alchemyKey)
    this.contract = new ethers.Contract(SANDESH_CONTRACT_ADDRESS, ABI.abi, this.provider)
  }

  // Fetching all conversations for an address.
  async fetchAllConversations(address?: string, filter: boolean = true): Promise<Conversation[]> {
    if (address == null) {
      // Using ethers.js to get account address.
      await this.provider.send("eth_requestAccounts", []);
      const signer = this.provider.getSigner()
      address = await signer.getAddress()
    }
    const response = await this.contract.getConversations(address)
    let chats = response;
    // Check if dapp id passed.
    if(this.config.dappId && filter){
      if(response && response.length > 0) {
        chats = response.filter((item: Conversation) => item.dappId == this.config.dappId);
      }
    }
    return chats;
  }

  // Fetching all conversations for an address.
  async getMessagesOfConversation(conversationId: string) {
    if(conversationId === null || conversationId === '') throw Error('Conversation Id is required for fetching messages');
    const messagesResponse = await this.contract.getMessages(conversationId)
    if (messagesResponse && messagesResponse.length > 0) {
      // Fetch data from IPFS.
    }
  }
}