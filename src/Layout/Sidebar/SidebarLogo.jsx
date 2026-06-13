import React, { useContext } from "react";
import { Link } from "react-router-dom";
import CustomizerContext from "../../_helper/Customizer";
import LightLogo from "../../assets/images/hclogos.jpg";
import DarkLogo from "../../assets/images/logo/logo_dark.png";

const SidebarLogo = () => {
  const { mix_background_layout, layout } = useContext(CustomizerContext);

  const layout1 =
    typeof window !== "undefined"
      ? localStorage.getItem("sidebar_layout") || layout || "default"
      : layout || "default";

  const dashboardURL = `${process.env.PUBLIC_URL}/dashboard/default`;
  const isDarkTheme = mix_background_layout === "dark-only" || mix_background_layout === "dark-sidebar";
  const logoSrc = isDarkTheme ? DarkLogo : LightLogo;
  const logoAlt = isDarkTheme ? "Dark Logo" : "Logo";

  return (
    <div className="logo-wrapper">
      <Link to={dashboardURL}>
        <img
          className="img-fluid d-inline"
          src={logoSrc}
          alt={logoAlt}
          width={layout1.includes("close_icon") ? 56 : 150}
          height={40}
        />
      </Link>
    </div>
  );
};

export default SidebarLogo;
