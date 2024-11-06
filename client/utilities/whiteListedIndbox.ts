const fakeMessage = {
  id: '123',
  threadId: 'thread123',
  labelIds: ['label123'],
  snippet: 'Snippet of Message',
  historyId: 'history123',
  internalDate: 'MM/DD/YYYY',
  payload: {
    messagePart: {
      from: 'sender@place.com',
      to: 'user@user.com',
    },
  },
  sizeEstimate: 10,
  raw: 'etc',
};

const whiteListed = (message) => {};
