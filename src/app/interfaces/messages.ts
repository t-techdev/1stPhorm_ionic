import { Transphormer } from './types';

export interface TextMessagePayload {
  message: string;
}

export interface MediaMessagePayload {
  fileUrl: string;
}

export interface SmallConversation {
  message: string;
  display_name: string;
  transphormerId: number;
  last_message_timestamp?: string;
  ts: Date;
  unread_count: number;
  i_sent_last_message: boolean;
}

export interface MessageCount {
  unread_transphormer_messages: number;
  unread_advisor_messages: number;
}

export interface Message {
  id: number;
  message: string;
  from_id: number;
  to_id: number;
  message_from?: Transphormer;
  message_to?: Transphormer;
  group_name: string | null;
  created_at: string;
  parts?: [Part];
  read_at: string | null;
}

type MessageType = 'image' | 'url' | 'text' | 'product' | 'link' | 'html';

export interface Part {
  messageId: number;
  type: MessageType;
  content: string;
  url: string;
}

export interface MessagePartComponent {
  part: Part;
}

export type TextType = Part;


export interface ImagePart extends Part {
  src: string;
  fileName: string;
  localPath: string;
  directory: string;
}

export interface VideoPart extends Part {
  src: string;
}

export interface UrlPart extends Part {
  name: string;
  stars?: number;
  imageUrl: string;
}

export interface LinkPart extends Part {
  linkText: string;
  href: string;
  linkType: string;
}

export interface Conversation {
  transphormer: { id: number; display_name: string };
  count: number;
  unread_count: number;
  last_message_timestamp?: string;
  last_message_i_sent?: Message;
  last_message_received?: Message;
  i_sent_last_message: boolean;
}

export interface Upload {
  id: number;
  value: number;
}
