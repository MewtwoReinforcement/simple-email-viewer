import React from 'react';
import { NavBarProps } from '../types';

const Navbar: React.FC<NavBarProps> = ({setSelectedFeed}) => {
  return (
    <div className='navbar'>
      <button onClick={()=> setSelectedFeed('contacts')}>Contacts</button>
      <button onClick={()=> setSelectedFeed('other')}>Other</button>
    </div>
  );
};

export default Navbar;
