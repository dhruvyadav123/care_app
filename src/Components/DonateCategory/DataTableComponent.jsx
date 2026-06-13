import React, { Fragment, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Btn, Image, Spinner } from "../../AbstractElements";
import { useDispatch, useSelector } from "react-redux";
import AddModal from "./AddModal";
import EditDonationModal from "./EditDonationModal";
import DonateDelete from "../../CommonElements/DonateDeleteModal";
import { fetchEvent, deleteEvent2 } from "../../Redux/stateSlice/doneListReducer";
import { Col, Input, Form, FormGroup, Button } from "reactstrap";
import { API_URL } from "../../Config/AppConstant";
import { resolveAssetUrl } from "../../Utils/media";

const resolveCategoryImage = (category) =>
  resolveAssetUrl(
    category?.imageURL ||
      category?.imageUrl ||
      category?.filepath ||
      category?.image ||
      category?.icon ||
      category?.filePath ||
      category?.file_path ||
      category
  );

const DataTableComponent = () => {
  const dispatch = useDispatch();
  const stateEvents = useSelector((state) => state.donations);
  const { loading } = stateEvents;

  const [categories, setCategories] = useState([]);
  const [toggleDelet, setToggleDelet] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [isSearch, setIsSearch] = useState(false);

  const [isDelete, setIsDelete] = useState(false);
  const [deleteEventId, setDeleteEventId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // fetch donation categories
  const fetchCategories = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. Please log in again.");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/donationCategory`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = (id) => {
    setDeleteEventId(id);
    setIsDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteEventId) return;
    try {
      setIsDelete(false);
      await dispatch(deleteEvent2(deleteEventId)).unwrap(); // Redux delete
      dispatch(fetchEvent());
      setDeleteEventId(null);
      setToggleDelet((prev) => !prev);
      fetchCategories();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const EditModaltoggle = (category) => {
    setViewData(category);
    setEditModal(!editModal);
  };

  const filteredCategories = isSearch
    ? categories.filter((c) => c.name.toLowerCase().includes(searchInput.toLowerCase()))
    : categories;

  const paginatedData = filteredCategories.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const tableColumns = [
    {
      name: "Profile",
      cell: (row) => (
        <div className="avatar">
          {resolveCategoryImage(row) ? (
            <Image
              attrImage={{
                body: true,
                className: "img-40 rounded-circle",
                src: resolveCategoryImage(row),
                alt: row?.name || "Category",
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
              {String(row?.name || "C").charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      ),
    },
    { name: "Name", selector: (row) => row.name, sortable: true, center: true },
    {
      name: "Option",
      center: true,
      minWidth: "150px",
      button: true,
      cell: (row) => (
        <div className="d-flex">
          <button className="btn btn-light p-2 mx-1" onClick={() => EditModaltoggle(row)}>
            <i className="fa fa-edit" style={{ fontSize: "large", color: "#494949" }}></i>
          </button>
          <button className="btn btn-light p-2 mx-1" onClick={() => handleDelete(row._id)}>
            <i className="fa fa-trash-o" style={{ fontSize: "large", color: "#494949" }}></i>
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <Col className="vh-100 d-flex align-items-center justify-content-center">
        <Spinner attrSpinner={{ className: "loader-5" }} />
      </Col>
    );
  }

  return (
    <Fragment>
      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-start mb-3">
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            setIsSearch(true);
            setCurrentPage(1);
          }}
          className="mb-0"
        >
          <FormGroup className="mb-0">
            <div className="d-flex flex-wrap gap-3">
              <Input
                type="text"
                placeholder="Search by name..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{ width: "250px" }}
              />
              <Btn attrBtn={{ color: "primary", type: "submit" }}>Search</Btn>
              {isSearch && (
                <Button
                  color="secondary"
                  onClick={() => {
                    setSearchInput("");
                    setIsSearch(false);
                    setCurrentPage(1);
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          </FormGroup>
        </Form>

        <Btn attrBtn={{ color: "primary", onClick: () => setViewModal(true) }}>
          Add Category
        </Btn>
      </div>

      <DataTable
        data={paginatedData}
        columns={tableColumns}
        striped
        center
        pagination
        paginationServer
        paginationTotalRows={filteredCategories.length}
        paginationPerPage={perPage}
        onChangePage={(page) => setCurrentPage(page)}
        onChangeRowsPerPage={(newPerPage, page) => {
          setPerPage(newPerPage);
          setCurrentPage(page);
        }}
        paginationDefaultPage={currentPage}
        selectableRows
        clearSelectedRows={toggleDelet}
      />

      <AddModal
        viewModal={viewModal}
        Modaltoggle={() => setViewModal(!viewModal)}
        refreshCategories={fetchCategories}
      />

      {viewData && (
        <EditDonationModal
          category={viewData}
          editModal={editModal}
          EditModaltoggle={() => setEditModal(!editModal)}
          refreshCategories={fetchCategories}
        />
      )}

      <DonateDelete
        isDelete={isDelete}
        setIsDelete={setIsDelete}
        onDelete={handleConfirmDelete}
      />
    </Fragment>
  );
};

export default DataTableComponent;
