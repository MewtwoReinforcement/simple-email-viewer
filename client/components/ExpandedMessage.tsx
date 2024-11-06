import React from 'react';
import type { Header, MessageProps } from '../types';
import IconButton from '@mui/material/IconButton';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const expandedMessage: React.FC<MessageProps> = ({
  data,
  handleExpand,
}): React.JSX.Element => {
  data = {
    id: '2',
    threadId: 'thread123',
    labelIds: ['label123'],
    snippet: 'The Texas Chain Saw Massacre (1974) is a horror classic that follows a group...',
    historyId: 'history123',
    internalDate: '11/05/2024',
    payload: {
      partId: '1',
      mimeType: 'unknown',
      filename: 'email.txt',
      headers: [{ name: 'from', value: 'joeBiden@whitehouse.gov' }],
      body: {
        attachmentId: '70',
        size: 10,
        data: `
                  The Texas Chain Saw Massacre (1974) is a horror classic that follows a group of friends who encounter a terrifying family of cannibals 
                  while on a road trip in rural Texas. The story centers on siblings Sally and Franklin Hardesty, who, along with their 
                  friends, travel to check on their grandfather's grave after hearing reports of local grave robberies.
                  As they drive through the Texas countryside, they pick up a strange hitchhiker who behaves erratically and harms himself before being 
                  forced out of the van. Soon after, they run out of gas and are left stranded near a remote, decrepit house. One by one, 
                  the friends explore the house and encounter Leatherface—a towering figure wearing a mask made of human skin and wielding a chainsaw.
                  Leatherface and his deranged family capture and torment the group, leading to a harrowing sequence of events in which Sally fights for her survival. 
                  The film is renowned for its raw, gritty tone and relentless tension, with Sally's desperate escape scene 
                  adding to its notoriety. Sally ultimately escapes, though scarred and traumatized, as Leatherface furiously swings his chainsaw in frustration.
                  The film's unsettling depiction of violence, though largely implied rather than shown explicitly, and its relentless pace have solidified it as a 
                  foundational film in the horror genre, influencing countless slasher movies in the decades since its release.`,
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
    <div className='messageBox'>
    <div className='expandedMessage, message'>
    <div className='expandButton'>
      <h3>placeholder</h3>
      <IconButton sx={{backgroundColor: '#242424', color: '#bbbaba'}}><ExpandLessIcon onClick={handleExpand}/></IconButton>
    </div>
    <div className='messageHead'>
      <p>{from}</p>
      <p>{dateString}</p>
    </div>
    <div className='messageBody'> 
      <p>{data.payload.body.data}</p>
    </div>
    </div>
    </div>
  );
};
export default expandedMessage;
