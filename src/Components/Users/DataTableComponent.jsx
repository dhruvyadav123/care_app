import React, { Fragment, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Btn, Spinner } from "../../AbstractElements";
import { Col, FormGroup, Input, Form, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, searchUsers } from "../../Redux/stateSlice/userReducer";
import ViewModal from "./ViewModal";
import Switch from "react-switch";
import axios from "axios";
import Delete from "../../CommonElements/deleteModal";
import { resolveAssetUrl } from "../../Utils/media";
import { resolveApiUrl } from "../../Config/AppConstant";
import { toast } from "react-toastify";
import { getUserDisplayName, getUserName } from "../../Utils/userDisplay";

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
  const [currentToggleUser, setCurrentToggleUser] = useState(null);
  const [search, setSearch] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();
  const { loading, error, pagination, users } = useSelector((state) => state.userState);

  useEffect(() => {
    dispatch(fetchUsers(currentPage, 10));
  }, [dispatch, currentPage]);

  const handleView = (data) => {
    setViewModal(true);
    setViewData(data);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleConfirmDelete = async () => {
    setIsDelete(false);
  };

  // 🔹 Status toggle click → open reason modal
const handleStatusToggleClick = (user) => {
  setCurrentToggleUser(user);
  setReasonModal(true);
  // Clear previous reason
  setBlockReason("");
};
const reasonModalTitle = currentToggleUser
  ? currentToggleUser.status
    ? "Provide Reason to Block User"
    : "Provide Reason to Unblock User"
  : "Provide Reason";

const reasonPlaceholder = currentToggleUser
  ? currentToggleUser.status
    ? "Enter reason for blocking this user"
    : "Enter reason for unblocking this user"
  : "Enter reason";

  // 🔹 Submit block/unblock
  const handleBlockSubmit = async () => {
    if (!currentToggleUser) return;

    try {
      const userId = currentToggleUser._id;
      const token = localStorage.getItem("token"); 
      const status = !currentToggleUser.status; 
      const apiUrl = resolveApiUrl();

      await axios.put(
        `${apiUrl}/admin/updateUserStatus/${userId}`,
        { status, reason: blockReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // refresh users
      await dispatch(fetchUsers(currentPage, 10));

      // reset modal
      setReasonModal(false);
      setBlockReason("");
      setCurrentToggleUser(null);
      toast.success(status ? "User unblocked successfully" : "User blocked successfully");
    } catch (err) {
      console.error("Block/Unblock failed:", err);
      toast.error(err?.response?.data?.message || "Block/unblock API failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!search || search.trim() === "") return;

    await dispatch(searchUsers(search));
    setIsSearch(true);
  };

  const handleClear = async () => {
    setSearch("");
    setIsSearch(false);
    dispatch(fetchUsers(currentPage, 10));
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
      selector: (row) => (row?.status ? "Active" : "Blocked"),
      sortable: true,
      center: true,
    },
    { name: "Time Zone", selector: (row) => row?.timeZone || "N/A", sortable: true, center: true },
    { name: "Created On", selector: (row) => formatDate(row?.createdAt), sortable: true, center: true },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex align-items-center">
          {/* View Button */}
          <button className="btn btn-light p-1 mx-1" onClick={() => handleView(row)} title="View">
            <i className="fa fa-eye" style={{ fontSize: "small", color: "#494949" }}></i>
          </button>

          {/* Status Toggle */}
          <Switch
            onChange={() => handleStatusToggleClick(row)}
            checked={row?.status === true}
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
      {/* Search */}
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
            {isSearch && (
              <Button color="secondary" onClick={handleClear}>
                Clear
              </Button>
            )}
          </div>
        </FormGroup>
      </Form>

      {/* Users Table */}
      <DataTable
        data={users}
        columns={tableColumns}
        striped
        pagination
        paginationServer
        paginationTotalRows={pagination?.totalUsers || 0}
        onChangePage={handlePageChange}
        paginationDefaultPage={currentPage}
        selectableRows
        clearSelectedRows={false}
      />

      {/* View Modal */}
      <ViewModal data={viewData} viewModal={viewModal} setViewModal={setViewModal} />

      {/* Delete Modal */}
      <Delete isDelete={isDelete} setIsDelete={setIsDelete} onDelete={handleConfirmDelete} />

      {/* Reason Modal (Dark themed) */}
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
      type="text"
      placeholder={reasonPlaceholder}
      value={blockReason}
      onChange={(e) => setBlockReason(e.target.value)}
      className="reason-input"
    />
  </ModalBody>
  <ModalFooter>
    <Button color="secondary" onClick={() => setReasonModal(false)}>
      Cancel
    </Button>
    <Button color="primary" onClick={handleBlockSubmit} disabled={!blockReason.trim()}>
      Submit
    </Button>
  </ModalFooter>
</Modal>

    </Fragment>
  );
};

export default DataTableComponent;
