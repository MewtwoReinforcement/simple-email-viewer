import React from 'react';
import { NavBarProps } from '../types';

const Navbar: React.FC<NavBarProps> = ({setSelectedFeed}) => {
  return (
    <div className='navbar'>
      <h2>whitelisted</h2>
      <div className='navButtons'>
        <button onClick={()=> setSelectedFeed('contacts')}>Contacts</button>
        <button onClick={()=> setSelectedFeed('other')}>Other</button>
      </div>
    </div>
  );
};

export default Navbar;
