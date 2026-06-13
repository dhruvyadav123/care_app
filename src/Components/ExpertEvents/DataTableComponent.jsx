import React, { Fragment, useEffect, useMemo, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Badge, Col, Input, InputGroup, InputGroupText } from "reactstrap";
import { Btn, H5, Spinner } from "../../AbstractElements";
import { API_URL, BASE_URL } from "../../Config/AppConstant";
import {
  createExpertEvent,
  deleteExpertEvent,
  fetchExpertEvents,
  goLiveExpertEvent,
  updateExpertEvent,
} from "../../Redux/stateSlice/expertEventReducer";
import { toast } from "react-toastify";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";
import AddModal from "./AddModal";

const formatDateTime = (value) => {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatEventDate = (value) => {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleDateString("en-GB");
};

const formatEventTime = (value) => {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const formatDuration = (value) => {
  if (!value && value !== 0) {
    return "N/A";
  }

  return `${value} min`;
};

const readFormDataValue = (formData, key) => {
  if (typeof FormData !== "undefined" && formData instanceof FormData) {
    const value = formData.get(key);
    return typeof value === "string" ? value : "";
  }

  return typeof formData?.[key] === "string" ? formData[key] : "";
};

const getStatusColor = (status) => {
  const normalized = String(status || "").toLowerCase();

  if (normalized === "live") return "success";
  if (normalized === "scheduled") return "primary";
  if (normalized === "completed") return "success";
  if (normalized === "cancelled") return "danger";
  return "secondary";
};

const resolveImageUrl = (imagePath) => {
  if (!imagePath) {
    return "";
  }

  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  const normalizedPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${BASE_URL}${normalizedPath}`;
};

const getEventImageCandidates = (row) => {
  const rawValues = [
    row?.coverImage?.url,
    row?.coverImage?.path,
    row?.coverImage?.secure_url,
    row?.coverImage?.location,
    row?.coverImage,
    row?.thumbnail?.url,
    row?.thumbnail?.path,
    row?.thumbnail,
    row?.image?.url,
    row?.image?.path,
    row?.image,
    row?.imageUrl,
    row?.attachment,
  ]
    .filter((value) => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean);

  const candidates = rawValues.flatMap((rawValue) => {
    const normalizedValue = rawValue.replace(/^\/+/, "");

    return [
      rawValue,
      resolveImageUrl(rawValue),
      `${BASE_URL}/${normalizedValue}`,
      `${BASE_URL}/uploads/${normalizedValue}`,
      `${API_URL}/${normalizedValue}`,
      `${API_URL}/uploads/${normalizedValue}`,
    ];
  });

  return [...new Set(candidates.filter(Boolean))];
};

const getGoLiveLink = (row) =>
  row?.goLiveLink ||
  row?.liveLink ||
  row?.joinLink ||
  row?.meetingLink ||
  row?.streamLink ||
  row?.url ||
  "";

const isEventLive = (row) => Boolean(row?.isLive) || String(row?.status || "").toLowerCase() === "live";

const getEventStatusLabel = (row) => (isEventLive(row) ? "Live" : row?.status || "Unknown");

const EventCover = ({ row }) => {
  const candidates = useMemo(() => getEventImageCandidates(row), [row]);
  const [imageSrc, setImageSrc] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isFailed, setIsFailed] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let objectUrl = "";

    const loadImage = async () => {
      setImageSrc("");
      setIsLoading(true);
      setIsFailed(false);

      if (!candidates.length) {
        if (isMounted) {
          setIsLoading(false);
          setIsFailed(true);
        }
        return;
      }

      const token = localStorage.getItem("token");

      for (const candidate of candidates) {
        try {
          const response = await axios.get(candidate, {
            responseType: "blob",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });

          if (response?.data && isMounted) {
            objectUrl = URL.createObjectURL(response.data);
            setImageSrc(objectUrl);
            setIsLoading(false);
            setIsFailed(false);
            return;
          }
        } catch (error) {
          // Try next candidate silently.
        }
      }

      if (isMounted) {
        setIsLoading(false);
        setIsFailed(true);
      }
    };

    loadImage();

    return () => {
      isMounted = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [candidates, row]);

  if (isLoading) {
    return (
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "12px",
          background: "#f4f6fb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#8b93a7",
          fontSize: "11px",
          fontWeight: 600,
        }}
      >
        ...
      </div>
    );
  }

  if (!imageSrc || isFailed) {
    return (
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "12px",
          background: "linear-gradient(135deg, #f7f9fc 0%, #eef2f9 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#7f8aa3",
          border: "1px solid #e6ebf5",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.65)",
          gap: "2px",
        }}
      >
        <i className="fa fa-image" style={{ fontSize: "14px", opacity: 0.8 }}></i>
        <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.02em" }}>No Image</span>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={row?.title || "Event"}
      style={{ width: "56px", height: "56px", borderRadius: "12px", objectFit: "cover" }}
    />
  );
};

const tableStyles = {
  rows: {
    style: {
      minHeight: "76px",
    },
  },
  headCells: {
    style: {
      fontSize: "13px",
      fontWeight: 700,
      whiteSpace: "nowrap",
    },
  },
  cells: {
    style: {
      fontSize: "13px",
      whiteSpace: "normal",
      lineHeight: 1.45,
      paddingTop: "12px",
      paddingBottom: "12px",
    },
  },
};

const DataTableComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [goLiveEventId, setGoLiveEventId] = useState("");
  const { events, count, loading, actionLoading, error } = useSelector((state) => state.expertEvents);

  useEffect(() => {
    dispatch(fetchExpertEvents());
  }, [dispatch]);

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return events;
    }

    return events.filter((event) =>
      [event?.title, event?.description, event?.category, event?.status]
        .some((value) => String(value || "").toLowerCase().includes(query))
    );
  }, [events, search]);

  useEffect(() => {
    console.info("[Expert My Events Page] Response summary", {
      endpoint: "/api/admin/expert/my-events",
      count: Array.isArray(events) ? events.length : 0,
      firstTitle: Array.isArray(events) && events.length ? events[0]?.title || null : null,
    });
  }, [events]);

  const handleGoLive = async (row) => {
    const alreadyLive = isEventLive(row);
    const sessionId = row?._id || row?.id || row?.eventId || row?.sessionId;

    setGoLiveEventId(row?._id || "");

    try {
      if (!sessionId) {
        throw new Error("Session id is missing.");
      }

      const result = await dispatch(goLiveExpertEvent(row)).unwrap();

      if (alreadyLive) {
        toast.success("Expert session is already live. Opening live session...");
      } else if (result?.localOnly) {
        toast.success("Event marked live. Opening live session...");
      } else {
        toast.success("Event is now live. Opening live session...");
      }

      navigate(`${process.env.PUBLIC_URL}/expert/live/${sessionId}`);
      dispatch(fetchExpertEvents());
    } catch (goLiveError) {
      toast.error(goLiveError?.message || goLiveError?.msg || "Failed to start live session.");
    } finally {
      setGoLiveEventId("");
    }
  };

  const columns = [
    {
      name: "Select",
      cell: (row) => (
        <button
          type="button"
          className="btn p-0 border-0 bg-transparent shadow-none"
          style={{
            width: "24px",
            height: "24px",
          }}
          onClick={(event) => {
            event.stopPropagation();
            setSelectedEvent((prev) => (prev?._id === row?._id ? null : row));
          }}
          title={selectedEvent?._id === row?._id ? "Selected" : "Select"}
        >
          <span
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "6px",
              border: selectedEvent?._id === row?._id ? "1px solid #7366ff" : "1px solid #c7cfdb",
              backgroundColor: selectedEvent?._id === row?._id ? "#7366ff" : "#ffffff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
          >
            {selectedEvent?._id === row?._id ? (
              <i
                className="fa fa-check"
                style={{
                  color: "#ffffff",
                  fontSize: "12px",
                  lineHeight: 1,
                }}
              />
            ) : null}
          </span>
        </button>
      ),
      center: true,
      minWidth: "80px",
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Cover",
      cell: (row) => <EventCover row={row} />,
      width: "96px",
    },
    {
      name: "Title",
      cell: (row) => (
        <div>
          <div className="fw-semibold">{row?.title || "N/A"}</div>
          {row?.description ? (
            <small className="text-muted d-block mt-1">
              {row.description.length > 80 ? `${row.description.slice(0, 80)}...` : row.description}
            </small>
          ) : null}
        </div>
      ),
      sortable: true,
      grow: 1.3,
      minWidth: "220px",
    },
    {
      name: "Event Date",
      selector: (row) => row?.eventDate || row?.startTime || "",
      sortable: true,
      cell: (row) => formatEventDate(row?.eventDate || row?.startTime),
      center: true,
      minWidth: "120px",
    },
    {
      name: "Event Time",
      selector: (row) => row?.eventTime || row?.startTime || "",
      sortable: true,
      cell: (row) => formatEventTime(row?.eventTime || row?.startTime),
      center: true,
      minWidth: "120px",
    },
    {
      name: "Start",
      selector: (row) => formatDateTime(row?.startTime),
      sortable: true,
      grow: 1.35,
      minWidth: "170px",
    },
    {
      name: "Duration",
      selector: (row) => formatDuration(row?.duration),
      center: true,
    },
    {
      name: "Participants",
      selector: (row) => row?.maxParticipants ?? "N/A",
      center: true,
    },
    {
      name: "Live",
      cell: (row) => {
        const eventLive = isEventLive(row);
        const isStarting = goLiveEventId === row?._id;

        return (
          <button
            type="button"
            className={`btn btn-sm ${eventLive ? "btn-primary" : "btn-success"}`}
            style={{
              minWidth: "92px",
              borderRadius: "8px",
              fontWeight: 600,
              backgroundColor: eventLive ? "#2152ff" : "#28a745",
              borderColor: eventLive ? "#2152ff" : "#28a745",
            }}
            onClick={(event) => {
              event.stopPropagation();
              handleGoLive(row);
            }}
            disabled={isStarting}
          >
            {isStarting ? "Starting..." : eventLive ? "Join Live" : "Go Live"}
          </button>
        );
      },
      center: true,
      minWidth: "130px",
    },
    {
      name: "Status",
      cell: (row) => (
        <Badge color={getStatusColor(getEventStatusLabel(row))}>{getEventStatusLabel(row)}</Badge>
      ),
      center: true,
    },
  ];

  const handleUpdateEvent = async (eventId, formData) => {
    try {
      await dispatch(updateExpertEvent({ eventId, formData })).unwrap();
      toast.success("Event updated successfully.");
      setEditModalOpen(false);
      setSelectedEvent(null);
      dispatch(fetchExpertEvents());
    } catch (updateError) {
      toast.error(updateError?.message || updateError?.msg || "Failed to update event.");
    }
  };

  const handleCreateEvent = async (formData) => {
    try {
      await dispatch(createExpertEvent(formData)).unwrap();

      const refreshedPayload = await dispatch(fetchExpertEvents()).unwrap();
      const createdTitle = readFormDataValue(formData, "title").trim().toLowerCase();
      const createdStartTime = readFormDataValue(formData, "startTime");
      const refreshedEvents = Array.isArray(refreshedPayload?.events) ? refreshedPayload.events : [];

      const createdEvent = refreshedEvents.find((event) => {
        const sameTitle = createdTitle
          ? String(event?.title || "").trim().toLowerCase() === createdTitle
          : false;
        const sameStartTime = createdStartTime
          ? new Date(event?.startTime).toISOString() === createdStartTime
          : false;

        return sameTitle || sameStartTime;
      });

      if (createdEvent) {
        setSelectedEvent(createdEvent);
        toast.success("Event created and loaded from database successfully.");
      } else {
        toast.warning("Create request was sent, but the new event is not visible in database list yet.");
      }

      return true;
    } catch (createError) {
      toast.error(createError?.message || createError?.msg || "Failed to create event.");
      return false;
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent?._id) {
      return;
    }

    try {
      await dispatch(deleteExpertEvent(selectedEvent._id)).unwrap();
      toast.success("Event deleted successfully.");
      setDeleteModalOpen(false);
      setSelectedEvent(null);
    } catch (deleteError) {
      toast.error(deleteError?.message || deleteError?.msg || "Failed to delete event.");
    }
  };

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
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <div>
          <H5 attrH4={{ className: "text-muted m-0" }}>My Events</H5>
          <small className="text-muted">{count || events.length || 0} events available</small>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <Btn attrBtn={{ color: "light", onClick: () => dispatch(fetchExpertEvents()) }}>
            Refresh
          </Btn>
          <Btn attrBtn={{ color: "primary", onClick: () => setAddModalOpen(true) }}>
            Add Event
          </Btn>
        </div>
      </div>

      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3 p-3 rounded border bg-light">
        <div>
          <div className="fw-semibold text-dark">
            {selectedEvent?.title || "Select an event"}
          </div>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <Btn
            attrBtn={{
              color: "primary",
              disabled: !selectedEvent?._id,
              onClick: () => setEditModalOpen(true),
            }}
          >
            Edit
          </Btn>
          <Btn
            attrBtn={{
              color: "danger",
              disabled: !selectedEvent?._id,
              onClick: () => setDeleteModalOpen(true),
            }}
          >
            Delete
          </Btn>
        </div>
      </div>

      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <InputGroup style={{ maxWidth: "360px" }}>
          <InputGroupText
            style={{
              borderTopLeftRadius: "999px",
              borderBottomLeftRadius: "999px",
              backgroundColor: "#f8f9fa",
            }}
          >
            <i className="fa fa-search text-muted"></i>
          </InputGroupText>
          <Input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search my events..."
            style={{
              borderTopRightRadius: "999px",
              borderBottomRightRadius: "999px",
            }}
          />
        </InputGroup>
        {error ? <small className="text-danger">{String(error?.msg || error?.message || error)}</small> : null}
      </div>

      <DataTable
        data={filteredEvents}
        columns={columns}
        striped
        highlightOnHover
        responsive
        pagination
        customStyles={tableStyles}
        pointerOnHover
        onRowClicked={(row) => setSelectedEvent((prev) => (prev?._id === row?._id ? null : row))}
        conditionalRowStyles={[
          {
            when: (row) => row?._id && row?._id === selectedEvent?._id,
            style: {
              backgroundColor: "#f4f7ff",
            },
          },
        ]}
        noDataComponent={<div className="py-4 text-muted">No events found.</div>}
      />

      <AddModal
        isOpen={addModalOpen}
        toggle={() => setAddModalOpen((prev) => !prev)}
        onSave={handleCreateEvent}
        saving={actionLoading}
      />

      <EditModal
        isOpen={editModalOpen}
        toggle={() => {
          setEditModalOpen(false);
          setSelectedEvent(null);
        }}
        eventData={selectedEvent}
        onSave={handleUpdateEvent}
        saving={actionLoading}
      />

      <DeleteModal
        isOpen={deleteModalOpen}
        toggle={() => {
          setDeleteModalOpen(false);
          setSelectedEvent(null);
        }}
        onConfirm={handleDeleteEvent}
        deleting={actionLoading}
      />
    </Fragment>
  );
};

export default DataTableComponent;
