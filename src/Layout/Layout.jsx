import React, { Fragment } from "react";
import { ToastContainer } from "react-toastify";
import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Taptop from "./TapTop";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ThemeCustomize from "../Layout/ThemeCustomizer";
import Footer from "./Footer";
import CustomizerContext from "../_helper/Customizer";
import AnimationThemeContext from "../_helper/AnimationTheme";
import ConfigDB from "../Config/ThemeConfig";
import Loader from "./Loader";
import { classes } from "../Data/Layouts";

// Suppress findDOMNode warning for react-transition-group
const originalError = console.error;
console.error = (...args) => {
  if (args[0]?.includes?.('findDOMNode is deprecated')) return;
  originalError.apply(console, args);
};
const AppLayout = ({ children, classNames, ...rest }) => {
  const { layout } = useContext(CustomizerContext);
  const { sidebarIconType } = useContext(CustomizerContext);

  const layout1 = localStorage.getItem("sidebar_layout") || layout;
  const sideBarIcon = localStorage.getItem("sidebar_icon_type") || sidebarIconType;
  const location = useLocation();
  const { animation } = useContext(AnimationThemeContext);
  const animationTheme = localStorage.getItem("animation") || animation || ConfigDB.data.router_animation;
  const layoutKeys = classes.map((item) => Object.keys(item).pop());
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];

  if (pathSegments.length > 1 && layoutKeys.includes(lastSegment)) {
    const normalizedPath = `/${pathSegments.slice(0, -1).join("/")}`;
    return <Navigate to={`${normalizedPath}${location.search}${location.hash}`} replace />;
  }

  return (
    <Fragment>
      <Loader />
      <Taptop />
      <div className={`page-wrapper ${layout1}`} sidebar-layout={sideBarIcon} id="pageWrapper">
        <Header />
        <div className="page-body-wrapper">
          <Sidebar />
          <TransitionGroup {...rest}>
            <CSSTransition key={location.key} timeout={100} classNames={animationTheme} unmountOnExit>
              <div className="page-body">
                <div>
                  <div>
                    <Outlet />
                  </div>
                </div>
              </div>
            </CSSTransition>
          </TransitionGroup>
          <Footer />
        </div>
      </div>
      <ThemeCustomize />
      <ToastContainer />
    </Fragment>
  );
};
export default AppLayout;
