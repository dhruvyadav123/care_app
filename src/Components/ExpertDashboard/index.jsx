import React, { Fragment, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Badge, Card, CardBody, Col, Container, Progress, Row, Table } from "reactstrap";
import {
  Activity,
  ArrowUpRight,
  Calendar,
  CheckCircle,
  Clock,
  PlayCircle,
  Users,
} from "react-feather";
import { Breadcrumbs, H5, Spinner } from "../../AbstractElements";
import { fetchExpertEvents } from "../../Redux/stateSlice/expertEventReducer";

const surfaceStyles = {
  shell: {
    minHeight: "100%",
    background: "linear-gradient(180deg, #f5f7fb 0%, #eef2f7 100%)",
  },
  card: {
    border: "1px solid #e7ecf3",
    borderRadius: "22px",
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.06)",
    background: "#ffffff",
  },
};

const metricToneMap = {
  primary: {
    accent: "#2152ff",
    iconBg: "rgba(33, 82, 255, 0.12)",
    panelBg: "linear-gradient(180deg, #ffffff 0%, #f5f8ff 100%)",
  },
  success: {
    accent: "#0a9b57",
    iconBg: "rgba(10, 155, 87, 0.12)",
    panelBg: "linear-gradient(180deg, #ffffff 0%, #f2fcf7 100%)",
  },
  warning: {
    accent: "#d97706",
    iconBg: "rgba(217, 119, 6, 0.12)",
    panelBg: "linear-gradient(180deg, #ffffff 0%, #fff8ef 100%)",
  },
  info: {
    accent: "#0891b2",
    iconBg: "rgba(8, 145, 178, 0.12)",
    panelBg: "linear-gradient(180deg, #ffffff 0%, #f0fbff 100%)",
  },
};

