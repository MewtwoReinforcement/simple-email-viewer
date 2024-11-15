import React, { useState } from 'react';
import CurrMessage from '../components/Message';
import ExpandedMessage from '../components/ExpandedMessage';

import { FeedContainerProps, Message } from '../types';

const FeedContainer: React.FC<FeedContainerProps> = ({ messages }) => {
  // would need to be an array, or Set if we want multiple messages to be expanded at once
  const [clickedID, setClickedID] = useState('');

  const messagesList = messages.map((mess: Message) =>
    mess.id === clickedID ? (
      <ExpandedMessage
        key={mess.id}
        messageData={mess}
        handleExpand={() => setClickedID('')}
      />
    ) : (
      <CurrMessage
        key={mess.id}
        messageData={mess}
        handleExpand={() => setClickedID(mess.id)}
      />
    ),
  );
  return <div>{messagesList}</div>;
};

export default FeedContainer;
