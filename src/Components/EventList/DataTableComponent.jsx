import React, { Fragment, useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { Badge, Button, Col, Form, FormGroup, Input } from "reactstrap";
import { toast } from "react-toastify";
import { Btn, Spinner } from "../../AbstractElements";
import EventDelete from "../../CommonElements/EventDeleteModal";
import { deleteEvent, fetchEvents, updateEvent } from "../../Redux/stateSlice/eventListReducer";
import AddModal from "./AddModal";
import EditModal from "./EditModal";

const formatEventDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-GB");
};

const formatEventTime = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const getStatusColor = (status) => {
  const normalized = String(status || "scheduled").toLowerCase();

  if (normalized === "scheduled") return "primary";
  if (normalized === "live") return "success";
  if (normalized === "completed") return "success";
  if (normalized === "cancelled") return "danger";
  return "warning";
};

const DataTableComponent = () => {
  const dispatch = useDispatch();
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteEventId, setDeleteEventId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [toggleDelete, setToggleDelete] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { loading, events, error, submitting } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchInput]);

  const allEvents = useMemo(() => {
    if (Array.isArray(events?.data)) {
      return events.data;
    }

    if (Array.isArray(events?.events)) {
      return events.events;
    }

    if (Array.isArray(events)) {
      return events;
    }

    return [];
  }, [events]);

  useEffect(() => {
    console.info("[Admin Events Page] Response summary", {
      endpoint: "/api/admin/expert/my-events",
      count: allEvents.length,
      firstTitle: allEvents[0]?.title || null,
    });
  }, [allEvents]);

  const filteredEvents = useMemo(() => {
    if (!isSearch) {
      return allEvents;
    }

    const query = searchInput.trim().toLowerCase();
    return allEvents.filter((event) => String(event?.title || "").toLowerCase().includes(query));
  }, [allEvents, isSearch, searchInput]);

  const paginatedData = useMemo(
    () => filteredEvents.slice((currentPage - 1) * perPage, currentPage * perPage),
    [filteredEvents, currentPage, perPage]
  );

  const handleDelete = (id) => {
    setDeleteEventId(id);
    setIsDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteEventId) {
      return;
    }

    try {
      setIsDelete(false);
      await dispatch(deleteEvent(deleteEventId)).unwrap();
      toast.success("Event deleted successfully.");
      dispatch(fetchEvents());
      setDeleteEventId(null);
      setToggleDelete((prev) => !prev);
    } catch (deleteError) {
      const message =
        deleteError?.msg ||
        deleteError?.message ||
        deleteError?.error ||
        "Failed to delete event.";
      toast.error(message);
    }
  };

  const handleUpdateEvent = async (eventId, eventData) => {
    try {
      await dispatch(updateEvent({ eventId, eventData })).unwrap();
      toast.success("Event updated successfully.");
      setEditModal(false);
      setSelectedEvent(null);
      dispatch(fetchEvents());
    } catch (updateError) {
      const message =
        updateError?.msg ||
        updateError?.message ||
        updateError?.error ||
        "Failed to update event.";
      toast.error(message);
    }
  };

  const toggleEditModal = (eventData) => {
    if (eventData) {
      setSelectedEvent(eventData);
      setEditModal(true);
      return;
    }

    setEditModal(false);
    setSelectedEvent(null);
  };

  const tableColumns = [
    {
      name: "Title",
      selector: (row) => row?.title || "N/A",
      sortable: true,
      center: true,
      grow: 1.4,
    },
    {
      name: "Event Date",
      selector: (row) => row?.eventDate || row?.startTime || "",
      sortable: true,
      center: true,
      cell: (row) => formatEventDate(row?.eventDate || row?.startTime),
    },
    {
      name: "Event Time",
      selector: (row) => row?.eventTime || row?.startTime || "N/A",
      sortable: true,
      center: true,
      cell: (row) => formatEventTime(row?.eventTime || row?.startTime),
    },
    {
      name: "Status",
      selector: (row) => row?.status || "N/A",
      sortable: true,
      cell: (row) => <Badge color={getStatusColor(row?.status)}>{row?.status || "Scheduled"}</Badge>,
      center: true,
    },
    {
      name: "Option",
      center: true,
      minWidth: "150px",
      button: true,
      cell: (row) => (
        <div className="d-flex">
          <button className="btn btn-light p-2 mx-1" onClick={() => toggleEditModal(row)}>
            <i className="fa fa-edit" style={{ fontSize: "large", color: "#494949" }}></i>
          </button>
          <button className="btn btn-light p-2 mx-1" onClick={() => handleDelete(row?._id)}>
            <i className="fa fa-trash-o" style={{ fontSize: "large", color: "#494949" }}></i>
          </button>
        </div>
      ),
    },
  ];

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
      <Form
        onSubmit={(event) => {
          event.preventDefault();
          setIsSearch(true);
        }}
        className="mb-3"
      >
        <FormGroup>
          <div className="d-flex flex-wrap gap-3 align-items-center">
            <Input
              type="text"
              placeholder="Search by title..."
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              style={{ width: "250px" }}
            />
            <Btn attrBtn={{ color: "primary", type: "submit" }}>Search</Btn>
            {isSearch ? (
              <Button
                color="secondary"
                onClick={() => {
                  setSearchInput("");
                  setIsSearch(false);
                }}
              >
                Clear
              </Button>
            ) : null}
            {error ? (
              <small className="text-danger">{String(error?.message || error?.msg || error)}</small>
            ) : null}
          </div>
        </FormGroup>
      </Form>

      <DataTable
        data={paginatedData}
        columns={tableColumns}
        striped
        center
        pagination
        paginationServer
        paginationTotalRows={filteredEvents.length}
        paginationPerPage={perPage}
        onChangePage={setCurrentPage}
        onChangeRowsPerPage={(newPerPage, page) => {
          setPerPage(newPerPage);
          setCurrentPage(page);
        }}
        paginationDefaultPage={currentPage}
        selectableRows
        onSelectedRowsChange={() => {}}
        clearSelectedRows={toggleDelete}
      />

      <AddModal viewModal={viewModal} setViewModal={setSelectedEvent} Modaltoggle={() => setViewModal((prev) => !prev)} />

      <EditModal
        eventData={selectedEvent}
        isOpen={editModal}
        toggle={() => toggleEditModal()}
        onSave={handleUpdateEvent}
        saving={submitting}
      />

      <EventDelete isDelete={isDelete} setIsDelete={setIsDelete} onDelete={handleConfirmDelete} />
    </Fragment>
  );
};

export default DataTableComponent;
