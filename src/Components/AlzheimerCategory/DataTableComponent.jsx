import React, { Fragment, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Btn, Spinner } from "../../AbstractElements";
import { Col, Input, Form, FormGroup, Button } from "reactstrap";
import axios from "axios";
import EventDelete from "../../CommonElements/EventDeleteModal"; // optional reuse for unblock confirmation

const DataTableComponent = () => {
  const [blockHistory, setBlockHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [isDelete, setIsDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [toggleDelete, setToggleDelete] = useState(false);

  const [selectedUserHistory, setSelectedUserHistory] = useState([]);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);

  // 🔹 Fetch Block History
  useEffect(() => {
    const fetchBlockHistory = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://api.careavatar.com/api/admin/getBlockHistory",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          setBlockHistory(response.data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch block history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlockHistory();
  }, [toggleDelete]);

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsDelete(true);
  };

  const handleConfirmDelete = () => {
    // API call to unblock user can be implemented here
    setIsDelete(false);
    setSelectedUser(null);
    setToggleDelete((prev) => !prev);
  };

  const handleSearchClear = () => {
    setSearchInput("");
    setIsSearch(false);
    setCurrentPage(1);
  };

  // 🔹 View history modal
  const handleViewHistory = (row) => {
    setSelectedUserHistory(row.history);
    setHistoryModalOpen(true);
  };

  const closeHistoryModal = () => {
    setSelectedUserHistory([]);
    setHistoryModalOpen(false);
  };

  // 🔹 Filtered data for search
  const filteredData = isSearch
    ? blockHistory.filter((user) =>
        user.user.name.toLowerCase().includes(searchInput.toLowerCase())
      )
    : blockHistory;

  const paginatedData = filteredData.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  // 🔹 Columns
  const tableColumns = [
    { name: "Name", selector: (row) => row.user.name, sortable: true, center: true },
    { name: "Email", selector: (row) => row.user.email, sortable: true, center: true },
    { name: "Phone", selector: (row) => row.user.phoneNumber, sortable: true, center: true },
    {
      name: "Latest Action",
      selector: (row) => row.history[0]?.action,
      sortable: true,
      center: true,
    },
    {
      name: "Reason",
      selector: (row) => row.history[0]?.reason,
      center: true,
    },
    {
      name: "Action By",
      selector: (row) => row.history[0]?.blockedBy?.name || "-",
      center: true,
    },
    {
      name: "Action Date",
      selector: (row) => row.history[0]?.createdAt,
      center: true,
      cell: (row) =>
        row.history[0]?.createdAt
          ? new Date(row.history[0].createdAt).toLocaleString("en-GB")
          : "-",
    },
    {
      name: "Option",
      center: true,
      button: true,
      cell: (row) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-info p-2"
            onClick={() => handleViewHistory(row)}
          >
            <i className="fa fa-history" /> View History
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <Col className="vh-100 d-flex align-items-center justify-content-center">
        <Spinner attrSpinner={{ className: "loader-5" }} />
      </Col>
    );
  }

  return (
    <Fragment>
      {/* 🔹 Search */}
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          setIsSearch(true);
        }}
        className="mb-3"
      >
        <FormGroup>
          <div className="d-flex gap-3">
            <Input
              type="text"
              placeholder="Search by name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{ width: "250px" }}
            />
            <Btn attrBtn={{ color: "primary", type: "submit" }}>Search</Btn>
            {isSearch && (
              <Button color="secondary" onClick={handleSearchClear}>
                Clear
              </Button>
            )}
          </div>
        </FormGroup>
      </Form>

      {/* 🔹 DataTable */}
      <DataTable
        data={paginatedData}
        columns={tableColumns}
        striped
        center
        pagination
        paginationServer={true}
        paginationTotalRows={filteredData.length}
        paginationPerPage={perPage}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePerRowsChange}
        paginationDefaultPage={currentPage}
      />

      {/* 🔹 Block/Unblock modal */}
      <EventDelete
        isDelete={isDelete}
        setIsDelete={setIsDelete}
        onDelete={handleConfirmDelete}
      />

      {/* 🔹 History Modal without transparent backdrop */}
      {historyModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1050,
            backgroundColor: "transparent", // transparent removed, fully visible modal
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content p-3 shadow">
              <div
                className="modal-header text-center"
                style={{
                  backgroundColor: "#2c90bfff",
                  color: "#fff",
                  fontWeight: "bold",
                  borderBottom: "2px solid #0b5ed7",
                }}
              >
                <h5 className="modal-title w-100">Block/Unblock History</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={closeHistoryModal}
                />
              </div>
              <div className="modal-body">
                {selectedUserHistory.length === 0 ? (
                  <p className="text-center text-muted">No history available.</p>
                ) : (
                  <table className="table table-bordered table-hover mb-0">
                    <thead style={{ backgroundColor: "#e9ecef" }}>
                      <tr>
                        <th>Action</th>
                        <th>Reason</th>
                        <th>Action By</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedUserHistory.map((h, i) => (
                        <tr key={i}>
                          <td>
                            <span
                              style={{
                                fontWeight: "bold",
                                color: h.status ? "#198754":"#dc3545",
                              }}
                            >
                              {h.status ?  "Unblocked":"Blocked" }
                            </span>
                          </td>
                          <td>{h.reason}</td>
                          <td>{h.blockedBy?.name || "-"}</td>
                          <td>
                            <span
                              style={{
                                padding: "5px 10px",
                                borderRadius: "15px",
                                color: "#fff",
                                backgroundColor: h.status ?  "#198754":"#dc3545" ,
                                fontWeight: "500",
                                fontSize: "14px",
                              }}
                            >
                              {h.status ?   "Unblocked":"Blocked"}
                            </span>
                          </td>
                          <td>{new Date(h.createdAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default DataTableComponent;
