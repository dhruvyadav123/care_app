import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, LogIn, Mail, User } from "react-feather";
import man from "../../../assets/images/dashboard/profile.png";

import { LI, UL, Image, P } from "../../../AbstractElements";
import { Account, Admin, Inbox, LogOut, Taskboard } from "../../../Constant";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../Redux/stateSlice/authSlice";
import { getStoredUserRole, resolveAvatarUrl, USER_ROLES } from "../../../Utils/authRole";
import { toast } from "react-toastify";

const UserHeader = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, role, avatar } = useSelector((state) => state.auth);
  const history = useNavigate();
  const [profile, setProfile] = useState("");
  const [name, setName] = useState("Emay Walter");
  useEffect(() => {
    setProfile(resolveAvatarUrl(avatar || localStorage.getItem("profileURL"), man));
    setName(localStorage.getItem("Name") ? localStorage.getItem("Name") : name);
  }, [avatar, name]);

  const clearLocalSession = () => {
    history(`${process.env.PUBLIC_URL}/login`);
  };

  const Logout = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success("Logout successful");
    } catch (error) {
      toast.error(error?.message || "Logout request failed");
    } finally {
      clearLocalSession();
    }
  };

  const UserMenuRedirect = (redirect) => {
    history(redirect);
  };

  const activeRole = role || getStoredUserRole();
  const profileLabel = activeRole === USER_ROLES.EXPERT ? "Expert" : Admin;
  const avatarSrc = isAuthenticated ? resolveAvatarUrl(user?.avatar, profile || man) : profile;
  const displayName = isAuthenticated ? user?.name : name;
  const displayInitials = String(displayName || "U")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");

  return (
    <li className="profile-nav onhover-dropdown pe-0 py-0">
      <div className="media profile-media">
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            background: avatarSrc ? "#f1f3f9" : "#e9edf5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            color: "#7b8192",
            fontSize: "11px",
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          {avatarSrc ? (
            <Image
              attrImage={{
                className: "w-100 h-100",
                src: avatarSrc,
                alt: displayName || "Profile",
                style: { objectFit: "cover" },
              }}
            />
          ) : (
            displayInitials
          )}
        </div>
        <div className="media-body">
          <span>{displayName}</span>
          <P attrPara={{ className: "mb-0 font-roboto" }}>
            {profileLabel} <i className="middle fa fa-angle-down"></i>
          </P>
        </div>
      </div>
      <UL attrUL={{ className: "simple-list profile-dropdown onhover-show-div" }}>
        <LI
          attrLI={{
            onClick: () => UserMenuRedirect(`${process.env.PUBLIC_URL}/app/users/profile`),
          }}>
          <User />
          <span>{Account} </span>
        </LI>
        <LI
          attrLI={{
            onClick: () => UserMenuRedirect(`${process.env.PUBLIC_URL}/#`),
          }}>
          <Mail />
          <span>{Inbox}</span>
        </LI>
        <LI
          attrLI={{
            onClick: () => UserMenuRedirect(`${process.env.PUBLIC_URL}/#`),
          }}>
          <FileText />
          <span>{Taskboard}</span>
        </LI>
        <LI attrLI={{ onClick: Logout }}>
          <LogIn />
          <span>{LogOut}</span>
        </LI>
      </UL>
    </li>
  );
};

export default UserHeader;
