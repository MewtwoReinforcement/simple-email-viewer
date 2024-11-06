import React from 'react';
import type { Header, MessageProps } from '../types';

const expandedMessage: React.FC<MessageProps> = ({
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
        data: "Hey, It's your pal Joe. Please Vote today...Hey, It's your pal Joe. Please Vote today...Hey, It's your pal Joe. Please Vote today...Hey, It's your pal Joe. Please Vote today...Hey, It's your pal Joe. Please Vote today...Hey, It's your pal Joe. Please Vote today...Hey, It's your pal Joe. Please Vote today...Hey, It's your pal Joe. Please Vote today...Hey, It's your pal Joe. Please Vote today...Hey, It's your pal Joe. Please Vote today...Hey, It's your pal Joe. Please Vote today...Hey, It's your pal Joe. Please Vote today...Hey, It's your pal Joe. Please Vote today...Hey, It's your pal Joe. Please Vote today...Hey, It's your pal Joe. Please Vote today...",
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
    <div className='expandedMessage, message'>
    <div className='expandButton'>
      <button onClick={handleExpand}>↥</button>
      <div className='messageHead'>
        <h3>{subject}</h3>
        <p>{from}</p>
        <p>{dateString}</p>
      </div>
    </div>
      <p className='messageBody'>{data.payload.body.data}</p>
    </div>
  );
};
export default expandedMessage;
