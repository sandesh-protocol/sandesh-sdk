export type Config = {
  networkForAlchemy?: string;
  alchemyKey?: string;
  IPFSKey: string;
  dappId: string;
}

export type Conversation = {
  id: string;
  isGroup: boolean;
  dappId: string;
}

export interface MessageResponse {
  id: string;
  to: string;
  from: string;
  contentCID: string;
  timestamp: BigInt;
}

export interface SendMessageProps {
  to: string;
  content: string; // JSON
}