const formatDateTime = (value) => {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDateShort = (value) => {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusColor = (status) => {
  const normalized = String(status || "").toLowerCase();

  if (normalized === "scheduled") return "primary";
  if (normalized === "completed") return "success";
  if (normalized === "cancelled") return "danger";
  if (normalized === "live") return "success";
  return "secondary";
};

const getInitials = (name) =>
  String(name || "Expert")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const MetricCard = ({ title, value, subtitle, tone = "primary", icon: Icon }) => {
  const toneStyles = metricToneMap[tone] || metricToneMap.primary;

  return (
    <Card
      className="h-100 border-0"
      style={{
        ...surfaceStyles.card,
        background: toneStyles.panelBg,
      }}
    >
      <CardBody className="p-4">
        <div className="d-flex align-items-start justify-content-between gap-3">
          <div>
            <div
              style={{
                color: "#667085",
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "10px",
              }}
            >
              {title}
            </div>
            <div style={{ fontSize: "42px", lineHeight: 1, fontWeight: 800, color: "#101828" }}>{value}</div>
            <div style={{ color: "#667085", fontSize: "14px", marginTop: "10px" }}>{subtitle}</div>
          </div>
          <div
            style={{
              width: "54px",
              height: "54px",
              borderRadius: "16px",
              background: toneStyles.iconBg,
              color: toneStyles.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon size={20} />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

const ExpertDashboard = () => {
  const dispatch = useDispatch();
  const { events, count, loading, error } = useSelector((state) => state.expertEvents);
  const authUser = useSelector((state) => state.auth?.user);

  useEffect(() => {
    dispatch(fetchExpertEvents());
  }, [dispatch]);

  const dashboardData = useMemo(() => {
    const now = new Date();
    const safeEvents = Array.isArray(events) ? events : [];
    const upcomingEvents = safeEvents
      .filter((event) => {
        const eventStart = new Date(event?.startTime);
        return !Number.isNaN(eventStart.getTime()) && eventStart >= now;
      })
      .sort((a, b) => new Date(a?.startTime) - new Date(b?.startTime));

    const todayEvents = safeEvents.filter((event) => {
      const eventStart = new Date(event?.startTime);
      return (
        !Number.isNaN(eventStart.getTime()) &&
        eventStart.getDate() === now.getDate() &&
        eventStart.getMonth() === now.getMonth() &&
        eventStart.getFullYear() === now.getFullYear()
      );
    });

    const totalParticipantsCapacity = safeEvents.reduce(
      (sum, event) => sum + Number(event?.maxParticipants || 0),
      0
    );

    const statusCounts = safeEvents.reduce(
      (accumulator, event) => {
        const normalizedStatus = String(event?.status || "unknown").toLowerCase();
        accumulator[normalizedStatus] = (accumulator[normalizedStatus] || 0) + 1;
        return accumulator;
      },
      { scheduled: 0, completed: 0, cancelled: 0, unknown: 0 }
    );

    const categoryCounts = safeEvents.reduce((accumulator, event) => {
      const category = String(event?.category || "Other");
      accumulator[category] = (accumulator[category] || 0) + 1;
      return accumulator;
    }, {});

    const categoryBreakdown = Object.entries(categoryCounts)
      .map(([category, total]) => ({
        category,
        total,
        percentage: safeEvents.length ? Math.round((total / safeEvents.length) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total);

    const nextEvent = upcomingEvents[0] || null;
    const recentEvents = [...safeEvents]
      .sort((a, b) => new Date(b?.createdAt || b?.startTime) - new Date(a?.createdAt || a?.startTime))
      .slice(0, 5);

    return {
      totalEvents: count || safeEvents.length,
      liveEvents: safeEvents.filter((event) => Boolean(event?.isLive)).length,
      todayEvents: todayEvents.length,
      totalParticipantsCapacity,
      upcomingEvents,
      nextEvent,
      statusCounts,
      categoryBreakdown,
      recentEvents,
    };
  }, [count, events]);

  const profileName = authUser?.name || localStorage.getItem("Name") || "Expert";
  const profileEmail = authUser?.email || "expert@workspace.com";
  const profileRole = authUser?.role || localStorage.getItem("userRole") || "expert";

  if (loading) {
    return (
      <Col className="vh-100 d-flex align-items-center justify-content-center">
        <div className="loader-box">
          <Spinner attrSpinner={{ className: "loader-5" }} />
        </div>
      </Col>
    );
  }

  return (
    <Fragment>
      <Breadcrumbs parent="Dashboard" title="Expert Dashboard" mainTitle="Expert Dashboard" />
      <div style={surfaceStyles.shell}>
        <Container fluid>
          <Row className="g-4">
            <Col xl="8">
              <Card
                className="border-0 overflow-hidden"
                style={{
                  ...surfaceStyles.card,
                  background: "linear-gradient(135deg, #0f172a 0%, #132238 45%, #173b4f 100%)",
                }}
              >
                <CardBody className="p-4 p-xl-5">
                  <Row className="g-4 align-items-center">
                    <Col lg="8">
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "8px 14px",
                          borderRadius: "999px",
                          background: "rgba(255,255,255,0.1)",
                          color: "#d7e3f4",
                          fontSize: "12px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          marginBottom: "20px",
                        }}
                      >
                        Expert Operations Overview
                      </div>
                      <h1
                        style={{
                          color: "#ffffff",
                          fontSize: "42px",
                          fontWeight: 800,
                          lineHeight: 1.1,
                          marginBottom: "12px",
                        }}
                      >
                        Welcome back, {profileName}
                      </h1>
                      <p
                        style={{
                          color: "rgba(255,255,255,0.72)",
                          fontSize: "16px",
                          lineHeight: 1.75,
                          maxWidth: "620px",
                          marginBottom: "24px",
                        }}
                      >
                        Monitor upcoming sessions, live activity, participant capacity, and recent event
                        performance from one clean dashboard.
                      </p>
                      <div className="d-flex flex-wrap gap-2">
                        <Badge color="light" pill className="px-3 py-2 text-dark">
                          {profileEmail}
                        </Badge>
                        <Badge color="info" pill className="px-3 py-2 text-capitalize">
                          {profileRole}
                        </Badge>
                        <Badge color="primary" pill className="px-3 py-2">
                          {dashboardData.upcomingEvents.length} upcoming
                        </Badge>
                      </div>
                    </Col>
                    <Col lg="4">
                      <div className="d-flex justify-content-lg-end">
                        <div
                          style={{
                            width: "132px",
                            height: "132px",
                            borderRadius: "32px",
                            background: "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 100%)",
                            border: "1px solid rgba(255,255,255,0.14)",
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "40px",
                            fontWeight: 800,
                            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.14)",
                          }}
                        >
                          {getInitials(profileName)}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>

            <Col xl="4">
              <Card className="border-0 h-100" style={surfaceStyles.card}>
                <CardBody className="p-4">
                  <div className="d-flex align-items-start justify-content-between mb-4">
                    <div>
                      <div
                        style={{
                          color: "#344054",
                          fontSize: "28px",
                          fontWeight: 800,
                          lineHeight: 1.2,
                        }}
                      >
                        Next upcoming event
                      </div>
                      <div style={{ color: "#667085", fontSize: "14px", marginTop: "6px" }}>
                        Your closest scheduled session at a glance
                      </div>
                    </div>
                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "14px",
                        background: "#f1f5f9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#2152ff",
                      }}
                    >
                      <Calendar size={18} />
                    </div>
                  </div>

                  {dashboardData.nextEvent ? (
                    <div>
                      <div style={{ fontSize: "30px", fontWeight: 800, color: "#101828", marginBottom: "8px" }}>
                        {dashboardData.nextEvent.title || "Untitled event"}
                      </div>
                      <div style={{ color: "#667085", fontSize: "15px", lineHeight: 1.7, marginBottom: "18px" }}>
                        {dashboardData.nextEvent.description || "No event description available."}
                      </div>
                      <div className="d-flex flex-wrap gap-2 mb-4">
                        <Badge color="light" pill className="px-3 py-2 text-dark">
                          {dashboardData.nextEvent.category || "Other"}
                        </Badge>
                        <Badge color={getStatusColor(dashboardData.nextEvent.status)} pill className="px-3 py-2">
                          {dashboardData.nextEvent.status || "Unknown"}
                        </Badge>
                      </div>

                      <div
                        style={{
                          border: "1px solid #e7ecf3",
                          borderRadius: "18px",
                          padding: "18px",
                          background: "linear-gradient(180deg, #fcfdff 0%, #f7f9fc 100%)",
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                          <div>
                            <div style={{ color: "#667085", fontSize: "12px", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.08em" }}>
                              Schedule
                            </div>
                            <div style={{ color: "#101828", fontWeight: 700, fontSize: "20px", marginTop: "4px" }}>
                              {formatDateTime(dashboardData.nextEvent.startTime)}
                            </div>
                          </div>
                          <ArrowUpRight size={18} color="#98a2b3" />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                          <div>
                            <div style={{ color: "#667085", fontSize: "12px", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.08em" }}>
                              Duration
                            </div>
                            <div style={{ color: "#101828", fontWeight: 700, fontSize: "18px", marginTop: "4px" }}>
                              {dashboardData.nextEvent.duration || 0} min
                            </div>
                          </div>
                          <div>
                            <div style={{ color: "#667085", fontSize: "12px", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.08em" }}>
                              Capacity
                            </div>
                            <div style={{ color: "#101828", fontWeight: 700, fontSize: "18px", marginTop: "4px" }}>
                              {dashboardData.nextEvent.maxParticipants || 0}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: "#667085" }}>No upcoming events are currently scheduled.</div>
                  )}
                </CardBody>
              </Card>
            </Col>

            <Col md="6" xl="3">
              <MetricCard
                title="Total Events"
                value={dashboardData.totalEvents}
                subtitle="All events assigned to this expert account"
                tone="primary"
                icon={Calendar}
              />
            </Col>
            <Col md="6" xl="3">
              <MetricCard
                title="Live Events"
                value={dashboardData.liveEvents}
                subtitle="Sessions currently marked as live"
                tone="success"
                icon={PlayCircle}
              />
            </Col>
            <Col md="6" xl="3">
              <MetricCard
                title="Today's Events"
                value={dashboardData.todayEvents}
                subtitle="Events scheduled to start today"
                tone="warning"
                icon={Clock}
              />
            </Col>
            <Col md="6" xl="3">
              <MetricCard
                title="Participant Capacity"
                value={dashboardData.totalParticipantsCapacity}
                subtitle="Combined maximum participant allocation"
                tone="info"
                icon={Users}
              />
            </Col>

            <Col lg="5">
              <Card className="border-0 h-100" style={surfaceStyles.card}>
                <CardBody className="p-4">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <H5 attrH4={{ className: "mb-0 text-dark" }}>Operational Status</H5>
                    <Activity size={18} className="text-primary" />
                  </div>

                  <div className="d-grid gap-3">
                    <div className="rounded-4 border p-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <span style={{ color: "#667085", fontWeight: 600 }}>Scheduled</span>
                        <span style={{ color: "#2152ff", fontWeight: 800, fontSize: "28px" }}>
                          {dashboardData.statusCounts.scheduled || 0}
                        </span>
                      </div>
                    </div>
                    <div className="rounded-4 border p-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <span style={{ color: "#667085", fontWeight: 600 }}>Completed</span>
                        <span style={{ color: "#0a9b57", fontWeight: 800, fontSize: "28px" }}>
                          {dashboardData.statusCounts.completed || 0}
                        </span>
                      </div>
                    </div>
                    <div className="rounded-4 border p-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <span style={{ color: "#667085", fontWeight: 600 }}>Cancelled</span>
                        <span style={{ color: "#d92d20", fontWeight: 800, fontSize: "28px" }}>
                          {dashboardData.statusCounts.cancelled || 0}
                        </span>
                      </div>
                    </div>
                    <div className="rounded-4 border p-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <span style={{ color: "#667085", fontWeight: 600 }}>Upcoming Queue</span>
                        <span style={{ color: "#101828", fontWeight: 800, fontSize: "28px" }}>
                          {dashboardData.upcomingEvents.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col lg="7">
              <Card className="border-0 h-100" style={surfaceStyles.card}>
                <CardBody className="p-4">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <H5 attrH4={{ className: "mb-0 text-dark" }}>Category Distribution</H5>
                    <CheckCircle size={18} className="text-success" />
                  </div>
                  {dashboardData.categoryBreakdown.length ? (
                    dashboardData.categoryBreakdown.map((item) => (
                      <div key={item.category} className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div style={{ color: "#101828", fontWeight: 700 }}>{item.category}</div>
                          <div style={{ color: "#667085", fontSize: "13px", fontWeight: 600 }}>
                            {item.total} events | {item.percentage}%
                          </div>
                        </div>
                        <Progress value={item.percentage} color="primary" style={{ height: "10px", borderRadius: "999px" }} />
                      </div>
                    ))
                  ) : (
                    <div style={{ color: "#667085" }}>No category data is available yet.</div>
                  )}
                </CardBody>
              </Card>
            </Col>

            <Col xl="12">
              <Card className="border-0" style={surfaceStyles.card}>
                <CardBody className="p-4">
                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
                    <div>
                      <H5 attrH4={{ className: "mb-1 text-dark" }}>Recent Events</H5>
                      <div style={{ color: "#667085", fontSize: "14px" }}>
                        A quick snapshot of the latest event records
                      </div>
                    </div>
                    {error ? <small className="text-danger">{String(error?.msg || error?.message || error)}</small> : null}
                  </div>

                  <div className="table-responsive">
                    <Table borderless hover className="align-middle mb-0">
                      <thead>
                        <tr>
                          <th style={{ color: "#667085", fontWeight: 700 }}>Title</th>
                          <th style={{ color: "#667085", fontWeight: 700 }}>Category</th>
                          <th style={{ color: "#667085", fontWeight: 700 }}>Start Date</th>
                          <th style={{ color: "#667085", fontWeight: 700 }}>Participants</th>
                          <th style={{ color: "#667085", fontWeight: 700 }}>Live</th>
                          <th style={{ color: "#667085", fontWeight: 700 }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData.recentEvents.length ? (
                          dashboardData.recentEvents.map((event) => (
                            <tr key={event._id}>
                              <td style={{ minWidth: "240px" }}>
                                <div style={{ color: "#101828", fontWeight: 700 }}>
                                  {event.title || "Untitled event"}
                                </div>
                                <div style={{ color: "#667085", fontSize: "13px", marginTop: "4px" }}>
                                  {event.description || "No description"}
                                </div>
                              </td>
                              <td>{event.category || "Other"}</td>
                              <td>{formatDateShort(event.startTime)}</td>
                              <td>{event.maxParticipants || 0}</td>
                              <td>
                                <Badge color={event.isLive ? "success" : "light"} pill className="px-3 py-2">
                                  {event.isLive ? "Live" : "Offline"}
                                </Badge>
                              </td>
                              <td>
                                <Badge color={getStatusColor(event.status)} pill className="px-3 py-2">
                                  {event.status || "Unknown"}
                                </Badge>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center text-muted py-4">
                              No expert events found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </Fragment>
  );
};

export default ExpertDashboard;
