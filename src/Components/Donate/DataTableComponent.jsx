  import React, { Fragment, useCallback, useEffect, useState } from "react";
  import DataTable from "react-data-table-component";
  import { Btn, H5, Image,Spinner } from "../../AbstractElements";
  import { useDispatch, useSelector } from "react-redux";
  // import { Col } from "reactstrap";
  import AddModal from "./AddModal";
  import EditModal from "./EditModal";
  import DonateDelete from "../../CommonElements/DonateDeleteModal";
  import { fetchEvents, deleteEvent } from "../../Redux/stateSlice/doneListReducer";
  import { Col, Input, Form, FormGroup, Button } from "reactstrap";
  import { resolveAssetUrl } from "../../Utils/media";

  const resolveDonationImage = (item) =>
    resolveAssetUrl(
      item?.imageURL ||
        item?.image ||
        item?.filepath ||
        item?.filePath ||
        item?.icon
    );

  const DataTableComponent = () => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [toggleDelet, setToggleDelet] = useState(false);
    const [viewData, setViewData] = useState("");
    const [viewModal, setViewModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    // 🔍 search states
    const [searchInput, setSearchInput] = useState("");
    const [isSearch, setIsSearch] = useState(false);

    const [isDelete, setIsDelete] = useState(false);
    const [deleteEventId, setDeleteEventId] = useState(null);

    
    // pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const dispatch = useDispatch();
    const stateEvents = useSelector((state) => state.donations);
    console.log("state events", stateEvents);

    const { loading, events, error } = stateEvents;
  // fetch events once (not server paginated)
    useEffect(() => {
      dispatch(fetchEvents()); 
    }, [dispatch]);

    const handleRowSelected = useCallback((state) => {
      setSelectedRows(state.selectedRows);
    }, []);
  useEffect(() => {
    // reset to first page when search input changes
    setCurrentPage(1);
  }, [searchInput]);

    const handleDelete = (id) => {
      setDeleteEventId(id);
      setIsDelete(true);
    };

    const handleConfirmDelete = async () => {
      if (!deleteEventId) return;

      try {
        setIsDelete(false);
        await dispatch(deleteEvent(deleteEventId)).unwrap();
        dispatch(fetchEvents()); // refresh all
        setDeleteEventId(null);
        setSelectedRows([]);
        setToggleDelet((prev) => !prev);
      } catch (err) {
        console.error("Delete failed:", err);
      }
    };

    const EditModaltoggle = (data) => {
      setViewData(data);
      setEditModal(!editModal);
    };

    const Modaltoggle = () => setViewModal(!viewModal);

    const handlePageChange = (page) => {
      setCurrentPage(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
      setPerPage(newPerPage);
      setCurrentPage(page);
    };
    // 🔍 handle search
    const handleSubmit = (e) => {
      e.preventDefault();
      setIsSearch(true);
    };

    const handleClear = () => {
    setSearchInput("");
    setIsSearch(false);
    setCurrentPage(1); // reset page
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
    console.log("Error in event list:", error);

    const CustomOption = ({ row }) => (
      <div className="d-flex">
        {/* Uncomment if edit is required */}
        {/* <button
          className="btn btn-light p-2 mx-1"
          onClick={() => EditModaltoggle(row)}
        >
          <i className="fa fa-edit" style={{ fontSize: "large", color: "#494949" }}></i>
        </button> */}
        <button
          className="btn btn-light p-2 mx-1"
          onClick={() => handleDelete(row._id)}
        >
          <i
            className="fa fa-trash-o"
            style={{ fontSize: "large", color: "#494949" }}
          ></i>
        </button>
      </div>
    );

    const tableColumns = [
      {
            name: "Profile",
            cell: (row) => (
              <div className="avatar">
                {resolveDonationImage(row) ? (
                  <Image
                    attrImage={{
                      body: true,
                      className: "img-40 rounded-circle",
                      src: resolveDonationImage(row),
                      alt: row?.title || "Donation item",
                      onError: (event) => {
                        event.currentTarget.style.display = "none";
                      },
                    }}
                  />
                ) : (
                  <div
                    className="img-40 rounded-circle d-flex align-items-center justify-content-center text-white fw-semibold"
                    style={{ background: "linear-gradient(135deg, #7366ff 0%, #9b8cff 100%)" }}
                  >
                    {String(row?.title || "D").charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            ),
          },
      { name: "Title", selector: (row) => row.title, sortable: true, center: true },
      //   {
      //   name: "Event Date",
      //   selector: (row) => row.eventDate,
      //   sortable: true,
      //   center: true,
      //   cell: (row) => {
      //     if (!row.eventDate) return "-";
      //     const date = new Date(row.eventDate);
      //     return date.toLocaleDateString("en-GB");
      //   },
      // },

      {
        name: "description",
        selector: (row) => row.description,
        sortable: true,
        center: true,
      },
      //  {
      //   name: "isFirstTime",
      //   selector: (row) => row.isFirstTime,
      //   sortable: true,
      //   center: true,
      // },
      //  {
      //   name: "description",
      //   selector: (row) => row.description,
      //   sortable: true,
      //   center: true,
      // },
      // {
      //   name: "Status",
      //   selector: (row) => row.company,
      //   sortable: true,
      //   cell: () => <span className="badge badge-light-success">Active</span>,
      //   center: true,
      // },
      {
        name: "Option",
        center: true,
        minWidth: "150px",
        button: true,
        cell: (row) => <CustomOption row={row} />,
      },
    ];

    // ✅ slice data for client-side pagination
    const allEvents = Array.isArray(events?.donationItems) ? events.donationItems : [];

 const filteredEvents = isSearch
  ? allEvents.filter((ev) =>
      ev.title?.toLowerCase().includes(searchInput.toLowerCase())
    )
  : allEvents;



  const paginatedData = filteredEvents.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );



    return (
      <Fragment>
      <Form
    onSubmit={(e) => {
      e.preventDefault();
      setIsSearch(true); // triggers filtering
    }}
    className="mb-3"
  >
    <FormGroup>
      <div className="d-flex gap-3">
        <Input
          type="text"
          placeholder="Search by title..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{ width: "250px" }}
        />
        <Btn attrBtn={{ color: "primary", type: "submit" }}>Search</Btn>
        {isSearch && (
          <Button
            color="secondary"
            onClick={() => {
              setSearchInput("");   // clear input
              setIsSearch(false);   // reset filter
            }}
          >
            Clear
          </Button>
        )}
      </div>
    </FormGroup>
  </Form>



      <DataTable
        data={paginatedData}
        columns={tableColumns}
        striped
        center
        pagination
        paginationServer={true}   
        paginationTotalRows={filteredEvents.length}
        paginationPerPage={perPage}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePerRowsChange}
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

        <DonateDelete
          isDelete={isDelete}
          setIsDelete={setIsDelete}
          onDelete={handleConfirmDelete}
        />
      </Fragment>
    );
  };

  export default DataTableComponent;
