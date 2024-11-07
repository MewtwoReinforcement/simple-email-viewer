import type { Message } from '../types.ts';


const fakeMessage = {
  id: '2',
  threadId: 'thread123',
  labelIds: ['label123'],
  snippet: 'Snippet of Message',
  historyId: 'history123',
  internalDate: '11/5/2024',
  payload: {
    partId: '1',
    mimeType: 'unknown',
    filename: 'email.txt',
    headers: [{ name: 'from', value: 'joeBiden@whitehouse.gov' }],
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

// // returns array of messages from senders in contacts
// const whiteListed = (unfilteredMsgs: Message[], contactsArr: []): Message[] => {
//   //in unfilteredMsgs, filter messages who's name: from object is fount in our contacts
//   return unfilteredMsgs.filter((mess) => {
//     return contactsArr.includes(mess.payload.headers[0].value);
//   });
// };

// export default whiteListed;
