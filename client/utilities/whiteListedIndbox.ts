const fakeMessage = {
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
    headers: [
      { name: 'from', value: 'joeBiden@whitehouse.gov' },
      { name: 'from', value: 'donaldTrump@assholefuckface.gov' },
    ],
    body: {
      attachmentId: '70',
      size: 10,
      data: "Hey, It's your pal Joe. Please Vote today...",
    },
    parts: [],
  },
  sizeEstimate: 10,
  raw: 'etc',
};

console.log(fakeMessage.payload.headers[0].value);

// get array of all messages
// iterate through and filter out from: 'value' if found in contacts

const whiteListed = (unfilteredMsgs, contactsArr) => {
  //set from property to variable
  const sender = message.payload.headers[0].value;
  contactsArr.push(sender);
};
