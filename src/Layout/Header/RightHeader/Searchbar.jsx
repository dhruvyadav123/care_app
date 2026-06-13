import React, { useState } from 'react';
import SvgIcon from '../../../Components/Common/Component/SvgIcon';

const Searchbar = () => {
  const [searchresponsive, setSearchresponsive] = useState(false);
  const SeacrhResposive = (nextState) => {
    setSearchresponsive(nextState);
    const searchElement = document.querySelector('.search-full');
    if (!searchElement) return;

    if (nextState) {
      searchElement.classList.add('open');
    } else {
      searchElement.classList.remove('open');
    }
  };

  return (
    <li>
      <button type='button' className={`header-tool-btn ${searchresponsive ? 'active' : ''}`} onClick={() => SeacrhResposive(!searchresponsive)}>
        <SvgIcon iconId='search' />
      </button>
    </li>
  );
};

export default Searchbar;
