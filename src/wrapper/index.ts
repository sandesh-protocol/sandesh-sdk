import { ethers } from "ethers"
import { getProvider } from "../helper"
import { SANDESH_CONTRACT_ADDRESS } from '../config'

import ABI from '../abi/Sandesh.json'
import { Web3Storage } from "web3.storage"
import { Resolver } from "../resolvers/resolver"
import { Config, Conversation, MessageResponse, SendMessageProps } from "../types"

export class Sandesh {
  private config: Config
  private provider: ethers.providers.JsonRpcProvider
  private contract: ethers.Contract
  private storage: Web3Storage
  private resolver: Resolver

  constructor(configDetails: Config) {
    this.config = configDetails ?? {}
    this.provider = getProvider(this.config)
    this.contract = new ethers.Contract(SANDESH_CONTRACT_ADDRESS, ABI.abi, this.provider)
    this.storage = new Web3Storage({ token: this.config.IPFSKey })
    this.resolver = new Resolver()
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
    let conversations = response;
    // Check if dapp id passed.
    if (this.config.dappId && filter) {
      if (response && response.length > 0) {
        conversations = response.filter((item: Conversation) => item.dappId == this.config.dappId)
      }
    }
    return conversations
  }

  // Fetching all conversations for an address.
  async getMessagesOfConversation(conversationId: string) {
    if (conversationId === null || conversationId === '') throw Error('Conversation Id is required for fetching messages')
    const messagesResponse = await this.contract.getMessages(conversationId)
    if (messagesResponse && messagesResponse.length > 0) {
      // Fetch data from IPFS.
      const chats = messagesResponse.map(async (item: MessageResponse) => {
        return {
          ...item,
          content: await this.storage.fetch(item.contentCID),
        }
      });
      return chats
    }
    return messagesResponse
  }

  async sendMessage(props: SendMessageProps): Promise<boolean> {

    const { to, content } = props

    let senderAddress: string

    if (ethers.utils.isAddress(to)) {
      senderAddress = to
    } else {
      // Resolve domain to address.
      const address = await this.resolver.resolve(to)
      if (address === null) {
        throw Error("Domain can't be resolved with current list of resolvers.")
      }
      senderAddress = address
    }
    let contentIPFSCid: string = content
    // Deploy content on IPFS.

    await this.contract.sendPrivateMessage(senderAddress, contentIPFSCid, this.config.dappId)

    return false
  }
}