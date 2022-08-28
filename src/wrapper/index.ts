import { ethers } from "ethers"
import { getProvider } from "../helper"
import { SANDESH_CONTRACT_ADDRESS } from '../config'

import ABI from '../abi/Sandesh.json'
import { Resolver } from "../resolvers/resolver"
import { Config, Conversation, Message, MessageResponse, SendMessageProps } from "../types"
import { E2E } from "../encryption"
import { IPFSLib } from "../ipfs"

export class Sandesh {
  private config: Config
  private provider: ethers.providers.JsonRpcProvider
  private contract: ethers.Contract
  private storage: IPFSLib
  private resolver: Resolver
  private security: E2E

  constructor(configDetails: Config) {
    this.config = configDetails ?? {}
    this.provider = getProvider(this.config)
    this.contract = new ethers.Contract(SANDESH_CONTRACT_ADDRESS, ABI.abi, this.provider)
    this.storage = new IPFSLib(this.config.IPFSKey)
    this.resolver = new Resolver(configDetails)
    this.security = new E2E(this.provider.getSigner())
    this.registerDapp()
  }

  // Fetching all conversations for an address.
  async fetchAllConversations(address?: string, filter: boolean = true): Promise<Conversation[]> {
    if (address == null) {
      // Using ethers.js to get account address.
      await this.provider.send("eth_requestAccounts", []);
      const signer = this.provider.getSigner()
      address = await signer.getAddress()
    }
    console.log(address)
    const response = await this.contract.getConversations(address)
    console.log(response)
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
  async getMessagesOfConversation(conversationId: string): Promise<Message[] | any> {
    if (conversationId === null || conversationId === '') throw Error('Conversation Id is required for fetching messages')
    const messagesResponse = await this.contract.getMessages(conversationId)
    if (messagesResponse && messagesResponse.length > 0) {
      // Fetch data from IPFS.
      const address = await this.provider.getSigner().getAddress();
      const chats = await Promise.all(messagesResponse.map(await (async (item: MessageResponse) => {
        const data = await this.storage.getFromIPFSCid(item.contentCID);
        const decryptedData = await this.security.decrypt(data, address)
        return { ...item, data: decryptedData } as Message;
      })));
      return chats
    }
    return messagesResponse
  }

  async registerDapp(): Promise<boolean> {
    try {
      const contract = new ethers.Contract(SANDESH_CONTRACT_ADDRESS, ABI.abi, this.provider.getSigner())
      const tx = await contract.registerDapp(this.config.dappId)
      const resp = await tx.wait();
      return resp;
    } catch (e) {
      return false;
    }
  }

  async sendMessage(props: SendMessageProps): Promise<boolean> {

    const { to, content } = props

    let recieverAddress: string

    if (ethers.utils.isAddress(to)) {
      recieverAddress = to
    } else {
      // Resolve domain to address.
      const address = await this.resolver.resolve(to)
      if (address === null) {
        throw Error("Domain can't be resolved with current list of resolvers.")
      }
      recieverAddress = address
    }
    let contentIPFSCid: string = content
    // Deploy content on IPFS.
    const encryptedMessage = await this.security.encrypt(content, recieverAddress)

    contentIPFSCid = await this.storage.saveToIPFS(encryptedMessage)
    const contract = new ethers.Contract(SANDESH_CONTRACT_ADDRESS, ABI.abi, this.provider.getSigner())
    const tx = await contract.sendPrivateMessage(recieverAddress, contentIPFSCid, this.config.dappId)
    await tx.wait();
    return true
  }
}