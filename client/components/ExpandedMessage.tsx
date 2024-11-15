import React from 'react';
import type { Header, MessageProps } from '../types';
import IconButton from '@mui/material/IconButton';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const expandedMessage: React.FC<MessageProps> = ({
  messageData,
  handleExpand,
}): React.JSX.Element => {
  const messageDate = new Date(messageData.internalDate);
  const dateString =
    new Date().toDateString() === messageDate.toDateString()
      ? messageDate.toLocaleTimeString() // sun nov 15 12:15 pm
      : messageDate.toLocaleString(); // 12:15 pm
  const subject = messageData.payload.headers.find(
    ({ name }: Header) => name === 'Subject',
  )?.value;
  const from = messageData.payload.headers.find(
    ({ name }: Header) => name === 'from',
  )?.value;
  return (
    <div className="messageBox">
      <div className="expandedMessage, message">
        <div className="expandButton">
          <h3>{subject}</h3>
          <IconButton
            sx={{ backgroundColor: '#242424', color: '#bbbaba' }}
            onClick={handleExpand}
          >
            <ExpandLessIcon />
          </IconButton>
        </div>
        <div className="messageHead">
          <p>{from}</p>
          <p>{dateString}</p>
        </div>
        <div className="messageBody">
          <p>{messageData.payload.body.data}</p>
        </div>
      </div>
    </div>
  );
};
export default expandedMessage;
