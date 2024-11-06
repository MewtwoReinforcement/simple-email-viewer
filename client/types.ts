import React from 'react';

export interface Message {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  historyId: string;
  internalDate: string;
  payload: MessagePart;
  sizeEstimate: number;
  raw: string;
}

export interface MessagePart {
  partId: string;
  mimeType: string;
  filename: string;
  headers: Header[];
  body: MessagePartBody;
  parts: MessagePart[];
}

export interface MessagePartBody {
  attachmentId: string;
  size: number;
  data: string;
}

export interface Header {
  name: string;
  value: string;
}

export interface FlaggedMessage extends Message {
  flags: Set<Flag>;
}

export type Flag = 'contacts';
export type Feed = 'contacts' | 'other';
export type Contact = string;

// ===================== PROPS TYPES ====================

export interface NavBarProps {
  selectedFeed: Feed;
  setSelectedFeed: React.Dispatch<React.SetStateAction<Feed>>;
}

export interface FeedContainerProps {
  messages: Message[];
}

export interface MessageProps {
  data: Message;
  handleExpand: () => void;
}
