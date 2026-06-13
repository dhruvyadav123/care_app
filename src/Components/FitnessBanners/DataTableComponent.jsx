import React, { Fragment, useCallback, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Btn, H5, Image, Spinner } from "../../AbstractElements";
import { useDispatch, useSelector } from "react-redux";
import { Col } from "reactstrap";
import { BASE_URL } from "../../Config/AppConstant";
import AddModal from "./AddModal";
import EditModal from "./EditModal";
import { deleteBanner1, fetchBanners1 } from "../../Redux/stateSlice/allFitnessBanners";
import { Link } from "react-router-dom";

const DataTableComponent = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [viewData, setViewData] = useState("");
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const dispatch = useDispatch();
  const { loading, banners1, error, pagination, deleteLoading } = useSelector(
    (state) => state.allbanners
  );
console.log("-0-0-0-", useSelector(
    (state) => state.allbanners
  ))
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchBanners1(currentPage, 10));
  }, [dispatch, currentPage]);

  const handleRowSelected = useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const handleDelete = async (id) => {
    await dispatch(deleteBanner1(id));
    dispatch(fetchBanners1(currentPage, 10)); // Refresh data after delete
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
            className: "img-100 rounded-circle",
            src: `${BASE_URL}/uploads/${row.dashBoardBanner}`,
            alt: row.filename,
          }}
        />
      ),
    },
    { name: "Label", selector: (row) => row.dashBoardBanner, sortable: true },
    {
      name: "Link",
      selector: (row) => row.link,
      cell: (row) => <Link to={row.link} target="_blank">{row.link}</Link>,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      cell: () => <span className="badge badge-light-success">Active</span>,
    },
    {
      name: "Option",
      cell: (row) => (
        <div className="d-flex">
          {/* <button className="btn btn-light p-2 mx-1" onClick={() => handleEditToggle(row)}>
            <i className="fa fa-edit" style={{ fontSize: "large", color: "#494949" }}></i>
          </button> */}
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
        <H5 attrH4={{ className: "text-muted m-0" }}> Banners 1</H5>
        <Btn attrBtn={{ color: "primary", onClick: () => setViewModal(true) }}>
          Add Banner
        </Btn>
      </div>

      <DataTable
        data={banners1}
        columns={tableColumns}
        striped
        pagination
        paginationServer
        paginationTotalRows={pagination?.totalUsers || 0}
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
