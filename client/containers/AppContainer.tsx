import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import FeedContainer from './FeedContainer';

const AppContainer = () => {
  const [userID, setUserID] = useState('');
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);

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
      <Navbar />
      <FeedContainer />
    </div>
  );
};

export default AppContainer;
