import React, { Fragment, useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { Btn, Spinner } from "../../AbstractElements";
import { Col, Input, Form, FormGroup, Button } from "reactstrap";
import axios from "axios";
import { API_URL, resolveApiUrl } from "../../Config/AppConstant";
import { toast } from "react-toastify";
import { getUserDisplayName, getUserId, getUserName } from "../../Utils/userDisplay";

const BLOCK_HISTORY_BASES = [API_URL, "https://api.careavatar.com/api"];

const getBlockedUsersFromResponse = (payload) => {
  const users = Array.isArray(payload?.users) ? payload.users : [];
  return users.filter((user) => user?.status === false);
};

const fetchBlockedUsers = async (token) => {
  const apiUrl = resolveApiUrl();
  const response = await axios.get(`${apiUrl}/admin/getAllUsers?page=1&limit=500`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return getBlockedUsersFromResponse(response.data);
};

const fetchBlockHistoryFromAvailableApi = async (token) => {
  let lastError;

  for (const base of BLOCK_HISTORY_BASES) {
    try {
      const response = await axios.get(`${base}/admin/getBlockHistory`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return Array.isArray(response?.data?.data) ? response.data.data : [];
    } catch (error) {
      const status = error?.response?.status;

      if (status !== 404) {
        throw error;
      }

      lastError = error;
    }
  }

  if (lastError) {
    console.warn("Block history API not found. Showing blocked users without history.");
  }

  return [];
};

const getUserKey = (user) => user?._id || user?.id || user?.phoneNumber || user?.email;

const formatDateTime = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString("en-IN");
};

const DataTableComponent = () => {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selectedUserHistory, setSelectedUserHistory] = useState([]);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);

  const loadBlockedUsers = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const [users, historyRows] = await Promise.all([
        fetchBlockedUsers(token),
        fetchBlockHistoryFromAvailableApi(token).catch(() => []),
      ]);

      const historyMap = new Map(
        historyRows.map((item) => [getUserKey(item?.user), Array.isArray(item?.history) ? item.history : []])
      );

      const mergedUsers = users.map((user) => ({
        ...user,
        history: historyMap.get(getUserKey(user)) || [],
      }));

      setBlockedUsers(mergedUsers);
    } catch (error) {
      console.error("Failed to fetch blocked users:", error);
      toast.error(error?.response?.data?.message || "Unable to fetch blocked users");
      setBlockedUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlockedUsers();
  }, []);

  const filteredData = useMemo(() => {
    const query = isSearch ? searchInput.trim().toLowerCase() : "";

    if (!query) {
      return blockedUsers;
    }

    return blockedUsers.filter((user) =>
      [getUserName(user), user?.email, user?.phoneNumber, user?.timeZone]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [blockedUsers, isSearch, searchInput]);

  const paginatedData = useMemo(
    () => filteredData.slice((currentPage - 1) * perPage, currentPage * perPage),
    [filteredData, currentPage, perPage]
  );

  const handlePageChange = (page) => setCurrentPage(page);

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };

  const handleSearchClear = () => {
    setSearchInput("");
    setIsSearch(false);
    setCurrentPage(1);
  };

  const handleViewHistory = (row) => {
    setSelectedUserHistory(Array.isArray(row?.history) ? row.history : []);
    setHistoryModalOpen(true);
  };

  const closeHistoryModal = () => {
    setSelectedUserHistory([]);
    setHistoryModalOpen(false);
  };

  const tableColumns = [
    {
      name: "Name",
      selector: (row) => getUserDisplayName(row),
      sortable: true,
      center: true,
      cell: (row) => (
        <div className="text-start">
          <div className="fw-semibold">{getUserName(row)}</div>
          <div className="text-muted" style={{ fontSize: "12px" }}>
            ID: {getUserId(row)}
          </div>
        </div>
      ),
    },
    {
      name: "User ID",
      selector: (row) => getUserId(row),
      sortable: true,
      center: true,
      cell: (row) => (
        <span title={getUserId(row)}>
          {getUserId(row)}
        </span>
      ),
    },
    {
      name: "Email",
      selector: (row) => row?.email || "-",
      sortable: true,
      center: true,
    },
    {
      name: "Phone",
      selector: (row) => row?.phoneNumber || "-",
      sortable: true,
      center: true,
    },
    {
      name: "Status",
      selector: () => "Blocked",
      center: true,
    },
    {
      name: "Reason",
      selector: (row) => row?.history?.[0]?.reason || "-",
      center: true,
    },
    {
      name: "Blocked By",
      selector: (row) => row?.history?.[0]?.blockedBy?.name || "-",
      center: true,
    },
    {
      name: "Blocked On",
      selector: (row) => row?.history?.[0]?.createdAt || "",
      cell: (row) => formatDateTime(row?.history?.[0]?.createdAt || row?.updatedAt || row?.createdAt),
      center: true,
    },
    {
      name: "Option",
      center: true,
      button: true,
      cell: (row) => (
        <button
          className="btn btn-info p-2"
          onClick={() => handleViewHistory(row)}
          disabled={!row?.history?.length}
          title={row?.history?.length ? "View block history" : "No history available"}
        >
          <i className="fa fa-history" /> View History
        </button>
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
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          setIsSearch(Boolean(searchInput.trim()));
          setCurrentPage(1);
        }}
        className="mb-3"
      >
        <FormGroup>
          <div className="d-flex gap-3">
            <Input
              type="text"
              placeholder="Search by name, email, phone..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{ width: "280px" }}
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

      <DataTable
        data={paginatedData}
        columns={tableColumns}
        striped
        center
        pagination
        paginationServer
        paginationTotalRows={filteredData.length}
        paginationPerPage={perPage}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePerRowsChange}
        paginationDefaultPage={currentPage}
        noDataComponent={<div className="text-center p-4">No blocked users found</div>}
      />

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
            backgroundColor: "rgba(0, 0, 0, 0.35)",
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
                  <p className="text-center text-muted mb-0">No history available.</p>
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
                      {selectedUserHistory.map((item, index) => {
                        const isUnblocked = item?.status === true;

                        return (
                          <tr key={index}>
                            <td style={{ fontWeight: "bold", color: isUnblocked ? "#198754" : "#dc3545" }}>
                              {isUnblocked ? "Unblocked" : "Blocked"}
                            </td>
                            <td>{item?.reason || "-"}</td>
                            <td>{item?.blockedBy?.name || "-"}</td>
                            <td>
                              <span
                                style={{
                                  padding: "5px 10px",
                                  borderRadius: "15px",
                                  color: "#fff",
                                  backgroundColor: isUnblocked ? "#198754" : "#dc3545",
                                  fontWeight: "500",
                                  fontSize: "14px",
                                }}
                              >
                                {isUnblocked ? "Unblocked" : "Blocked"}
                              </span>
                            </td>
                            <td>{formatDateTime(item?.createdAt)}</td>
                          </tr>
                        );
                      })}
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
