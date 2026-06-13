import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import { Breadcrumbs } from "../../AbstractElements";
import { BASE_URL } from "../../Config/AppConstant";
import { goLiveExpertEvent } from "../../Redux/stateSlice/expertEventReducer";

const ICE_CONFIG = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const getExpertId = (user) =>
  user?._id || user?.id || user?.expertId || user?.userId || localStorage.getItem("expertId") || "";

const getEventIdFromState = (eventData) =>
  eventData?._id || eventData?.id || eventData?.eventId || eventData?.sessionId || "";

const loadSocketClient = (serverUrl) =>
  new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && typeof window.io === "function") {
      resolve(window.io);
      return;
    }

    if (typeof document === "undefined") {
      reject(new Error("Socket client can only load in browser."));
      return;
    }

    const existingScript = document.querySelector("script[data-socket-io-client='true']");

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.io));
      existingScript.addEventListener("error", () => reject(new Error("Unable to load socket client.")));
      return;
    }

    const script = document.createElement("script");
    script.src = `${serverUrl.replace(/\/+$/, "")}/socket.io/socket.io.js`;
    script.async = true;
    script.dataset.socketIoClient = "true";
    script.onload = () => {
      if (typeof window.io === "function") {
        resolve(window.io);
        return;
      }

      reject(new Error("Socket client loaded, but io is unavailable."));
    };
    script.onerror = () => reject(new Error("Unable to load socket client."));
    document.body.appendChild(script);
  });

const shellStyles = {
  page: {
    minHeight: "100%",
    background: "#070707",
    color: "#f5f7fb",
    paddingBottom: "24px",
  },
  frame: {
    background: "#0d0d0d",
    border: "1px solid #1a1a1a",
    borderRadius: "18px",
    boxShadow: "0 16px 48px rgba(0, 0, 0, 0.35)",
  },
  panelTitle: {
    fontSize: "12px",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#6e7381",
    marginBottom: "14px",
    fontWeight: 700,
  },
  fieldLabel: {
    display: "block",
    fontSize: "12px",
    color: "#7a808f",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    height: "36px",
    borderRadius: "8px",
    border: "1px solid #242424",
    background: "#0a0a0a",
    color: "#ffffff",
    padding: "0 12px",
    outline: "none",
    fontSize: "14px",
  },
  statusPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "7px 12px",
    borderRadius: "999px",
    border: "1px solid #252525",
    background: "#0a0a0a",
    color: "#a6adbb",
    fontSize: "12px",
    textTransform: "lowercase",
  },
};

const actionButtonStyle = (variant) => {
  const variants = {
    neutral: {
      background: "#151515",
      border: "1px solid #2a2a2a",
      color: "#f7f8fb",
    },
    danger: {
      background: "#170909",
      border: "1px solid #762020",
      color: "#ff4d4f",
    },
  };

  return {
    width: "100%",
    height: "40px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    cursor: "pointer",
    ...variants[variant],
  };
};

const LOG_COLORS = {
  emit: "#4a9eff",
  receive: "#4ade80",
  error: "#ff6b6b",
  info: "#8f96a3",
};

