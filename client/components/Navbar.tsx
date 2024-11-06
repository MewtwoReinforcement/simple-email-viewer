import React from 'react';

const Navbar = ({ filterMsgs, unfilterMsgs }) => {
  return (
    <div>
      {/* buttons that change state of messagesArray in FeedContainer */}
      <button onClick={filterMsgs}>Whitelisted</button>
      <button onClick={unfilterMsgs}>Other</button>
    </div>
  );
};

export default Navbar;
