import React, { Fragment } from 'react';

import Searchbar from './Searchbar';
import Notificationbar from './Notificationbar';
import MoonLight from './MoonLight';
import UserHeader from './UserHeader';
import { UL } from '../../../AbstractElements';
import { Col } from 'reactstrap';

const RightHeader = () => {
  return (
    <Fragment>
      <style>{`
        .right-header .nav-menus {
          align-items: center;
          gap: 10px;
        }

        .header-tool-btn {
          width: 38px;
          height: 38px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          color: #5f667a;
          background: transparent;
          border: 1px solid transparent;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .header-tool-btn:hover {
          background: #f5f7fb;
          border-color: #e8ebf3;
          color: #212529;
        }

        .header-tool-btn svg,
        .header-tool-btn i {
          width: 18px;
          height: 18px;
        }

        .header-tool-btn.active {
          background: #eef4ff;
          border-color: #d9e6ff;
          color: #4c6fff;
        }

        .header-divider {
          width: 1px;
          height: 26px;
          background: #e8ebf3;
          margin: 0 4px;
        }

        .profile-nav {
          position: relative;
        }

        .profile-nav .profile-media {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 6px 8px;
          border-radius: 14px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .profile-nav .profile-media:hover {
          background: #f7f8fc;
        }

        .profile-nav .media-body span {
          display: block;
          font-weight: 700;
          color: #2b2f3a;
          line-height: 1.1;
        }

        .profile-nav .media-body p {
          color: #8b93a7;
          font-size: 13px;
          margin-top: 3px !important;
        }

        .profile-dropdown {
          min-width: 210px;
          border: 1px solid #edf0f7;
          border-radius: 18px;
          padding: 10px;
          box-shadow: 0 16px 45px rgba(20, 28, 45, 0.12);
          background: #fff;
        }

        .profile-dropdown li {
          border-radius: 12px;
          transition: background 0.2s ease;
        }

        .profile-dropdown li:hover {
          background: #f6f8fc;
        }

        .profile-dropdown li svg {
          width: 17px;
          height: 17px;
        }

        .notification-dropdown {
          min-width: 280px;
          border: 1px solid #edf0f7;
          border-radius: 18px;
          padding: 14px;
          box-shadow: 0 16px 45px rgba(20, 28, 45, 0.12);
          background: #fff;
        }

        .notification-dropdown ul li {
          border-radius: 12px;
          padding: 10px 12px;
          margin-bottom: 8px;
          background: #f8faff;
        }

        .notification-dropdown ul li:last-child {
          margin-bottom: 0;
          background: transparent;
          padding-bottom: 0;
        }
      `}</style>
      <Col xxl='7' xl='6' md='7' className='nav-right pull-right right-header col-8 p-0 ms-auto'>
        <UL attrUL={{ className: 'simple-list nav-menus flex-row' }}>
          <Searchbar />
          <MoonLight />
          <Notificationbar />
          <li className='header-divider'></li>
          <UserHeader />
        </UL>
      </Col>
    </Fragment>
  );
};

export default RightHeader;
