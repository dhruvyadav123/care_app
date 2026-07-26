import React, { useCallback, useEffect, useMemo, useState } from "react";
import SvgIcon from "../../../Components/Common/Component/SvgIcon";
import { Notification } from "../../../Constant";
import request from "../../../Services/request";
import { getUserDisplayName } from "../../../Utils/userDisplay";

const LAST_SEEN_KEY = "admin-notifications-last-seen";
const REFRESH_INTERVAL = 60000;

const getTimestamp = (...values) => {
  const value = values.find(Boolean);
  const timestamp = value ? new Date(value).getTime() : 0;
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const formatRelativeTime = (timestamp) => {
  if (!timestamp) return "Recently";

  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (elapsedSeconds < 60) return "Just now";

  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  if (elapsedMinutes < 60) return `${elapsedMinutes} min ago`;

  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `${elapsedHours} hr${elapsedHours === 1 ? "" : "s"} ago`;

  const elapsedDays = Math.floor(elapsedHours / 24);
  return `${elapsedDays} day${elapsedDays === 1 ? "" : "s"} ago`;
};

const getPatientLabel = (appointment) => {
  const patient = appointment?.patientId || appointment?.patient || appointment?.userId;
  if (typeof patient === "string") return patient;
  return patient?.name || patient?.fullName || patient?.patientId || patient?._id || "a patient";
};

const Notificationbar = () => {
  const [notificationDropDown, setNotificationDropDown] = useState(false);
  const [notificationItems, setNotificationItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastSeen, setLastSeen] = useState(() => Number(localStorage.getItem(LAST_SEEN_KEY)) || 0);

  const fetchNotifications = useCallback(async () => {
    setError("");

    const [usersResult, appointmentsResult] = await Promise.allSettled([
      request.get("/admin/getAllUsers", {
        params: { page: 1, limit: 5 },
        skipErrorToast: true,
      }),
      request.post("/assesment/alzheimer/doctors/getAppointments", undefined, {
        skipErrorToast: true,
      }),
    ]);

    const users = usersResult.status === "fulfilled" && Array.isArray(usersResult.value?.users)
      ? usersResult.value.users
      : [];
    const appointments = appointmentsResult.status === "fulfilled" && Array.isArray(appointmentsResult.value?.data)
      ? appointmentsResult.value.data
      : [];

    const userNotifications = users.map((user) => ({
      id: `user-${user?._id || user?.id}`,
      title: `New user registered: ${getUserDisplayName(user)}`,
      timestamp: getTimestamp(user?.createdAt, user?.updatedAt),
      color: "success",
    }));

    const appointmentNotifications = appointments.map((appointment) => ({
      id: `appointment-${appointment?._id || appointment?.id}`,
      title: `Appointment created for ${getPatientLabel(appointment)}`,
      timestamp: getTimestamp(appointment?.createdAt, appointment?.updatedAt),
      color: "info",
    }));

    setNotificationItems(
      [...userNotifications, ...appointmentNotifications]
        .sort((first, second) => second.timestamp - first.timestamp)
        .slice(0, 5)
    );

    if (usersResult.status === "rejected" && appointmentsResult.status === "rejected") {
      setError("Unable to load notifications");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNotifications();
    const intervalId = window.setInterval(fetchNotifications, REFRESH_INTERVAL);
    return () => window.clearInterval(intervalId);
  }, [fetchNotifications]);

  const unreadCount = useMemo(
    () => notificationItems.filter((item) => item.timestamp > lastSeen).length,
    [notificationItems, lastSeen]
  );

  const toggleNotifications = () => {
    const willOpen = !notificationDropDown;
    setNotificationDropDown(willOpen);

    if (willOpen) {
      const seenAt = Date.now();
      localStorage.setItem(LAST_SEEN_KEY, String(seenAt));
      setLastSeen(seenAt);
    }
  };

  return (
    <li className="onhover-dropdown">
      <div className="notification-box position-relative" onClick={toggleNotifications}>
        <div className="header-tool-btn">
          <SvgIcon iconId="notification" />
        </div>
        {unreadCount > 0 && (
          <span
            className="badge rounded-pill badge-danger"
            style={{
              position: "absolute",
              top: "-3px",
              right: "-1px",
              minWidth: "18px",
              height: "18px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
              padding: 0,
              border: "2px solid #fff",
            }}
          >
            {unreadCount}
          </span>
        )}
      </div>
      <div className={`notification-dropdown onhover-show-div ${notificationDropDown ? "active" : ""}`}>
        <h6 className="f-18 mb-0 dropdown-title">{Notification}</h6>
        <ul>
          {loading && <li><p className="mb-0">Loading notifications...</p></li>}
          {!loading && error && <li><p className="mb-0 text-danger">{error}</p></li>}
          {!loading && !error && notificationItems.length === 0 && (
            <li><p className="mb-0 text-muted">No recent notifications</p></li>
          )}
          {!loading && notificationItems.map((item) => (
            <li className={`b-l-${item.color} border-4`} key={item.id}>
              <p className="mb-0 d-flex flex-column">
                <span>{item.title}</span>
                <span className={`font-${item.color} mt-1`}>{formatRelativeTime(item.timestamp)}</span>
              </p>
            </li>
          ))}
          <li>
            <button className="btn btn-link f-w-700 p-0" type="button" onClick={fetchNotifications}>
              Refresh
            </button>
          </li>
        </ul>
      </div>
    </li>
  );
};

export default Notificationbar;