import React, { useState } from 'react';
import CurrMessage from '../components/Message';
import ExpandedMessage from '../components/ExpandedMessage';

import { FeedContainerProps, Message } from '../types';

const FeedContainer: React.FC<FeedContainerProps> = ({messages}) => {
  // would need to be an array, or Set if we want multiple messages to be expanded at once
  const [clickedID, setClickedID] = useState('');

  // const fakeMessages = [
  //   {
  //     id: '2',
  //     threadId: 'thread123',
  //     labelIds: ['label123'],
  //     snippet: 'Snippet of Message',
  //     historyId: 'history123',
  //     internalDate: 'MM/DD/YYYY',
  //     payload: {
  //       partId: '1',
  //       mimeType: 'unknown',
  //       filename: 'email.txt',
  //       headers: [{ name: 'from', value: 'joeBiden@whitehouse.gov' }],
  //       body: {
  //         attachmentId: '70',
  //         size: 10,
  //         data: "Hey, It's your pal Joe. Please Vote today...",
  //       },
  //       parts: [],
  //     },
  //     sizeEstimate: 10,
  //     raw: 'etc',
  //   },
  //   {
  //     id: '1',
  //     threadId: 'thread133',
  //     labelIds: ['label323'],
  //     snippet: 'Leatherface and his deranged family capture and torment the group, leading to a harrowing sequence of events in which Sally fights for her survival.',
  //     historyId: 'history12345',
  //     internalDate: 'MM/DD/YYYY',
  //     payload: {
  //       partId: '1',
  //       mimeType: 'unknown',
  //       filename: 'email.txt',
  //       headers: [{ name: 'from', value: 'kamala@whitehouse.gov' }],
  //       body: {
  //         attachmentId: '70',
  //         size: 10,
  //         data: 'Keep Kamala and avoid the dramala...',
  //       },
  //       parts: [],
  //     },
  //     sizeEstimate: 10,
  //     raw: 'etc',
  //   },
  // ];

  const messagesList = messages.map((mess: Message ) =>
    mess.id === clickedID ? (
      <ExpandedMessage
        key={mess.id}
        data={mess}
        handleExpand={() => setClickedID('')}
      />
    ) : (
      <CurrMessage
        key={mess.id}
        data={mess}
        handleExpand={() => setClickedID(mess.id)}
      />
    ),
  );
  return <div>{messagesList}</div>;
};

export default FeedContainer;
