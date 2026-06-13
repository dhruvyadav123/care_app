import React, { Fragment, useCallback, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Btn, H4, H5, H6, Image, Spinner } from "../../AbstractElements";
import { useDispatch, useSelector } from "react-redux";
import { Col } from "reactstrap";
import {
  deleteCategory,
  fetchCategories,
} from "../../Redux/stateSlice/socialmeetCategoryReducer";
import AddModal from "./AddModal";
import EditModal from "./EditModal";
import { fetchServices } from "../../Redux/stateSlice/servicesReducer";
import { resolveAssetUrl } from "../../Utils/media";

const ServiceImage = ({ row }) => {
  const [failed, setFailed] = useState(false);
  const imageSource = resolveAssetUrl(row?.image);

  if (!imageSource || failed) {
    return <span className="text-muted">N/A</span>;
  }

  return (
    <div className="avatar">
      <Image
        attrImage={{
          body: true,
          className: "img-60 rounded-circle",
          src: imageSource,
          alt: row?.name || "Service",
          onError: () => setFailed(true),
        }}
      />
    </div>
  );
};

const DataTableComponent = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleDelet, setToggleDelet] = useState(false);
  const [viewData, setViewData] = useState("");
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const dispatch = useDispatch();
  const { loading, services, error, pagination } = useSelector(
    (state) => state.services
  );

  const [currentPage, setCurrentPage] = useState(1);

  const EditModaltoggle = (data) => {
    setViewData(data);
    setEditModal(!editModal);
  };
  const Modaltoggle = () => setViewModal(!viewModal);

  useEffect(() => {
    dispatch(fetchServices(currentPage, 10));
  }, [dispatch, currentPage]);

  const handleRowSelected = useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const handleDelete = (id) => {
    // dispatch(deleteCategory(id));
  };

  const handleView = (data) => {
    console.log(data);
    setViewModal(true);
    setViewData(data);
  };
  const handleEdit = (data) => {
    // console.log(data)
    // dispatch(editUser(id, updatedData));
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

  const CustomOption = ({ row, handleDelete, handleEdit }) => (
    <div className="d-flex">
      {/* <button
        className="btn btn-light p-2 mx-1"
        onClick={() => handleView(row)}
      >
        <i
          style={{ fontSize: "large", color: "#494949" }}
          className="fa fa-arrows-alt"
        ></i>
      </button> */}
      <button
        className="btn btn-light p-2 mx-1"
        onClick={() => EditModaltoggle(row)}
      >
        <i
          style={{ fontSize: "large", color: "#494949" }}
          className="fa fa-edit"
        ></i>
      </button>
      <button
        className="btn btn-light p-2 mx-1"
        onClick={() => handleDelete(row._id)}
      >
        <i
          style={{ fontSize: "large", color: "#494949" }}
          className="fa fa-trash-o"
        ></i>
      </button>
    </div>
  );

  const tableColumns = [
    {
      name: "Image",
      selector: (row) => `${row.date}`,
      sortable: true,
      center: false,
      cell: (row) => <ServiceImage row={row} />,
    },
    {
      name: "Name",
      selector: (row) => `${row.name}`,
      sortable: true,
      center: true,
    },
    {
      name: "Address",
      selector: (row) => `${row.address}`,
      sortable: true,
      center: true,
    },
    {
      name: "Category",
      selector: (row) => `${row.serviceCategoryId?.name ?row.serviceCategoryId?.name:'N/A' }`,
      sortable: true,
      center: true,
    },
    {
      name: "Approved By",
      selector: (row) => `${row.approved_by?.name ?row.approved_by?.name:'N/A' }`,
      sortable: true,
      center: true,
    },
    {
      name: "Status",
      selector: (row) => `${row.status}`,
      sortable: true,
      // maxWidth: "100px",
      cell: (row) => <span className={`badge badge-light-${row.status==='1'?'success':'danger'}`}>{row.status === '1' ? 'Active':'Deactive'}</span>,
    },
    {
      name: "Option",
      center: true,
      minWidth: "150px",
      button: true,
      cell: (row) => (
        <CustomOption
          row={row}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
      ),
    },
  ];

  return (
    <Fragment>
      <div className={`d-flex align-items-center justify-content-between p-2`}>
        <H5 attrH4={{ className: "text-muted m-0" }}>Services</H5>
        <Btn attrBtn={{ color: "primary" }}>
          Add Service
        </Btn>
      </div>

      <DataTable
        data={services}
        columns={tableColumns}
        striped={true}
        center={true}
        pagination
        paginationServer
        paginationTotalRows={pagination?.totalServices || 0}
        onChangePage={handlePageChange}
        paginationDefaultPage={currentPage}
        selectableRows
        onSelectedRowsChange={handleRowSelected}
        clearSelectedRows={toggleDelet}
      />
      <AddModal
        viewModal={viewModal}
        setViewModal={setViewData}
        Modaltoggle={Modaltoggle}
      />
      <EditModal
        category={viewData}
        editModal={editModal}
        setEditModal={setEditModal}
        EditModaltoggle={EditModaltoggle}
      />
    </Fragment>
  );
};

export default DataTableComponent;
