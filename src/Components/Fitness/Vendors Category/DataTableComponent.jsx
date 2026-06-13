import React, { Fragment, useCallback, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Btn, H4, H6, Image, Spinner } from "../../../AbstractElements";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser } from "../../../Redux/stateSlice/userReducer";
import { Col } from "reactstrap";
import ViewModal from "./ViewModal";
import { BASE_URL } from "../../../Config/AppConstant";
import EditModal from "./EditModal";
import { fetchFitnessCategories } from "../../../Redux/stateSlice/allFitnessCategory";

const DataTableComponent = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [viewData, setViewData] = useState("");
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();
  const { loading, categories, error } = useSelector((state) => state.fitnessCategory);

  // Fetch categories on component mount and when page changes
  useEffect(() => {
    dispatch(fetchFitnessCategories());
  }, [dispatch, currentPage]);

  const EditModaltoggle = (data) => {
    setViewData(data);
    setEditModal(!editModal);
  };

  const handleRowSelected = useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const handleDelete = async (id) => {
    await dispatch(deleteUser(id)); // Wait for delete to finish
    dispatch(fetchFitnessCategories()); // Refetch categories after delete
  };

  const handleView = (data) => {
    setViewModal(true);
    setViewData(data);
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
    return <p>Error: {typeof error === "string" ? error : JSON.stringify(error)}</p>;
  }

  const CustomOption = ({ row }) => (
    <div className="d-flex">
      <button className="btn btn-light p-2 mx-1" onClick={() => handleView(row)}>
        <i style={{ fontSize: "large", color: "#494949" }} className="fa fa-arrows-alt"></i>
      </button>
      <button className="btn btn-light p-2 mx-1" onClick={() => EditModaltoggle(row)}>
        <i style={{ fontSize: "large", color: "#494949" }} className="fa fa-edit"></i>
      </button>
      <button className="btn btn-light p-2 mx-1" onClick={() => row._id && handleDelete(row._id)}>
        <i style={{ fontSize: "large", color: "#494949" }} className="fa fa-trash-o"></i>
      </button>
    </div>
  );

  const tableColumns = [
    {
      name: "Profile",
      sortable: true,
      center: true,
      cell: (row) =>
        row?.categoryIcon ? (
          <div className="avatar">
            <Image
              attrImage={{
                body: true,
                className: "img-60 rounded-circle",
                src: `${BASE_URL}/uploads/${row.categoryIcon}`, // Corrected image path
                alt: "Category Icon",
              }}
            />
          </div>
        ) : (
          "No Image"
        ),
    },
    {
      name: "Name",
      selector: (row) => row?.name || "N/A",
      sortable: true,
      center: true,
    },
    {
      name: "Label",
      selector: (row) => row?.categoryIcon || "N/A",
      sortable: true,
      center: true,
    },
    {
      name: "Option",
      center: true,
      minWidth: "150px",
      button: true,
      cell: (row) => <CustomOption row={row} />,
    },
  ];

  return (
    <Fragment>
      <DataTable
        data={categories || []}
        columns={tableColumns}
        striped={true}
        center={true}
        pagination
        paginationServer
        onChangePage={handlePageChange}
        paginationDefaultPage={currentPage}
        selectableRows
        onSelectedRowsChange={handleRowSelected}
      />
      <ViewModal data={viewData} viewModal={viewModal} setViewModal={setViewModal} />
      <EditModal data={viewData} editModal={editModal} setEditModal={setEditModal} />
    </Fragment>
  );
};

export default DataTableComponent;
