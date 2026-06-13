import React, { Fragment, useCallback, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Btn, H4, H6, Image, Spinner } from "../../AbstractElements";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersNew, toggleUserStatus } from "../../Redux/stateSlice/allUsers"; 
import { Col } from "reactstrap";
import ViewModal from "./ViewModal";
import EditModal from "./EditModal";
import { BASE_URL } from "../../Config/AppConstant";
import { deleteUser } from "../../Redux/stateSlice/userReducer";
import Switch from "react-switch";

const DataTableComponent = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleDelet, setToggleDelet] = useState(false);
  const [viewData, setViewData] = useState("");
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const dispatch = useDispatch();

  const { loading, error, pagination, allUsers } = useSelector(
    (state) => state.allUsers
  );

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchUsersNew(currentPage, 10));
  }, [dispatch, currentPage]);

  const EditModaltoggle = (data) => {
    setViewData(data);
    setEditModal(!editModal);
  };

  const handleRowSelected = useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const handleDelete = (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this user?");
    if (isConfirmed) {
      dispatch(deleteUser(id));
      dispatch(fetchUsersNew(currentPage, 10));
    }
  };

  const handleView = (data) => {
    setViewModal(true);
    setViewData(data);
  };

  const handleStatusToggle = (id, currentStatus) => {
    dispatch(toggleUserStatus({ id, status: !currentStatus }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
          <Image
            attrImage={{
              body: true,
              className: "img-60 rounded-circle",
              src: `${BASE_URL}/uploads/${row?.avatar}`,
              alt: "#",
            }}
          />
        </div>
      ),
    },
    { name: "Name", selector: (row) => row.name, sortable: true, center: true },
    { name: "Email", selector: (row) => row.email, sortable: true, center: true },
    { name: "Phone", selector: (row) => row.phoneNumber, sortable: true, center: true },
    { name: "DOB", selector: (row) => row.dob, sortable: true, center: true },
    {
      name: "Status",
      cell: (row) => (
        <Switch
          onChange={() => handleStatusToggle(row._id, row.status)}
          checked={row.status}
          offColor="#dc3545"
          onColor="#28a745"
          uncheckedIcon={false}
          checkedIcon={false}
          height={20}
          width={40}
        />
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex">
          <button className="btn btn-light p-1 mx-1" onClick={() => handleView(row)}>
            <i className="fa fa-arrows-alt" style={{ fontSize: "small", color: "#494949" }}></i>
          </button>
          <button className="btn btn-light p-1 mx-1" onClick={() => EditModaltoggle(row)}>
            <i className="fa fa-edit" style={{ fontSize: "small", color: "#494949" }}></i>
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
      <DataTable
        data={allUsers}
        columns={tableColumns}
        striped
        pagination
        paginationServer
        paginationTotalRows={pagination?.totalUsers || 0}
        onChangePage={handlePageChange}
        paginationDefaultPage={currentPage}
        selectableRows
        onSelectedRowsChange={handleRowSelected}
        clearSelectedRows={toggleDelet}
      />
      <ViewModal data={viewData} viewModal={viewModal} setViewModal={setViewModal} />
      <EditModal data={viewData} editModal={editModal} setEditModal={setEditModal} />
    </Fragment>
  );
};

export default DataTableComponent;
