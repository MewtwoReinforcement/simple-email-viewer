import React from 'react';
import type { Header, MessageProps } from '../types.ts';

const Message: React.FC<MessageProps> = ({
  data,
  handleExpand,
}): React.JSX.Element => {
  data = {
    id: '2',
    threadId: 'thread123',
    labelIds: ['label123'],
    snippet: 'Snippet of Message',
    historyId: 'history123',
    internalDate: 'MM/DD/YYYY',
    payload: {
      partId: '1',
      mimeType: 'unknown',
      filename: 'email.txt',
      headers: [{ name: 'from', value: 'joeBiden@whitehouse.gov' }],
      body: {
        attachmentId: '70',
        size: 10,
        data: "Hey, It's your pal Joe. Please Vote today...",
      },
      parts: [],
    },
    sizeEstimate: 10,
    raw: 'etc',
  };

  const messageDate = new Date(data.internalDate);
  const dateString =
    new Date().toDateString() === messageDate.toDateString()
      ? messageDate.toLocaleTimeString() // sun nov 15 12:15 pm
      : messageDate.toLocaleString(); // 12:15 pm
  const subject = data.payload.headers.find(
    ({ name }: Header) => name === 'Subject',
  )?.value;
  const from = data.payload.headers.find(
    ({ name }: Header) => name === 'from',
  )?.value;
  return (
    <>
      <button onClick={handleExpand}>↧</button>
      <h3>{subject}</h3>
      <p>{from}</p>
      <p>{dateString}</p>
      <p>{data.snippet}</p>
    </>
  );
};
export default Message;
