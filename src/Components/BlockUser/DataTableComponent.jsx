import React, { Fragment, useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { Btn, Spinner } from "../../AbstractElements";
import { Col, Input, Form, FormGroup, Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import axios from "axios";
import { API_URL, resolveApiUrl } from "../../Config/AppConstant";
import { toast } from "react-toastify";
import { getUserDisplayName, getUserId, getUserName } from "../../Utils/userDisplay";
import { BLOCK_REASON_STORAGE_KEY } from "../../Utils/blockReasons";

const getBlockHistoryBases = () =>
  [...new Set([resolveApiUrl(), API_URL, "https://api.careavatar.com/api"])];

const getArrayPayload = (payload) => {
  if (Array.isArray(payload)) return payload;

  const candidates = [
    payload?.data,
    payload?.history,
    payload?.blockHistory,
    payload?.histories,
    payload?.results,
  ];

  const directArray = candidates.find(Array.isArray);
  if (directArray) return directArray;

  const nestedObjects = candidates.filter(
    (candidate) => candidate && typeof candidate === "object" && !Array.isArray(candidate)
  );

  for (const nested of nestedObjects) {
    const nestedArray = getArrayPayload(nested);
    if (nestedArray.length) return nestedArray;
  }

  return [];
};

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
  const results = await Promise.allSettled(
    getBlockHistoryBases().map((base) =>
      axios.get(`${base}/admin/getBlockHistory`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    )
  );

  const history = results.flatMap((result) =>
    result.status === "fulfilled" ? getArrayPayload(result.value?.data) : []
  );

  if (!history.length && results.every((result) => result.status === "rejected")) {
    console.warn("Block history could not be loaded. Showing the current blocked state instead.");
  }

  return history;
};

const getUserKeys = (value) => {
  const userCandidates = [value?.user, value?.userId, value?.blockedUser, value?.targetUser];
  const user = userCandidates.find((candidate) => candidate && typeof candidate === "object") || value;
  const keys = [
    user?._id,
    user?.id,
    user?.userId,
    typeof value?.user === "string" ? value.user : null,
    typeof value?.userId === "string" ? value.userId : value?.userId?._id || value?.userId?.id,
    typeof value?.blockedUser === "string" ? value.blockedUser : value?.blockedUser?._id,
    typeof value?.targetUser === "string" ? value.targetUser : value?.targetUser?._id,
    user?.phoneNumber,
    user?.email,
  ];

  return [...new Set(keys.filter(Boolean).map(String))];
};

const normalizeHistoryEntry = (entry) => {
  const actionValue = String(entry?.action || entry?.event || "").toLowerCase();
  const statusValue = String(entry?.status ?? "").toLowerCase();
  const isUnblocked =
    entry?.status === true ||
    actionValue.includes("unblock") ||
    ["active", "unblocked", "enabled", "true"].includes(statusValue);

  return {
    ...entry,
    status: isUnblocked,
    action: isUnblocked ? "Unblocked" : "Blocked",
    reason:
      entry?.reason ||
      entry?.blockReason ||
      entry?.blockedReason ||
      entry?.reasonText ||
      entry?.selectedReason ||
      "",
    blockedBy: entry?.blockedBy || entry?.actionBy || entry?.admin || entry?.updatedBy || null,
    createdAt:
      entry?.createdAt ||
      entry?.blockedAt ||
      entry?.actionDate ||
      entry?.updatedAt ||
      entry?.date ||
      null,
  };
};

const getActionByName = (value) => {
  if (!value) return "-";
  if (typeof value === "string") return value;

  const fullName = [value?.firstName, value?.lastName].filter(Boolean).join(" ").trim();
  return value?.name || value?.fullName || fullName || value?.email || "-";
};

const removeDuplicateHistory = (history) => {
  const seen = new Set();

  return history.filter((item) => {
    const key = [
      item?._id,
      item?.action,
      item?.reason,
      getActionByName(item?.blockedBy),
      item?.createdAt,
    ]
      .filter(Boolean)
      .join("|");

    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const getHistoryUser = (item) => {
  const candidate = [item?.user, item?.userId, item?.blockedUser, item?.targetUser].find(
    (value) => value && typeof value === "object" && !Array.isArray(value)
  );
  return candidate || null;
};

const getHistoryEntries = (item) => {
  const nestedHistory = [item?.history, item?.blockHistory, item?.histories, item?.actions].find(Array.isArray);

  if (nestedHistory?.length) {
    return nestedHistory.map(normalizeHistoryEntry);
  }

  const hasHistoryFields =
    item?.reason ||
    item?.blockReason ||
    item?.blockedReason ||
    item?.selectedReason ||
    item?.blockedAt ||
    item?.blockedBy;

  return hasHistoryFields ? [normalizeHistoryEntry(item)] : [];
};

const sortHistoryNewestFirst = (history) =>
  removeDuplicateHistory([...history]).sort((left, right) => {
    const leftTime = new Date(left?.createdAt || 0).getTime() || 0;
    const rightTime = new Date(right?.createdAt || 0).getTime() || 0;
    return rightTime - leftTime;
  });

const formatDateTime = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString("en-IN");
};

const getStoredBlockReasons = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(BLOCK_REASON_STORAGE_KEY) || "{}");
    return stored && typeof stored === "object" && !Array.isArray(stored) ? stored : {};
  } catch (error) {
    console.warn("Stored block reasons could not be read.", error);
    return {};
  }
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
      const storedBlockReasons = getStoredBlockReasons();

      const historyMap = new Map();

      historyRows.forEach((item) => {
        const history = getHistoryEntries(item);
        getUserKeys(item).forEach((key) => {
          historyMap.set(key, sortHistoryNewestFirst([...(historyMap.get(key) || []), ...history]));
        });
      });

      const usersByKey = new Map();
      users.forEach((user) => getUserKeys(user).forEach((key) => usersByKey.set(key, user)));

      historyRows.forEach((item) => {
        const historyUser = getHistoryUser(item);
        if (!historyUser) return;

        const matchingUser = getUserKeys(item)
          .map((key) => usersByKey.get(key))
          .find(Boolean);

        if (!matchingUser && historyUser?.status === false) {
          users.push(historyUser);
          getUserKeys(historyUser).forEach((key) => usersByKey.set(key, historyUser));
        }
      });

      const mergedUsers = users.map((user) => {
        const apiHistory = getUserKeys(user).flatMap((key) => historyMap.get(key) || []);
        const embeddedHistory = getHistoryEntries(user);
        const availableHistory = [...apiHistory, ...embeddedHistory];
        const storedReason = getUserKeys(user)
          .map((key) => storedBlockReasons[key])
          .find((entry) => entry?.reason && entry?.status !== true);
        const cachedHistory =
          availableHistory.length === 0 && storedReason
            ? [
                normalizeHistoryEntry({
                  reason: storedReason.reason,
                  status: false,
                  blockedBy: { name: storedReason.blockedBy || "Admin" },
                  createdAt: storedReason.updatedAt,
                }),
              ]
            : [];

        const currentStateHistory =
          availableHistory.length === 0 && cachedHistory.length === 0
            ? [
                normalizeHistoryEntry({
                  action: "Blocked",
                  status: false,
                  reason: user?.reason || user?.blockReason || user?.blockedReason || "",
                  blockedBy: user?.blockedBy || user?.actionBy || user?.updatedBy || null,
                  createdAt: user?.blockedAt || user?.updatedAt || user?.createdAt || null,
                }),
              ]
            : [];

        return {
          ...user,
          history: sortHistoryNewestFirst([
            ...availableHistory,
            ...cachedHistory,
            ...currentStateHistory,
          ]),
        };
      });

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
      name: "User ID",
      selector: (row) => getUserId(row),
      sortable: true,
      center: true,
      minWidth: "170px",
      cell: (row) => (
        <span className="text-break" title={getUserId(row)}>
          {getUserId(row)}
        </span>
      ),
    },
    {
      name: "Email",
      selector: (row) => row?.email || "-",
      sortable: true,
      center: true,
      minWidth: "170px",
    },
    {
      name: "Phone",
      selector: (row) => row?.phoneNumber || "-",
      sortable: true,
      center: true,
      minWidth: "135px",
    },
    {
      name: "Status",
      selector: () => "Blocked",
      center: true,
      minWidth: "100px",
    },
    {
      name: "Reason",
      selector: (row) => row?.history?.[0]?.reason || "-",
      center: true,
      minWidth: "130px",
    },
    {
      name: "Blocked By",
      selector: (row) => getActionByName(row?.history?.[0]?.blockedBy),
      center: true,
      minWidth: "130px",
    },
    {
      name: "Blocked On",
      selector: (row) => row?.history?.[0]?.createdAt || "",
      cell: (row) =>
        formatDateTime(row?.history?.[0]?.createdAt || row?.updatedAt || row?.createdAt),
      center: true,
      minWidth: "165px",
    },
    {
      name: "Option",
      center: true,
      button: true,
      minWidth: "140px",
      cell: (row) => (
        <button
          type="button"
          className="btn btn-info px-3 py-2 text-white"
          onClick={() => handleViewHistory(row)}
          title="View block/unblock history"
        >
          <i className="fa fa-history me-1" /> View History
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

      <Modal
        isOpen={historyModalOpen}
        toggle={closeHistoryModal}
        centered
        size="lg"
        backdrop
        contentClassName="shadow border-0"
      >
        <ModalHeader
          toggle={closeHistoryModal}
          className="text-white text-center"
          style={{ backgroundColor: "#0798bd", borderBottom: "2px solid #087ca0" }}
        >
          <span className="d-block w-100">Block/Unblock History</span>
        </ModalHeader>
        <ModalBody className="p-3">
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle mb-0">
              <thead className="table-light">
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
                  const label = isUnblocked ? "Unblocked" : "Blocked";

                  return (
                    <tr key={item?._id || `${item?.createdAt || "history"}-${index}`}>
                      <td className={isUnblocked ? "text-success fw-bold" : "text-danger fw-bold"}>
                        {label}
                      </td>
                      <td>{item?.reason || "-"}</td>
                      <td>{getActionByName(item?.blockedBy)}</td>
                      <td>
                        <span className={`badge rounded-pill ${isUnblocked ? "bg-success" : "bg-danger"}`}>
                          {label}
                        </span>
                      </td>
                      <td className="text-nowrap">{formatDateTime(item?.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default DataTableComponent;


