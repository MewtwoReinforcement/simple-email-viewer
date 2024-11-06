import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import FeedContainer from './FeedContainer';

import { Contact, Feed, Flag, FlaggedMessage, Header, Message } from '../types';

const AppContainer: React.FC = () => {
  const [userID] = useState('');
  const [selectedFeed, setSelectedFeed] = useState<Feed>('contacts');
  const [flaggedMessages, setFlaggedMessages] = useState<FlaggedMessage[]>([]);
  const [contacts, setContacts] = useState<Set<Contact>>(new Set());

  useEffect(() => {
    fetch(`/users/${userID}/messages`)
      .then((response) => response.json())
      // maybe we concat recent messages?
      .then((newMessages: Message[]) =>
        setFlaggedMessages(() =>
          newMessages.map((message) => {
            // should probably move this part out to a utils function
            // (and the contacts state can be fetched directly from that one)
            const from: Contact =
              message.payload.headers.find(
                ({ name }: Header) => name === 'from',
              )?.value ?? 'No From Header Found';
            const flags = new Set<Flag>();
            if (contacts.has(from)) flags.add('contacts');
            // could identify what makes an email a package tracking email here
            // add package flag

            return { ...message, flags };
          }),
        ),
      )
      .catch((error) => {
        // TODO: need to check actual message
        if (error.message === 'connection error') {
          // change something on dom display?
          console.log('Error connecting with backend');
        }
      });

    fetch(`/users/${userID}/contacts`)
      .then((response) => response.json())
      .then((newContacts) => setContacts(() => newContacts))
      .catch((error) => {
        // TODO: need to check actual message
        if (error.message === 'connection error') {
          // change something on dom display?
          console.log('Error connecting with backend');
        }
      });
  }, []);

  const filteredMessages: FlaggedMessage[] = flaggedMessages.filter(
    ({ flags }: FlaggedMessage): boolean =>
      selectedFeed === 'other' ? flags.size === 0 : flags.has(selectedFeed),
  );

  return (
    <>
      <Navbar selectedFeed={selectedFeed} setSelectedFeed={setSelectedFeed} />
      <FeedContainer messages={filteredMessages} />
    </>
  );
};

export default AppContainer;
