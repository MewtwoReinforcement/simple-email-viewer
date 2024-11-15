import React from 'react';
import type { Header, MessageProps } from '../types';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Message: React.FC<MessageProps> = ({
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
    <>
      <div className="messageBox">
        <div className="expandButton">
          <h3>{subject}</h3>
          <IconButton
            sx={{ backgroundColor: '#242424', color: '#bbbaba' }}
            onClick={handleExpand}
          >
            <ExpandMoreIcon />
          </IconButton>
        </div>
        <div className="messageHead">
          <p>{from}</p>
          <p>{dateString}</p>
          <p style={{ marginBottom: '10px', fontSize: '.8rem' }}>
            {messageData.snippet}
          </p>
        </div>
      </div>
    </>
  );
};
export default Message;
