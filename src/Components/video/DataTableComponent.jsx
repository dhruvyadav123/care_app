import React, { Fragment, useCallback, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Btn, H5, Spinner } from "../../AbstractElements";
import { useDispatch, useSelector } from "react-redux";
import { Col } from "reactstrap";
import { BASE_URL } from "../../Config/AppConstant";
import AddModal from "./AddModal";
import EditModal from "./EditModal";
import { fetchFitnessVideos } from "../../Redux/stateSlice/videoReducer";

const DataTableComponent = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [viewData, setViewData] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();
  const { loading, videos, error } = useSelector((state) => state.fitnessVideos);

  useEffect(() => {
    dispatch(fetchFitnessVideos({ page: currentPage, limit: 10 }));
  }, [dispatch, currentPage]);

  const handleRowSelected = useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const handleEditToggle = (data) => {
    setViewData(data);
    setEditModal(true);
  };

  const handleEditModalClose = () => {
    setEditModal(false);
  };

  const tableColumns = [
    {
      name: "Category Icon",
      cell: (row) => {
        const icon = row.fitnessCategoryId?.categoryIcon;
        return icon ? (
          <img
            src={`${BASE_URL}/uploads/${icon}`}
            alt={row.fitnessCategoryId?.name || "Category"}
            style={{ width: "40px", height: "40px", borderRadius: "50%" }}
            onError={(e) => { e.target.src = "/default-icon.png"; }}
          />
        ) : (
          <span>No Icon</span>
        );
      },
    },
    { name: "Category Name", selector: (row) => row.videoCategoryName || "N/A", sortable: true },
    { name: "Tags", cell: (row) => <span>{row.videoCategoryTags?.join(", ") || "N/A"}</span> },
    {
      name: "Option",
      cell: (row) => (
        <div className="d-flex">
          <button className="btn btn-light p-2 mx-1" onClick={() => handleEditToggle(row)}>
            <i className="fa fa-edit" style={{ fontSize: "large", color: "#494949" }}></i>
          </button>
        </div>
      ),
    },
  ];

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
    return <p className="text-danger text-center">Error: {error}</p>;
  }

  return (
    <Fragment>
      <div className="d-flex align-items-center justify-content-between p-2">
        <H5 attrH4={{ className: "text-muted m-0" }}>Fitness Video Categories</H5>
        <Btn attrBtn={{ color: "primary", onClick: () => setViewModal(true) }}>
          Add Category
        </Btn>
      </div>

      <DataTable
        data={videos.length > 0 ? videos : []}
        columns={tableColumns}
        striped
        pagination
        paginationServer
        onChangePage={setCurrentPage}
        selectableRows
        onSelectedRowsChange={handleRowSelected}
      />

      <AddModal viewModal={viewModal} setViewModal={setViewModal} />
      <EditModal category={viewData} editModal={editModal} setEditModal={handleEditModalClose} />
    </Fragment>
  );
};

export default DataTableComponent;
