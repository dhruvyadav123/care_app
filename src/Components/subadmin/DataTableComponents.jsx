import React, { Fragment, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Spinner, Col } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { deleteSubAdmin, fetchSubAdmins } from "../../Redux/stateSlice/subAdmin";
import AddSubAdmin from "./addSubAdmin";
import ViewModal from "./view";
import { Btn, H5 } from "../../AbstractElements";
import EditModal from "./editSubAdmin";
import Delete from "../../CommonElements/deleteModal";
import { resolveAssetUrl } from "../../Utils/media";

const getInitials = (name) =>
  String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "SA";

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
        {getInitials(row?.name)}
      </div>
    );
  }

  return (
    <img
      className="img-60 rounded-circle"
      src={avatarUrl}
      alt={row?.name || "Sub admin"}
      onError={() => setHasImageError(true)}
      style={{ objectFit: "cover" }}
    />
  );
};

const DataTableComponent = () => {
  const [viewData, setViewData] = useState("");
  const [editModal, setEditModal] = useState(false);
  const dispatch = useDispatch();
  const { loading, error, users } = useSelector((state) => state.users);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewModal, setViewModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);

  useEffect(() => {
    dispatch(fetchSubAdmins());
  }, [dispatch, currentPage]);

  const EditModaltoggle = (data) => {
    setViewData(data);
    setEditModal(!editModal);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleView = (data) => {
    setViewModal(true);
    setViewData(data);
  };

  const handleDelete = (id) => {
    setDeleteUserId(id);
    setIsDelete(true);
  };

  const handleConfirmDelete = () => {
    if (deleteUserId) {
      dispatch(deleteSubAdmin(deleteUserId)).then(() => {
        dispatch(fetchSubAdmins());
        setIsDelete(false);
      });
    }
  };

  if (loading) {
    return (
      <Col className="vh-100 d-flex align-items-center justify-content-center">
        <div className="loader-box">
          <Spinner className="loader-5" />
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
    { name: "Name", selector: (row) => row.name, sortable: true, center: true },
    { name: "Email", selector: (row) => row.email, sortable: true, center: true },
    {
      name: "Phone",
      selector: (row) => row.phoneNumber,
      sortable: true,
      center: true,
    },
    { name: "Role", selector: (row) => row?.roles?.role, sortable: true, center: true },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex">
          <button className="btn btn-light p-1 mx-1" onClick={() => EditModaltoggle(row)}>
            <i className="fa fa-edit" style={{ fontSize: "small", color: "#494949" }}></i>
          </button>
          <button className="btn btn-light p-1 mx-1" onClick={() => handleView(row)}>
            <i className="fa fa-arrows-alt" style={{ fontSize: "small", color: "#494949" }}></i>
          </button>
          <button className="btn btn-light p-1 mx-1" onClick={() => handleDelete(row._id)}>
            <i className="fa fa-trash-o" style={{ fontSize: "small", color: "#494949" }}></i>
          </button>
        </div>
      ),
    },
  ];

  return (
    <Fragment>
      <div className="d-flex align-items-center justify-content-between p-2">
        <H5 attrH5={{ className: "text-muted m-0" }}>SubAdmin</H5>
        <Btn attrBtn={{ color: "primary", onClick: () => setAddModal(true) }}>Add SubAdmin</Btn>
      </div>
      <DataTable
        data={users}
        columns={tableColumns}
        striped
        pagination
        paginationServer
        onChangePage={handlePageChange}
        paginationDefaultPage={currentPage}
        selectableRows
      />

      <ViewModal data={viewData} ViewModal={viewModal} setViewModal={setViewModal} />
      <AddSubAdmin addModal={addModal} setAddModal={setAddModal} />
      <EditModal data={viewData} editModal={editModal} setEditModal={setEditModal} />
      <Delete
        isDelete={isDelete}
        setIsDelete={setIsDelete}
        onDelete={handleConfirmDelete}
      />
    </Fragment>
  );
};

export default DataTableComponent;
