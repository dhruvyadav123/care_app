import React, { Fragment, useCallback, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Btn, H4, H5, H6, Image, Spinner } from "../../AbstractElements";
import { useDispatch, useSelector } from "react-redux";
import { Col } from "reactstrap";
import { BASE_URL } from "../../Config/AppConstant";
import AddModal from "./AddModal";
import EditModal from "./EditModal";
import { Link } from "react-router-dom";
import { deleteGame, fetchGames } from "../../Redux/stateSlice/allGames";
import { fetchEvents } from "../../Redux/stateSlice/eventListReducer";

const DataTableComponent = () => {
  console.log("sdbjsdc sd ")
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleDelet, setToggleDelet] = useState(false);
  const [viewData, setViewData] = useState("");
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const dispatch = useDispatch();
  const { loading, events, error, pagination } = useSelector(
    (state) => state.events
  );
  console.log(events, "This is events in eventlist useselector")

  const [currentPage, setCurrentPage] = useState(1);

  const EditModaltoggle = (data) => {console.log('first',data)
    setViewData(data);
    setEditModal(!editModal);
  };
  const Modaltoggle = () => setViewModal(!viewModal);

  useEffect(() => {
    dispatch(fetchEvents(currentPage, 10)); // Fetch users for the current page with a limit of 10
  }, [dispatch, currentPage]);

  const handleRowSelected = useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const handleDelete = (id) => {
    dispatch(deleteGame(id));
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
      name: "Id",
      selector: (row) => `${row._id}`,
      sortable: true,
      center: true,
    },
    {
      name: "Image",
      selector: (row) => `${row.date}`,
      sortable: true,
      center: false,
      cell: (row) => (
        <div className="avatar">
          <Image
            attrImage={{
              body: true,
              className: "img-60 rounded-circle",
              src: `${BASE_URL}${row?.attachment}`,
              alt: `${row?.filename}`,
            }}
          />
        </div>
      ),
    },
    {
      name: "Title",
      selector: (row) => `${row.title}`,
      sortable: true,
      center: true,
    },
    {
      name: "Event Date",
      selector: (row) => `${row.eventDate}`,
      sortable: true,
      center: true,
    },
    {
      name: "Event Time",
      selector: (row) => `${row.eventTime}`,
      sortable: true,
      center: true,
    },
    // {
    //   name: "Link",
    //   selector: (row) => `${row.link}`,
    //   sortable: true,
    //   // center: true,
      
    //   cell: (row) => <Link to={`${row.link}`} className="" target="blank">{row.link}</Link>,
    // },
    {
      name: "Status",
      selector: (row) => `${row.company}`,
      sortable: true,
      // maxWidth: "100px",
      cell: (row) => <span className="badge badge-light-success">Active</span>,
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
        <H5 attrH4={{ className: "text-muted m-0" }}>Categery</H5>
        <Btn attrBtn={{ color: "primary", onClick: () => Modaltoggle() }}>
          Add Categery
        </Btn>
      </div>

      <DataTable
        data={events}
        columns={tableColumns}
        striped={true}
        center={true}
        pagination
        paginationServer
        paginationTotalRows={pagination?.totalUsers || 0}
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
