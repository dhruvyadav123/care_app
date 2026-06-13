
  import React, { useContext, useState, useEffect } from "react";
  import { ArrowRight, ArrowLeft } from "react-feather";
  import CustomizerContext from "../../_helper/Customizer";
  import SidebarMenuItems from "./SidebarMenuItems";

  const SidebarMenu = ({
    mainmenu,
    setMainMenu,
    props,
    sidebartoogle,
    setNavActive,
    activeClass,
    width,
  }) => {
    const { customizer } = useContext(CustomizerContext);
    const wrapper = customizer.settings.sidebar.type;
    const [margin, setMargin] = useState(0);

    const [isHorizontal, setIsHorizontal] = useState(
      wrapper.split(" ").includes("horizontal-wrapper")
    );

    // ✅ Scroll right
    const scrollToRight = () => {
      const newMargin = margin - width;
      setMargin(newMargin);
      document.querySelector(".left-arrow")?.classList.remove("d-none");
      if (Math.abs(newMargin) >= document.querySelector("#sidebar-menu").scrollWidth - width) {
        document.querySelector(".right-arrow")?.classList.add("d-none");
      }
    };

    // ✅ Scroll left
    const scrollToLeft = () => {
      const newMargin = margin + width;
      if (newMargin >= 0) {
        setMargin(0);
        document.querySelector(".left-arrow")?.classList.add("d-none");
      } else {
        setMargin(newMargin);
      }
      document.querySelector(".right-arrow")?.classList.remove("d-none");
    };

    // ✅ Reset arrows when resizing
    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth < 992) {
          document.querySelector(".right-arrow")?.classList.add("d-none");
          document.querySelector(".left-arrow")?.classList.add("d-none");
        } else {
          document.querySelector(".right-arrow")?.classList.remove("d-none");
        }
      };

      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
      <>
        {/* ✅ Inline CSS */}
        <style>{`
          .sidebar-main {
            position: relative;
            width: 100%;
            height: calc(100vh - 0px);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            background: transparent;
            transition: all 0.3s ease;
          
          }

          body.dark-only .sidebar-main,
          body.dark-sidebar .sidebar-main {
            color: rgba(255,255,255,0.92);
          }

          .sidebar-links {
            list-style: none;
            margin: 0;
            padding: 0;
            overflow-y: auto;
            flex: 1;
            scrollbar-width: thin;
            scrollbar-color: #999 transparent;
          }

          .sidebar-links::-webkit-scrollbar {
            width: 6px;
          }
          .sidebar-links::-webkit-scrollbar-thumb {
            background-color: #bbb;
            border-radius: 4px;
          }
          .sidebar-links:hover::-webkit-scrollbar-thumb {
            background-color: #888;
          }

          body.dark-only .sidebar-links::-webkit-scrollbar-thumb,
          body.dark-sidebar .sidebar-links::-webkit-scrollbar-thumb {
            background-color: rgba(255,255,255,0.18);
          }

          .left-arrow,
          .right-arrow {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0,0,0,0.06);
            padding: 8px;
            border-radius: 50%;
            cursor: pointer;
            z-index: 10;
            transition: all 0.3s ease;
          }

          .left-arrow {
            left: 5px;
          }

          .right-arrow {
            right: 5px;
          }

          .left-arrow:hover,
          .right-arrow:hover {
            background: rgba(0,0,0,0.12);
          }

          body.dark-only .left-arrow,
          body.dark-only .right-arrow,
          body.dark-sidebar .left-arrow,
          body.dark-sidebar .right-arrow {
            background: rgba(255,255,255,0.08);
            color: #fff;
          }

          body.dark-only .left-arrow:hover,
          body.dark-only .right-arrow:hover,
          body.dark-sidebar .left-arrow:hover,
          body.dark-sidebar .right-arrow:hover {
            background: rgba(255,255,255,0.14);
          }

          .d-none {
            display: none !important;
          }

          .mobile-back {
            display: none;
          }

          @media (max-width: 992px) {
            .sidebar-main {
              height: auto;
            }
            .left-arrow,
            .right-arrow {
              display: none !important;
            }
            .mobile-back {
              display: block;
              padding: 10px;
              font-weight: 500;
              background: #f8f9fa;
              border-bottom: 1px solid #eee;
            }

            body.dark-only .mobile-back,
            body.dark-sidebar .mobile-back {
              background: rgba(255,255,255,0.04);
              border-bottom: 1px solid rgba(255,255,255,0.08);
              color: #fff;
            }
          }
        `}</style>

        <nav className="sidebar-main" id="sidebar-main">
          <div className="left-arrow d-none" onClick={scrollToLeft}>
            <ArrowLeft size={18} />
          </div>

          <div
            id="sidebar-menu"
            style={
              isHorizontal
                ? { marginLeft: `${margin}px`, transition: "margin 0.3s ease" }
                : { margin: "0px" }
            }
          >
            <ul className="sidebar-links custom-scrollbar">
              <li className="back-btn">
                <div className="mobile-back text-end">
                  <span>Back</span>
                  <i className="fa fa-angle-right ps-2" aria-hidden="true"></i>
                </div>
              </li>
              <SidebarMenuItems
                mainmenu={mainmenu}
                setMainMenu={setMainMenu}
                props={props}
                sidebartoogle={sidebartoogle}
                setNavActive={setNavActive}
                activeClass={activeClass}
              />
            </ul>
          </div>

          <div className="right-arrow" onClick={scrollToRight}>
            <ArrowRight size={18} />
          </div>
        </nav>
      </>
    );
  };

  export default SidebarMenu;