const ExpertLive = () => {
  const dispatch = useDispatch();
  const { eventId: routeEventId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const logBoxRef = useRef(null);
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnsRef = useRef({});
  const latestSessionRef = useRef({ eventId: "", expertId: "", isLive: false });
  const endSignalSentRef = useRef(false);

  const authUser = useSelector((state) => state.auth?.user);
  const locationEvent = location.state?.eventData || null;

  const expertId = useMemo(() => getExpertId(authUser), [authUser]);
  const eventId = useMemo(
    () => routeEventId || getEventIdFromState(locationEvent),
    [locationEvent, routeEventId]
  );
  const serverUrl = useMemo(() => BASE_URL || window.location.origin, []);

  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [hasCameraPreview, setHasCameraPreview] = useState(false);
  const [isSubmittingLive, setIsSubmittingLive] = useState(false);
  const [socketId, setSocketId] = useState("");
  const [logs, setLogs] = useState([]);
  const [viewerCount, setViewerCount] = useState(0);
  const [peerState, setPeerState] = useState("");

  useEffect(() => {
    latestSessionRef.current = {
      eventId,
      expertId,
      isLive,
    };
  }, [eventId, expertId, isLive]);

  const addLog = useCallback((msg, type = "info") => {
    const time = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    setLogs((prev) => [...prev.slice(-99), { time, msg, type }]);
  }, []);

  useEffect(() => {
    if (logBoxRef.current) {
      logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight;
    }
  }, [logs]);

  const stopMediaTracks = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setHasCameraPreview(false);
  }, []);

  const closeAllPeerConnections = useCallback(() => {
    Object.values(peerConnsRef.current).forEach((peerConnection) => {
      try {
        peerConnection.close();
      } catch (peerError) {
        // Ignore cleanup errors.
      }
    });

    peerConnsRef.current = {};
    setPeerState("");
    setViewerCount(0);
  }, []);

  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.off();
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    setSocketId("");
    setIsConnected(false);
  }, []);

  const createPeerConnection = useCallback(
    (viewerSocketId) => {
      const peerConnection = new RTCPeerConnection(ICE_CONFIG);
      peerConnsRef.current[viewerSocketId] = peerConnection;

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          peerConnection.addTrack(track, localStreamRef.current);
        });
      }

      peerConnection.onicecandidate = ({ candidate }) => {
        if (candidate && socketRef.current?.connected) {
          addLog(`→ liveIceCandidate to ${viewerSocketId.slice(0, 8)}...`, "emit");
          socketRef.current.emit("liveIceCandidate", {
            candidate,
            sessionId: eventId,
            target: viewerSocketId,
          });
        }
      };

      peerConnection.onconnectionstatechange = () => {
        setPeerState(peerConnection.connectionState);
        addLog(
          `PeerConnection [${viewerSocketId.slice(0, 8)}]: ${peerConnection.connectionState}`,
          "info"
        );

        if (["failed", "closed", "disconnected"].includes(peerConnection.connectionState)) {
          delete peerConnsRef.current[viewerSocketId];
        }
      };

      return peerConnection;
    },
    [addLog, eventId]
  );

  const startCameraPreview = useCallback(async () => {
    if (!eventId) {
      setError("Session id is missing.");
      setStatus("failed");
      return false;
    }

    if (!expertId) {
      setError("Expert id is missing.");
      setStatus("failed");
      return false;
    }

    if (!navigator?.mediaDevices?.getUserMedia) {
      setError("Camera access is not supported in this browser.");
      setStatus("failed");
      return false;
    }

    try {
      setError("");
      setStatus("requesting-camera");

      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      stopMediaTracks();
      localStreamRef.current = localStream;

      if (videoRef.current) {
        videoRef.current.srcObject = localStream;
      }

      setHasCameraPreview(true);
      setStatus("camera-ready");
      addLog("Camera started", "info");

      Object.values(peerConnsRef.current).forEach((peerConnection) => {
        localStream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, localStream);
        });
      });

      return true;
    } catch (mediaError) {
      const permissionDenied =
        mediaError?.name === "NotAllowedError" || mediaError?.name === "PermissionDeniedError";

      const message = permissionDenied
        ? "Camera or microphone permission was denied."
        : mediaError?.message || "Unable to access camera and microphone.";

      setError(message);
      setStatus("failed");
      addLog(`Camera error: ${message}`, "error");
      return false;
    }
  }, [addLog, eventId, expertId, stopMediaTracks]);

  const handleNewViewer = useCallback(
    async ({ userId, viewerSocketId }) => {
      try {
        addLog(`← newViewer: userId=${userId || "unknown"}`, "receive");
        addLog(`  socketId=${viewerSocketId}`, "receive");

        const peerConnection = createPeerConnection(viewerSocketId);
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        addLog(`→ liveOffer to ${viewerSocketId.slice(0, 8)}...`, "emit");
        socketRef.current?.emit("liveOffer", {
          offer,
          sessionId: eventId,
          target: viewerSocketId,
        });
      } catch (viewerError) {
        addLog(viewerError?.message || "Failed to handle viewer join.", "error");
      }
    },
    [addLog, createPeerConnection, eventId]
  );

  const connectSocket = useCallback(async () => {
    if (!eventId) {
      setError("Session id is missing.");
      setStatus("failed");
      return false;
    }

    if (!expertId) {
      setError("Expert id is missing.");
      setStatus("failed");
      return false;
    }

    try {
      setError("");
      setStatus("connecting-socket");

      if (socketRef.current?.connected) {
        setIsConnected(true);
        setStatus("connected");
        return true;
      }

      disconnectSocket();

      const ioFactory = await loadSocketClient(serverUrl);
      const socket = ioFactory(serverUrl, { transports: ["websocket"] });
      socketRef.current = socket;

      socket.on("connect", () => {
        addLog(`Connected: ${socket.id}`, "info");
        setIsConnected(true);
        setSocketId(socket.id);
        setStatus((prev) => (prev === "live" ? prev : "connected"));
      });

      socket.on("disconnect", () => {
        addLog("Disconnected", "error");
        setIsConnected(false);
        setIsLive(false);
        setSocketId("");
        setStatus("idle");
      });

      socket.on("connect_error", (socketError) => {
        const message = socketError?.message || "Socket connection failed.";
        setError(message);
        setStatus("failed");
        addLog(`Socket error: ${message}`, "error");
      });

      socket.on("newViewer", handleNewViewer);

      socket.on("liveAnswer", async ({ answer, sender }) => {
        try {
          addLog(`← liveAnswer from ${(sender || "").slice(0, 8)}...`, "receive");
          const peerConnection = peerConnsRef.current[sender];
          if (peerConnection && answer) {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
          }
        } catch (answerError) {
          addLog(answerError?.message || "Failed to process live answer.", "error");
        }
      });

      socket.on("liveIceCandidate", async ({ candidate, sender }) => {
        try {
          addLog(`← liveIceCandidate from ${(sender || "").slice(0, 8)}...`, "receive");
          const peerConnection = peerConnsRef.current[sender];
          if (peerConnection && candidate) {
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
          }
        } catch (iceError) {
          addLog(iceError?.message || "Failed to process ICE candidate.", "error");
        }
      });

      socket.on("viewerCount", ({ count }) => {
        setViewerCount(Number(count) || 0);
      });

      socket.on("viewerLeft", ({ userId }) => {
        addLog(`← viewerLeft: ${userId || "unknown"}`, "receive");
      });

      socket.on("liveSessionStarted", ({ sessionId: liveSessionId }) => {
        addLog(`← liveSessionStarted: ${liveSessionId}`, "receive");
        endSignalSentRef.current = false;
        setIsLive(true);
        setStatus("live");
      });

      return true;
    } catch (socketError) {
      const message = socketError?.message || "Unable to connect live socket.";
      setError(message);
      setStatus("failed");
      addLog(message, "error");
      return false;
    }
  }, [addLog, disconnectSocket, eventId, expertId, handleNewViewer, serverUrl]);

  const handleGoLive = useCallback(async () => {
    if (!eventId) {
      setError("Session id is missing.");
      setStatus("failed");
      return;
    }

    if (!expertId) {
      setError("Expert id is missing.");
      setStatus("failed");
      return;
    }

    try {
      setIsSubmittingLive(true);
      setError("");
      endSignalSentRef.current = false;

      const socketReady = isConnected ? true : await connectSocket();
      if (!socketReady) {
        throw new Error("Socket connection is not ready.");
      }

      const cameraReady = hasCameraPreview ? true : await startCameraPreview();
      if (!cameraReady) {
        throw new Error("Camera is not ready.");
      }

      setStatus("connecting-live");

      await dispatch(
        goLiveExpertEvent({
          _id: eventId,
          sessionId: eventId,
          title: locationEvent?.title || "Live Session",
        })
      ).unwrap();

      if (socketRef.current?.connected) {
        socketRef.current.emit("expertGoLive", { expertId, sessionId: eventId });
        addLog(`→ expertGoLive: ${expertId} / ${eventId}`, "emit");
      }

      setIsLive(true);
      setStatus("live");
    } catch (goLiveError) {
      const message = goLiveError?.message || goLiveError?.msg || "Unable to start live session.";
      setError(message);
      setStatus("failed");
      addLog(message, "error");
    } finally {
      setIsSubmittingLive(false);
    }
  }, [
    addLog,
    connectSocket,
    dispatch,
    eventId,
    expertId,
    hasCameraPreview,
    isConnected,
    locationEvent?.title,
    startCameraPreview,
  ]);

  const handleEndSession = useCallback(() => {
    if (!endSignalSentRef.current && socketRef.current?.connected && eventId && expertId) {
      socketRef.current.emit("endLiveSession", { sessionId: eventId, expertId });
      addLog(`→ endLiveSession: ${eventId}`, "emit");
      endSignalSentRef.current = true;
    }

    closeAllPeerConnections();
    stopMediaTracks();
    setIsLive(false);
    setStatus(isConnected ? "connected" : "idle");
  }, [addLog, closeAllPeerConnections, eventId, expertId, isConnected, stopMediaTracks]);

  useEffect(() => {
    return () => {
      const { eventId: latestEventId, expertId: latestExpertId, isLive: latestIsLive } =
        latestSessionRef.current;

      if (
        latestIsLive &&
        !endSignalSentRef.current &&
        socketRef.current?.connected &&
        latestEventId &&
        latestExpertId
      ) {
        socketRef.current.emit("endLiveSession", {
          sessionId: latestEventId,
          expertId: latestExpertId,
        });
        endSignalSentRef.current = true;
      }

      disconnectSocket();
      stopMediaTracks();
      closeAllPeerConnections();
    };
  }, [closeAllPeerConnections, disconnectSocket, stopMediaTracks]);

  const statusTextMap = {
    idle: "Ready to start live session.",
    "requesting-camera": "Requesting camera and microphone access...",
    "camera-ready": "Camera and microphone connected.",
    "connecting-socket": "Connecting to live server...",
    connected: "Socket connected.",
    "connecting-live": "Starting live session...",
    live: "Expert is live.",
    failed: "Unable to start live session.",
  };

  return (
    <Fragment>
      <Breadcrumbs parent="Events" title="Expert Live" mainTitle="Expert Live" />
      <div style={shellStyles.page}>
        <Container fluid>
          <Row className="g-4">
            <Col xl="8">
              <div style={shellStyles.frame}>
                <div style={{ padding: "18px 20px 0 20px" }}>
                  <div
                    className="d-flex flex-wrap align-items-center justify-content-between gap-3"
                    style={{ marginBottom: "18px" }}
                  >
                    <div>
                      <div style={{ color: "#ffffff", fontSize: "22px", fontWeight: 700 }}>
                        {locationEvent?.title || "Expert Panel Live Session"}
                      </div>
                      <div style={{ color: "#707785", marginTop: "4px", fontSize: "13px" }}>
                        {statusTextMap[status] || "Ready to start live session."}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      style={{
                        ...actionButtonStyle("neutral"),
                        width: "120px",
                      }}
                    >
                      Back
                    </button>
                  </div>
                </div>

                <div style={{ padding: "0 20px 20px 20px" }}>
                  <div
                    style={{
                      minHeight: "340px",
                      borderRadius: "16px",
                      border: "1px solid #1c1c1c",
                      background: "#111111",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    {hasCameraPreview ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        style={{
                          width: "100%",
                          height: "100%",
                          minHeight: "340px",
                          objectFit: "cover",
                          background: "#000000",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#5b6270",
                          gap: "12px",
                        }}
                      >
                        <i className="fa fa-camera" style={{ fontSize: "40px", color: "#8b93a4" }} />
                        <div style={{ fontSize: "18px", color: "#7b8190" }}>No camera</div>
                      </div>
                    )}

                    {isLive ? (
                      <div
                        style={{
                          position: "absolute",
                          top: "16px",
                          left: "16px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "6px 12px",
                          borderRadius: "999px",
                          background: "rgba(12, 12, 12, 0.78)",
                          border: "1px solid #7b1f1f",
                          color: "#ff5757",
                          fontSize: "11px",
                          fontWeight: 700,
                          letterSpacing: "0.16em",
                          textTransform: "uppercase",
                        }}
                      >
                        <span
                          style={{
                            width: "7px",
                            height: "7px",
                            borderRadius: "50%",
                            background: "#ff3b30",
                          }}
                        />
                        Live
                      </div>
                    ) : null}

                    <div
                      style={{
                        position: "absolute",
                        top: "16px",
                        right: "16px",
                        padding: "6px 12px",
                        borderRadius: "999px",
                        background: "rgba(12, 12, 12, 0.78)",
                        border: "1px solid #262626",
                        color: "#d9dde8",
                        fontSize: "11px",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {viewerCount} watching
                    </div>
                  </div>

                  <div
                    style={{
                      ...shellStyles.frame,
                      marginTop: "16px",
                      background: "#101010",
                    }}
                  >
                    <div style={{ padding: "20px" }}>
                      <div style={shellStyles.panelTitle}>Session Config</div>

                      <div style={{ marginBottom: "14px" }}>
                        <label style={shellStyles.fieldLabel}>Server URL</label>
                        <input value={serverUrl} readOnly style={shellStyles.input} />
                      </div>

                      <Row className="g-3">
                        <Col md="6">
                          <label style={shellStyles.fieldLabel}>Expert ID</label>
                          <input value={expertId || ""} readOnly style={shellStyles.input} />
                        </Col>
                        <Col md="6">
                          <label style={shellStyles.fieldLabel}>Session ID</label>
                          <input value={eventId || ""} readOnly style={shellStyles.input} />
                        </Col>
                      </Row>

                      <Row className="g-3" style={{ marginTop: "2px" }}>
                        <Col md="4">
                          <button type="button" onClick={connectSocket} style={actionButtonStyle("neutral")}>
                            {isConnected ? "Reconnect" : "Connect"}
                          </button>
                        </Col>
                        <Col md="4">
                          <button type="button" onClick={startCameraPreview} style={actionButtonStyle("neutral")}>
                            Camera
                          </button>
                        </Col>
                        <Col md="4">
                          <button
                            type="button"
                            onClick={isLive ? handleEndSession : handleGoLive}
                            style={actionButtonStyle("danger")}
                          >
                            {isSubmittingLive ? "Starting..." : isLive ? "End Session" : "Go Live"}
                          </button>
                        </Col>
                      </Row>

                      {error ? (
                        <div style={{ color: "#ff6b6b", fontSize: "13px", marginTop: "14px" }}>{error}</div>
                      ) : null}
                    </div>
                  </div>

                  <div className="d-flex flex-wrap gap-2" style={{ marginTop: "14px" }}>
                    <div style={shellStyles.statusPill}>
                      <span
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: isConnected ? "#2ecc71" : "#586072",
                        }}
                      />
                      {isConnected ? "connected" : "disconnected"}
                    </div>
                    <div style={shellStyles.statusPill}>
                      <span
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: isLive ? "#ff4d4f" : "#586072",
                        }}
                      />
                      {isLive ? "live" : "offline"}
                    </div>
                    <div style={shellStyles.statusPill}>
                      <span
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: hasCameraPreview ? "#2ecc71" : "#586072",
                        }}
                      />
                      {hasCameraPreview ? "camera ready" : "no camera"}
                    </div>
                    {socketId ? <div style={shellStyles.statusPill}>socket: {socketId.slice(0, 8)}...</div> : null}
                    {peerState ? <div style={shellStyles.statusPill}>rtc: {peerState}</div> : null}
                    {isLive ? <div style={shellStyles.statusPill}>viewers: {viewerCount}</div> : null}
                  </div>
                </div>
              </div>
            </Col>

            <Col xl="4">
              <div
                style={{
                  ...shellStyles.frame,
                  minHeight: "100%",
                  background: "#090909",
                  padding: "20px",
                }}
              >
                <div style={shellStyles.panelTitle}>Socket Log</div>
                <div
                  ref={logBoxRef}
                  style={{
                    minHeight: "640px",
                    maxHeight: "640px",
                    overflowY: "auto",
                    borderRadius: "14px",
                    border: "1px solid #171717",
                    background: "#0b0b0b",
                    padding: "14px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  {logs.length === 0 ? (
                    <div style={{ color: "#4f5663", fontSize: "12px" }}>No events yet...</div>
                  ) : null}
                  {logs.map((entry, index) => (
                    <div
                      key={`${entry.time}-${index}`}
                      style={{
                        fontSize: "11px",
                        lineHeight: 1.6,
                        color: LOG_COLORS[entry.type] || LOG_COLORS.info,
                        borderBottom: "1px solid #111111",
                        paddingBottom: "4px",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      <span style={{ color: "#525866", marginRight: "8px" }}>{entry.time}</span>
                      {entry.msg}
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </Fragment>
  );
};

export default ExpertLive;
