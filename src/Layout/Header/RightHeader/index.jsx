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

        .header-search-nav {
          position: relative;
          display: flex;
          align-items: center;
          width: min(280px, 28vw);
        }

        .header-search-control {
          width: 100%;
          min-height: 40px;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 0 12px;
          border: 1px solid #e3e7ef;
          border-radius: 12px;
          background: #f8faff;
          color: #7b8499;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }

        .header-search-control:focus-within {
          border-color: #7366ff;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(115, 102, 255, 0.12);
        }

        .header-search-control input {
          width: 100%;
          border: 0;
          outline: 0;
          color: #2b2f3a;
          background: transparent;
          font-size: 14px;
        }

        .header-search-control input::-webkit-search-cancel-button {
          display: none;
        }

        .header-search-clear {
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 3px;
          border: 0;
          border-radius: 50%;
          color: #8b93a7;
          background: transparent;
        }

        .header-search-clear:hover {
          color: #2b2f3a;
          background: #edf0f7;
        }

        .header-search-results {
          position: absolute;
          z-index: 1060;
          top: calc(100% + 10px);
          left: 0;
          right: 0;
          overflow: hidden;
          padding: 7px;
          border: 1px solid #e7eaf1;
          border-radius: 14px;
          background: #fff;
          box-shadow: 0 16px 40px rgba(20, 28, 45, 0.16);
        }

        .header-search-result {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 10px 11px;
          border: 0;
          border-radius: 9px;
          color: #343947;
          background: transparent;
          text-align: left;
        }

        .header-search-result:hover,
        .header-search-result:focus {
          color: #4c3ff0;
          background: #f2f0ff;
          outline: 0;
        }

        .header-search-empty {
          padding: 12px;
          color: #8b93a7;
          font-size: 13px;
          text-align: center;
        }

        @media (max-width: 991px) {
          .header-search-nav {
            width: min(220px, 32vw);
          }
        }

        @media (max-width: 767px) {
          .header-search-nav {
            width: 170px;
          }

          .header-search-control {
            padding: 0 9px;
          }
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
