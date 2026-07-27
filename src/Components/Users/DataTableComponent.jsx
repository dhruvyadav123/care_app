import React, { Fragment, useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { Btn, Spinner } from "../../AbstractElements";
import { Col, FormGroup, Input, Form, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, fetchUsers, searchUsers } from "../../Redux/stateSlice/userReducer";
import ViewModal from "./ViewModal";
import Switch from "react-switch";
import axios from "axios";
import Delete from "../../CommonElements/deleteModal";
import { resolveAssetUrl } from "../../Utils/media";
import { resolveApiUrl } from "../../Config/AppConstant";
import { toast } from "react-toastify";
import { getUserDisplayName, getUserName } from "../../Utils/userDisplay";
import {
  BLOCK_REASON_OPTIONS,
  BLOCK_REASON_STORAGE_KEY,
  UNBLOCK_REASON_OPTIONS,
} from "../../Utils/blockReasons";

const getInitials = (name) =>
  String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "US";

const formatDate = (value) => {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
};

const isUserActive = (user) => {
  if (typeof user?.status === "boolean") {
    return user.status;
  }

  if (typeof user?.isBlocked === "boolean") {
    return !user.isBlocked;
  }

  if (typeof user?.blocked === "boolean") {
    return !user.blocked;
  }

  const statusValue = String(user?.accountStatus ?? user?.status ?? "").toLowerCase();

  if (["blocked", "inactive", "disabled", "false", "0"].includes(statusValue)) {
    return false;
  }

  if (["active", "unblocked", "enabled", "true", "1"].includes(statusValue)) {
    return true;
  }

  return Boolean(user?.status);
};

const AvatarCell = ({ row }) => {
  const [hasImageError, setHasImageError] = useState(false);
  const avatarUrl = resolveAssetUrl(row?.avatar);

  if (!avatarUrl || hasImageError) {
    return (
      <div
        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-semibold"
        style={{
          width: "60px",
          height: "60px",
          background: "linear-gradient(135deg, #7366ff 0%, #9b8cff 100%)",
          fontSize: "18px",
        }}
      >
        {getInitials(getUserName(row) !== "N/A" ? getUserName(row) : getUserDisplayName(row))}
      </div>
    );
  }

  return (
    <img
      className="img-60 rounded-circle"
      src={avatarUrl}
      alt={getUserDisplayName(row)}
      onError={() => setHasImageError(true)}
      style={{ objectFit: "cover" }}
    />
  );
};

const DataTableComponent = () => {
  const [viewData, setViewData] = useState("");
  const [viewModal, setViewModal] = useState(false);
  const [reasonModal, setReasonModal] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const [otherBlockReason, setOtherBlockReason] = useState("");
  const [currentToggleUser, setCurrentToggleUser] = useState(null);
  const [search, setSearch] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [userTypeFilter, setUserTypeFilter] = useState("");
  const [createdDateFilter, setCreatedDateFilter] = useState("");

  const dispatch = useDispatch();
  const { loading, error, pagination, users } = useSelector((state) => state.userState);

  useEffect(() => {
    if (isSearch) {
      return;
    }

    dispatch(fetchUsers(currentPage, rowsPerPage));
  }, [dispatch, currentPage, rowsPerPage, isSearch]);

  const handleView = (data) => {
    setViewModal(true);
    setViewData(data);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  const handleFilterChange = (setter, value) => {
    setter(value);
    setCurrentPage(1);
    setIsSearch(false);
  };

  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
        const matchesType =
          !userTypeFilter ||
          String(user?.userType || "").toLowerCase() === userTypeFilter.toLowerCase();
        const createdDate = user?.createdAt
          ? new Date(user.createdAt).toISOString().slice(0, 10)
          : "";
        const matchesDate = !createdDateFilter || createdDate === createdDateFilter;
        return matchesType && matchesDate;
      }),
    [users, userTypeFilter, createdDateFilter]
  );

  const displayedUsers = useMemo(() => {
    if (!isSearch) {
      return filteredUsers;
    }

    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredUsers.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredUsers, currentPage, rowsPerPage, isSearch]);

  const userTypeOptions = useMemo(
    () => [...new Set(users.map((user) => user?.userType).filter(Boolean))],
    [users]
  );

  const hasFilters = Boolean(userTypeFilter || createdDateFilter);

  const handleConfirmDelete = async () => {
    if (!deleteUserId) {
      setIsDelete(false);
      return;
    }

    try {
      const response = await dispatch(deleteUser(deleteUserId));
      const isDeletingLastVisibleRow = displayedUsers.length === 1 && currentPage > 1;

      setIsDelete(false);
      setDeleteUserId(null);
      toast.success(response?.message || "User deleted successfully");

      if (isDeletingLastVisibleRow) {
        setCurrentPage((prevPage) => prevPage - 1);
      } else if (!isSearch) {
        await dispatch(fetchUsers(currentPage, rowsPerPage));
      }
    } catch (requestError) {
      toast.error(requestError?.response?.data?.message || "Unable to delete user");
    }
  };

  const handleStatusToggleClick = (user) => {
    setCurrentToggleUser(user);
    setReasonModal(true);
    setBlockReason("");
    setOtherBlockReason("");
  };

  const reasonModalTitle = currentToggleUser
    ? isUserActive(currentToggleUser)
      ? "Provide Reason to Block User"
      : "Provide Reason to Unblock User"
    : "Provide Reason";

  const reasonPlaceholder = currentToggleUser
    ? isUserActive(currentToggleUser)
      ? "Enter reason for blocking this user"
      : "Enter reason for unblocking this user"
    : "Enter reason";

  const reasonOptions = isUserActive(currentToggleUser)
    ? BLOCK_REASON_OPTIONS
    : UNBLOCK_REASON_OPTIONS;

  const handleBlockSubmit = async () => {
    if (!currentToggleUser) return;

    const reason = blockReason === "Other" ? otherBlockReason.trim() : blockReason.trim();
    if (!reason) return;

    try {
      const userId = currentToggleUser._id;
      const token = localStorage.getItem("token");
      const status = !isUserActive(currentToggleUser);
      const apiUrl = resolveApiUrl();

      await axios.put(
        `${apiUrl}/admin/updateUserStatus/${userId}`,
        { status, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const storedReasons = JSON.parse(localStorage.getItem(BLOCK_REASON_STORAGE_KEY) || "{}");
      storedReasons[userId] = {
        reason,
        status,
        blockedBy: localStorage.getItem("Name") || "Admin",
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(BLOCK_REASON_STORAGE_KEY, JSON.stringify(storedReasons));

      await dispatch(fetchUsers(currentPage, rowsPerPage));

      setReasonModal(false);
      setBlockReason("");
      setOtherBlockReason("");
      setCurrentToggleUser(null);
      toast.success(status ? "User unblocked successfully" : "User blocked successfully");
    } catch (err) {
      console.error("Block/Unblock failed:", err);
      toast.error(err?.response?.data?.message || "Block/unblock API failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextSearch = search.trim();
    if (!nextSearch) return;

    setCurrentPage(1);
    await dispatch(searchUsers(nextSearch));
    setIsSearch(true);
  };

  const handleClear = () => {
    setSearch("");
    setIsSearch(false);
    setCurrentPage(1);
  };

  const handleExport = () => {
    const headers = ["S.No.", "Name", "Phone", "User Type", "Status", "Time Zone", "Created On"];
    const rows = filteredUsers.map((user, index) => [
      index + 1,
      getUserName(user),
      user?.phoneNumber || "",
      user?.userType || "",
      isUserActive(user) ? "Active" : "Blocked",
      user?.timeZone || "",
      user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "",
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blobUrl = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `users-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(blobUrl);
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

  if (error) {
    return <p>Error: {error}</p>;
  }

  const tableColumns = [
    {
      name: "S.No.",
      cell: (_row, rowIndex) => (currentPage - 1) * rowsPerPage + rowIndex + 1,
      width: "80px",
      center: true,
    },
    {
      name: "Profile",
      cell: (row) => (
        <div className="avatar">
          <AvatarCell row={row} />
        </div>
      ),
    },
    {
      name: "Name",
      cell: (row) => (
        <div className="text-start">
          <div className="fw-semibold">{getUserName(row)}</div>
          <div className="text-muted" style={{ fontSize: "12px" }}>
            {row?.email || row?.phoneNumber || "No contact info"}
          </div>
        </div>
      ),
      sortable: true,
      center: true,
    },
    { name: "Phone", selector: (row) => row?.phoneNumber || "N/A", sortable: true, center: true },
    { name: "User Type", selector: (row) => row?.userType || "N/A", sortable: true, center: true },
    {
      name: "Status",
      selector: (row) => (isUserActive(row) ? "Active" : "Blocked"),
      sortable: true,
      center: true,
    },
    { name: "Time Zone", selector: (row) => row?.timeZone || "N/A", sortable: true, center: true },
    { name: "Created On", selector: (row) => formatDate(row?.createdAt), sortable: true, center: true },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex align-items-center">
          <button className="btn btn-light p-1 mx-1" onClick={() => handleView(row)} title="View">
            <i className="fa fa-eye" style={{ fontSize: "small", color: "#494949" }}></i>
          </button>
          <button
            className="btn btn-light p-1 mx-1"
            onClick={() => {
              setDeleteUserId(row?._id);
              setIsDelete(true);
            }}
            title="Delete"
          >
            <i className="fa fa-trash-o" style={{ fontSize: "small", color: "#494949" }}></i>
          </button>
          <Switch
            onChange={() => handleStatusToggleClick(row)}
            checked={isUserActive(row)}
            offColor="#dc3545"
            onColor="#28a745"
            uncheckedIcon={false}
            checkedIcon={false}
            height={20}
            width={40}
          />
        </div>
      ),
    },
  ];

  return (
    <Fragment>
      <Form onSubmit={handleSubmit} className="mb-3">
        <FormGroup>
          <div className="d-flex gap-3">
            <Input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "250px" }}
            />
            <Btn attrBtn={{ color: "primary" }}>Search</Btn>
            <Button color="success" type="button" onClick={handleExport}>
              <i className="fa fa-download me-1" /> Export CSV
            </Button>
            {isSearch && (
              <Button color="secondary" type="button" onClick={handleClear}>
                Clear
              </Button>
            )}
          </div>
          <div className="d-flex gap-3 mt-3 flex-wrap">
            <Input
              type="select"
              value={userTypeFilter}
              onChange={(e) => handleFilterChange(setUserTypeFilter, e.target.value)}
              style={{ width: "180px" }}
            >
              <option value="">All user types</option>
              {userTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Input>
            <Input
              type="date"
              value={createdDateFilter}
              onChange={(e) => handleFilterChange(setCreatedDateFilter, e.target.value)}
              title="Filter by creation date"
              style={{ width: "180px" }}
            />
            {hasFilters && (
              <Button
                color="secondary"
                type="button"
                onClick={() => {
                  setUserTypeFilter("");
                  setCreatedDateFilter("");
                  setCurrentPage(1);
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        </FormGroup>
      </Form>

      <DataTable
        data={displayedUsers}
        columns={tableColumns}
        striped
        pagination
        paginationServer={!isSearch}
        paginationTotalRows={
          isSearch
            ? filteredUsers.length
            : hasFilters
              ? filteredUsers.length
              : pagination?.totalUsers || pagination?.total || users.length || 0
        }
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleRowsPerPageChange}
        paginationDefaultPage={currentPage}
        paginationPerPage={rowsPerPage}
        selectableRows
        clearSelectedRows={false}
      />

      <ViewModal data={viewData} viewModal={viewModal} setViewModal={setViewModal} />
      <Delete isDelete={isDelete} setIsDelete={setIsDelete} onDelete={handleConfirmDelete} />

      <Modal
        isOpen={reasonModal}
        toggle={() => setReasonModal(false)}
        centered
        backdrop={true}
        modalClassName="reason-modal"
      >
        <ModalHeader toggle={() => setReasonModal(false)}>
          {reasonModalTitle}
        </ModalHeader>
        <ModalBody>
          <Input
            type="select"
            aria-label={reasonPlaceholder}
            value={blockReason}
            onChange={(e) => {
              setBlockReason(e.target.value);
              if (e.target.value !== "Other") setOtherBlockReason("");
            }}
            className="reason-input"
          >
            <option value="">Select a reason</option>
            {reasonOptions.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </Input>
          {blockReason === "Other" && (
            <Input
              type="text"
              placeholder="Enter another reason"
              value={otherBlockReason}
              onChange={(e) => setOtherBlockReason(e.target.value)}
              className="reason-input mt-3"
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setReasonModal(false)}>
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={handleBlockSubmit}
            disabled={!blockReason.trim() || (blockReason === "Other" && !otherBlockReason.trim())}
          >
            Submit
          </Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
};

export default DataTableComponent;