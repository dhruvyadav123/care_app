import React, { Fragment, useCallback, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Btn, H5, Image, Spinner } from "../../AbstractElements";
import { useDispatch, useSelector } from "react-redux";
import { Col } from "reactstrap";
import { BASE_URL } from "../../Config/AppConstant";
import AddModal from "./AddModal";
import EditModal from "./EditModal";
import { Link } from "react-router-dom";
import { deleteBanner, fetchBanners } from "../../Redux/stateSlice/allHomeBanners";

const DataTableComponent = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [viewData, setViewData] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();

  // Debug Log for Redux State
  const stateData = useSelector((state) => state);
  console.log("Full Redux State:", stateData);

  // Extract banners data
  const { loading, banners = [], error, pagination = {}, deleteLoading } = useSelector(
    (state) => state.homeBanners
  );

  console.log("Banners in useSelector:", banners);

  useEffect(() => {
    console.log("Dispatching fetchBanners...");
    dispatch(fetchBanners(currentPage, 10));
  }, [dispatch, currentPage]);

  useEffect(() => {
    console.log("Updated banners for DataTable:", banners);
  }, [banners]);

  const handleRowSelected = useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const handleDelete = async (id) => {
    await dispatch(deleteBanner(id));
    dispatch(fetchBanners(currentPage, 10));
  };

  const handleEditToggle = (data) => {
    setViewData(data);
    setEditModal(!editModal);
  };

  const tableColumns = [
    {
      name: "Image",
      selector: (row) => row.dashBoardBanner,
      cell: (row) => (
        <Image
          attrImage={{
            className: "img-60 rounded-circle",
            src: row.dashBoardBanner ? `${BASE_URL}/uploads/${row.dashBoardBanner}` : "/placeholder.jpg",
            alt: row.filename || "Banner Image",
          }}
        />
      ),
    },
    { name: "Label", selector: (row) => row.dashBoardBanner || "No Label", sortable: true },
    {
      name: "Status",
      selector: (row) => row.status || "Unknown",
      cell: () => <span className="badge badge-light-success">Active</span>,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex">
          <button className="btn btn-light p-2 mx-1" onClick={() => handleEditToggle(row)}>
            <i className="fa fa-edit" style={{ fontSize: "large", color: "#494949" }}></i>
          </button>
          <button className="btn btn-light p-2 mx-1" onClick={() => handleDelete(row._id)}>
            <i className="fa fa-trash-o" style={{ fontSize: "large", color: "#494949" }}></i>
          </button>
        </div>
      ),
    },
  ];

  if (loading || deleteLoading) {
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

  return (
    <Fragment>
      <div className="d-flex align-items-center justify-content-between p-2">
        <H5 attrH4={{ className: "text-muted m-0" }}>Homepage Banners</H5>
        <Btn attrBtn={{ color: "primary", onClick: () => setViewModal(true) }}>
          Add Banner
        </Btn>
      </div>

      <DataTable
        data={banners}
        columns={tableColumns}
        striped
        pagination
        paginationServer
        paginationTotalRows={pagination?.totalItems || banners.length}
        onChangePage={setCurrentPage}
        selectableRows
        onSelectedRowsChange={handleRowSelected}
      />

      <AddModal viewModal={viewModal} setViewModal={setViewModal} />
      <EditModal category={viewData} editModal={editModal} setEditModal={setEditModal} />
    </Fragment>
  );
};

export default DataTableComponent;
