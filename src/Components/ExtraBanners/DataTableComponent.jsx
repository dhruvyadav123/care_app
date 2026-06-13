import React, { Fragment, useCallback, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Btn, H4, H5, H6, Image, Spinner } from "../../AbstractElements";
import { useDispatch, useSelector } from "react-redux";
import { Col } from "reactstrap";
import { BASE_URL } from "../../Config/AppConstant";
import AddModal from "./AddModal";
import EditModal from "./EditModal";
import { fetchGames,deleteGame } from "../../Redux/stateSlice/gamesReducer";
import { Link } from "react-router-dom";
import homeBannersService from "../../Services/homeBanner";

const DataTableComponent = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleDelet, setToggleDelet] = useState(false);
  const [viewData, setViewData] = useState("");
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [bannerData, setBannerData] = useState([])

  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);

  const EditModaltoggle = (data) => {console.log('first',data)
    setViewData(data);
    setEditModal(!editModal);
  };
  const Modaltoggle = () => setViewModal(!viewModal);

  useEffect(() => {
    dispatch(fetchGames(currentPage, 10)); // Fetch users for the current page with a limit of 10
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


  
  const fetchBanner = () => {
    homeBannersService
      .getAll()
      .then((res) => {
        console.log(res);
        setBannerData(res);
      });
  };

  useEffect(() => {
    fetchBanner()
  }, [])

  // if (loading) {
  //   return (
  //     <Col className="vh-100 d-flex align-items-center justify-content-center">
  //       <div className="loader-box">
  //         <Spinner attrSpinner={{ className: "loader-5" }} />
  //       </div>
  //     </Col>
  //   );
  // }

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
      cell: (row) => (
        <div className="avatar">
          <Image
            attrImage={{
              body: true,
              className: "img-60 rounded-circle",
              src: `${BASE_URL}/uploads/${row?.dashBoardBanner}`,
              alt: `${row?.filename}`,
            }}
          />
        </div>
      ),
    },
    {
      name: "Name",
      selector: (row) => `${row?.dashBoardBanner}`,
      sortable: true,
      center: true,
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
        <H5 attrH4={{ className: "text-muted m-0" }}>Home Banner</H5>
        <Btn attrBtn={{ color: "primary", onClick: () => Modaltoggle() }}>
          Add Banner
        </Btn>
      </div>

      <DataTable
        data={bannerData}
        columns={tableColumns}
        striped={true}
        center={true}
        pagination
        paginationServer
        paginationTotalRows={ 0}
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
