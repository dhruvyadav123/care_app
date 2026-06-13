import React, { useState } from 'react';
import SvgIcon from '../../../Components/Common/Component/SvgIcon';
import { CHECKALL, Notification } from '../../../Constant';

const Notificationbar = () => {
  const [notificationDropDown, setNotificationDropDown] = useState(false);
  const notificationItems = [
    { title: 'New appointment request received', time: '10 min ago', color: 'danger' },
    { title: 'Expert profile updated successfully', time: '1 hr ago', color: 'success' },
    { title: 'Theme settings changed', time: '3 hr ago', color: 'info' },
    { title: 'System sync completed', time: '6 hr ago', color: 'warning' },
  ];

  return (
    <li className='onhover-dropdown'>
      <div className='notification-box position-relative' onClick={() => setNotificationDropDown(!notificationDropDown)}>
        <div className='header-tool-btn'>
          <SvgIcon iconId='notification' />
        </div>
        <span
          className='badge rounded-pill badge-danger'
          style={{
            position: 'absolute',
            top: '-3px',
            right: '-1px',
            minWidth: '18px',
            height: '18px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            padding: 0,
            border: '2px solid #fff',
          }}
        >
          {notificationItems.length}
        </span>
      </div>
      <div className={`notification-dropdown onhover-show-div ${notificationDropDown ? 'active' : ''}`}>
        <h6 className='f-18 mb-0 dropdown-title'>{Notification}</h6>
        <ul>
          {notificationItems.map((item, index) => (
            <li className={`b-l-${item.color} border-4`} key={index}>
              <p className='mb-0 d-flex flex-column'>
                <span>{item.title}</span>
                <span className={`font-${item.color} mt-1`}>{item.time}</span>
              </p>
            </li>
          ))}
          <li>
            <a className='f-w-700' href='#javascript'>
              {CHECKALL}
            </a>
          </li>
        </ul>
      </div>
    </li>
  );
};

export default Notificationbar;
