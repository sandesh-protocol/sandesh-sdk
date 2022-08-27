type Config = {
  alchemyKey?: string;
  IPFSKey: string;
  dappId: string;
}

type Conversation = {
  id: string;
  isGroup: boolean;
  dappId: string;
}

type MessageResponse = {
  id: string;
  to: string;
  from: string;
  contentCID: MessageResponse;
  timestamp: BigInt;
}
