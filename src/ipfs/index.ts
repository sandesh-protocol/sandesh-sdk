import { Web3Storage } from "web3.storage";

export class IPFSLib {
  private storage: Web3Storage

  constructor(storageToken: string) {
    this.storage = new Web3Storage({ token: storageToken })
  }

  // Get from IPFS.
  async getFromIPFSCid(cid: string): Promise<string> {
    const response = await this.storage.get(cid)
    if (response && response?.ok) {
      const files = await response.files()
      return await files[0].text();
    } else {
      throw Error("Unable to conect to IPFS")
    }
  }

  // Save to IPFS.
  // Returns CID of the saved file.
  async saveToIPFS(data: string): Promise<string> {
    const dataBlob = new Blob([data])
    const dataFile = new File([dataBlob], 'data.txt')
    const dataCID = await this.storage.put([dataFile])
    return dataCID;
  }
}