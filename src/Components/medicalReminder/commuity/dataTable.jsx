import React, { Fragment, useCallback, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Spinner, Col } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { H5, Btn, Image } from "../../../AbstractElements";
import { deleteCommunity, fetchCommunity } from "../../../Redux/stateSlice/community";
import { BASE_URL } from "../../../Config/AppConstant";
import ViewModal from "./view";
import AddCommunity from "./create";
import Delete from "../../../CommonElements/deleteModal";

const DataTables = () => {
  const [selectedRows, setSelectedRows] = useState  ([]);
  const [toggleDelet, setToggleDelet] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [isDelete, setIsDelete] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [viewData, setViewData] = useState("");
  const [viewModal, setViewModal] = useState(false);

  const dispatch = useDispatch();
  const { communities, error, loading, pagination } = useSelector((state) => state.community);
console.log("datattata",useSelector((state) => state.community))
  // Fetch communities when page or editModal changes
  useEffect(() => {
    dispatch(fetchCommunity(currentPage));
  }, [dispatch, currentPage, editModal]);

  // Debug logs
  useEffect(() => {
    console.log("Communities from Redux:", communities);
    console.log("Pagination from Redux:", pagination);
    console.log("Error:", error);
  }, [communities, pagination, error]);

  const handleRowSelected = useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = (id) => {
    setDeleteUserId(id);
    setIsDelete(true);
  };

  const EditModaltoggle = (data) => {
    setViewData(data);
    setEditModal(!editModal);
  };

  const handleConfirmDelete = () => {
    if (deleteUserId) {
      dispatch(deleteCommunity(deleteUserId)).then(() => {
        dispatch(fetchCommunity(currentPage));
        setIsDelete(false);
      });
    }
  };

  const handleView = (data) => {
    setViewModal(true);
    setViewData(data);
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

//   if (error) {
//     console.log("asasas",error)
//     return <p className="text-danger">Error: {error}</p>;
//   }

  // Define table columns
  const tableColumns = [
    { name: "Name", selector: (row) => row?.name || "-", sortable: true, center: true },
    { name: "Creator", selector: (row) => row?.creator?.name || "-", sortable: true, center: true },
    { name: "Category", selector: (row) => row?.category?.name || "-", sortable: true, center: true },
    { name: "Type", selector: (row) => row?.type || "-", sortable: true, center: true },
    { name: "Status", selector: (row) => row?.status || "-", sortable: true, center: true },
    {
      name: "Hobbies",
      selector: (row) => (row?.hobbies?.length ? row.hobbies.join(", ") : "-"),
      sortable: true,
      center: true,
    },
    {
      name: "Members",
      selector: (row) =>
        row?.members?.length ? row.members.map((res) => res.name).join(", ") : "-",
      sortable: true,
      center: true,
    },
    {
      name: "Community Logo",
      cell: (row) =>
        row?.communityLogo ? (
          <div className="avatar">
            <Image
              attrImage={{
                body: true,
                className: "img-60 rounded-circle",
                src: `${BASE_URL}/uploads/${row?.communityLogo}`,
                alt: "logo",
              }}
            />
          </div>
        ) : (
          "-"
        ),
      center: true,
    },
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
        <H5 attrH5={{ className: "text-muted m-0" }}>Community</H5>
        <Btn attrBtn={{ color: "primary", onClick: () => setAddModal(true) }}>Add Community</Btn>
      </div>
{/* 
      <DataTable
        data={communities || []} // ✅ ensure array
        columns={tableColumns}
        striped
        pagination
        paginationServer
        paginationTotalRows={pagination?.total || (communities ? communities.length : 0)} // ✅ fallback
        onChangePage={handlePageChange}
        paginationDefaultPage={currentPage}
        selectableRows
        onSelectedRowsChange={handleRowSelected}
        clearSelectedRows={toggleDelet}
      /> */}

      {/* Modals */}
      <Delete isDelete={isDelete} setIsDelete={setIsDelete} onDelete={handleConfirmDelete} />
      <AddCommunity addModal={addModal} setAddModal={setAddModal} />
      <ViewModal data={viewData} viewModal={viewModal} setViewModal={setViewModal} />
    </Fragment>
  );
};

export default DataTables;
