import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import FeedContainer from './FeedContainer';
//function that filters messages from senders in our contacts
import whiteListed from '../utilities/whiteListedIndbox';
import type { Message } from '../types';
const AppContainer = () => {
  const [userID, setUserID] = useState('');
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  //test - stateful component to be rendered in feed container
  const [feedMessages, setFeedMessages] = useState(messages);
  //store filtered messages
  const whiteListedMsgs: Message[] = whiteListed(messages, contacts);

  useEffect(() => {
    fetch(`/users/${userID}/messages`)
      .then((response) => response.json())
      // maybe we concat recent messages?
      .then((newMessages) => setMessages(() => newMessages))
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

  return (
    <div>
      <Navbar
        filterMsgs={setFeedMessages(whiteListedMsgs)}
        unfilterMsgs={setFeedMessages(messages)}
      />
      <FeedContainer messagesArr={setFeedMessages} />
    </div>
  );
};

export default AppContainer;
