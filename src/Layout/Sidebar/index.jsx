import React, { Fragment, useState, useEffect, useContext } from "react";
import CustomContext from "../../_helper/Customizer";
import { getMenuItemsByRole } from "./Menu";
import SidebarIcon from "./SidebarIcon";
import SidebarLogo from "./SidebarLogo";
import SidebarMenu from "./SidebarMenu";
import { X } from "react-feather"; 
import { getStoredUserRole } from "../../Utils/authRole";

const Sidebar = (props) => {
  const { toggleIcon, toggleSidebar } = useContext(CustomContext);
  const layout = localStorage.getItem("layout") || "Admin";
  const role = getStoredUserRole();

  const [mainmenu, setMainMenu] = useState(() => getMenuItemsByRole(role));
  const [width, setWidth] = useState(window.innerWidth);

  const handleScroll = () => {
    const sidebar = document.querySelector(".sidebar-main");
    if (!sidebar) return;
    if (window.scrollY > 400) sidebar.classList.add("hovered");
    else sidebar.classList.remove("hovered");
  };
 
  const handleResize = () => setWidth(window.innerWidth);

  const setNavActive = (item, menuSource = mainmenu) => {
    menuSource.forEach((menuItems) => {
      menuItems.Items.forEach((Items) => {
        if (Items !== item) Items.active = false;
        const overlay = document.querySelector(".bg-overlay1");
        if (overlay) overlay.classList.remove("active");
        if (Items.children && Items.children.includes(item)) Items.active = true;
        if (Items.children) {
          Items.children.forEach((submenuItems) => {
            if (submenuItems.children && submenuItems.children.includes(item)) {
              Items.active = true;
              submenuItems.active = true;
            }
          });
        }
      });
    });
    item.active = !item.active;
    setMainMenu([...menuSource]);
  };

  const closeOverlay = () => {
    const overlay = document.querySelector(".bg-overlay1");
    const sidebarLinks = document.querySelector(".sidebar-links");
    if (overlay) overlay.classList.remove("active");
    if (sidebarLinks) sidebarLinks.classList.remove("active");
    
    // Close sidebar on mobile when overlay is clicked
    if (window.innerWidth <= 992) {
      toggleSidebar(true);
    }
  };

  // Close sidebar function
  const closeSidebar = () => {
    if (window.innerWidth <= 992) {
      toggleSidebar(true);
      closeOverlay();
    }
  };

  useEffect(() => {
    const menuTree = getMenuItemsByRole(role);
    setMainMenu(menuTree);

    const leftArrow = document.querySelector(".left-arrow");
    if (leftArrow) leftArrow.classList.add("d-none");

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    const currentUrl = window.location.pathname;
    menuTree.forEach((items) => {
      items.Items.forEach((Items) => {
        if (Items.path === currentUrl) setNavActive(Items, menuTree);
        if (Items.children) {
          Items.children.forEach((subItems) => {
            if (subItems.path === currentUrl) setNavActive(subItems, menuTree);
            if (subItems.children) {
              subItems.children.forEach((subSubItems) => {
                if (subSubItems.path === currentUrl)
                  setNavActive(subSubItems, menuTree);
              });
            }
          });
        }
      });
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [layout, role]);

  const activeClass = () => {
    const overlay = document.querySelector(".bg-overlay1");
    if (overlay) overlay.classList.add("active");
  };

  return (
    <Fragment>
      <style>{`
        /* ✅ Base sidebar wrapper */
        .sidebar-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          width: 260px;
          height: 100vh;
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
          z-index: 1001;
          background: var(--sidebar-bg, #fff);
          box-shadow: 2px 0 8px rgba(0,0,0,0.05);
        }

        body.dark-only .sidebar-wrapper,
        body.dark-sidebar .sidebar-wrapper {
          --sidebar-bg: #1f232b;
          box-shadow: 2px 0 14px rgba(0,0,0,0.35);
        }

        /* ✅ Fixed header */
        .sidebar-header {
          flex-shrink: 0;
          padding: 15px;
          border-bottom: 1px solid var(--sidebar-border, #eee);
          z-index: 2;
          background: inherit;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        body.dark-only .sidebar-header,
        body.dark-sidebar .sidebar-header {
          --sidebar-border: rgba(255,255,255,0.08);
        }

        /* ✅ Close button for mobile */
        .sidebar-close-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .sidebar-close-btn:hover {
          background-color: rgba(0,0,0,0.06);
        }

        body.dark-only .sidebar-close-btn,
        body.dark-sidebar .sidebar-close-btn {
          color: #fff;
        }

        body.dark-only .sidebar-close-btn:hover,
        body.dark-sidebar .sidebar-close-btn:hover {
          background-color: rgba(255,255,255,0.08);
        }

        /* ✅ Remove unwanted shadow from logo */
        .sidebar-wrapper .logo-wrapper,
        .sidebar-wrapper .logo-icon-wrapper {
          box-shadow: none !important;
          padding: 0px 15px !important;
        }

        /* Image size ke liye CSS add karein */
        .sidebar-wrapper .logo-wrapper img,
        .sidebar-wrapper .logo-icon-wrapper img {
          width: 150px !important;
          height: auto !important;
          max-width: 100% !important;
        }

        .sidebar-wrapper.close_icon .logo-wrapper {
          display: none;
        }

        .sidebar-wrapper:not(.close_icon) .logo-icon-wrapper {
          display: none;
        }

        .sidebar-wrapper.close_icon .logo-icon-wrapper {
          display: block;
        }

        /* ✅ Scrollable menu section */
        .sidebar-content {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .sidebar-content::-webkit-scrollbar {
          width: 6px;
        }
        .sidebar-content::-webkit-scrollbar-thumb {
          border-radius: 4px;
        }

        body.dark-only .sidebar-content::-webkit-scrollbar-thumb,
        body.dark-sidebar .sidebar-content::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.18);
        }

        /* ✅ Background overlay for mobile */
        .bg-overlay1 {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.3);
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease;
          z-index: 1000;
        }

        /* ✅ Compact view (desktop collapse) */
        .sidebar-wrapper.close_icon {
          width: 80px;
        }

        /* ✅ Mobile view adjustments */
        @media (max-width: 992px) {
          .sidebar-wrapper {
            width: 280px;
            left: -280px;
            transition: all 0.35s ease-in-out;
            box-shadow: 4px 0 12px rgba(0,0,0,0.15);
          }

          .sidebar-wrapper.active {
            left: 0;
          }

          .sidebar-header {
            padding: 12px 15px;
            border-bottom: 1px solid #eee;
          }

          .sidebar-close-btn {
            display: block;
          }

          .sidebar-content {
            padding-bottom: 80px;
          }

          /* When menu open, show overlay */
          .bg-overlay1.active {
            visibility: visible;
            // opacity: 1;
          }
        }

        @media (max-width: 576px) {
          .sidebar-wrapper {
            width: 260px;
            left: -260px;
          }
        }
      `}</style>

      <div className="bg-overlay1" onClick={closeOverlay}></div>

      <div
        className={`sidebar-wrapper ${toggleIcon ? "close_icon" : ""} ${!toggleIcon && width <= 992 ? "active" : ""}`}
        sidebar-layout="stroke-svg"
      >
        {/* ✅ Fixed header with close button */}
        <div className="sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <SidebarIcon />
            <SidebarLogo />
          </div>
          <button 
            className="sidebar-close-btn" 
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* ✅ Scrollable menu */}
        <div className="sidebar-content">
          <SidebarMenu
            mainmenu={mainmenu}
            setMainMenu={setMainMenu}
            props={props}
            setNavActive={setNavActive}
            activeClass={activeClass}
            width={width}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default Sidebar;
