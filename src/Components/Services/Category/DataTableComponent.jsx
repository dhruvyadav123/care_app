import React, { Fragment, useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { Col } from "reactstrap";
import { Btn, Spinner } from "../../../AbstractElements";
import AddModal from "./AddModal";
import EditModal from "./EditModal";
import { deleteServiceCategory, fetchServiceCategories, setServiceCategoryType } from "../../../Redux/stateSlice/serviceCategoryReducer";
import { resolveAssetUrl } from "../../../Utils/media";

const normalizeBoolean = (value) => {
  if (typeof value === "boolean") {
    return value;
  }

  return String(value || "").toLowerCase() === "true";
};

const CategoryIcon = ({ row }) => {
  const [failed, setFailed] = useState(false);
  const iconSource = resolveAssetUrl(row?.icon || row?.categoryIcon);

  if (!iconSource || failed) {
    return <span className="text-muted">N/A</span>;
  }

  return (
    <img
      src={iconSource}
      alt={row?.name || "Category"}
      className="rounded"
      style={{ width: "52px", height: "52px", objectFit: "cover" }}
      onError={() => setFailed(true)}
    />
  );
};

const DataTableComponent = () => {
  const dispatch = useDispatch();
  const { loading, serviceCategories, error, pagination, activeType } = useSelector((state) => state.serviceCategories);

  const [currentPage, setCurrentPage] = useState(1);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    dispatch(fetchServiceCategories(currentPage, 10, { type: activeType || "product" }));
  }, [dispatch, currentPage, activeType]);

  const toggleAddModal = () => setAddModalOpen((prevState) => !prevState);
  const toggleEditModal = () => setEditModalOpen((prevState) => !prevState);

  const handleDelete = async (categoryId) => {
    const confirmed = window.confirm("Are you sure you want to delete this category?");
    if (!confirmed) {
      return;
    }

    const response = await dispatch(deleteServiceCategory(categoryId));
    if (response?.success) {
      dispatch(fetchServiceCategories(currentPage, 10, { type: activeType || "product" }));
    }
  };

  const tableColumns = useMemo(
    () => [
      {
        name: "Icon",
        center: true,
        cell: (row) => <CategoryIcon row={row} />,
      },
      {
        name: "Name",
        selector: (row) => row?.name || "N/A",
        sortable: true,
      },
      {
        name: "Type",
        selector: (row) => row?.type || "N/A",
        sortable: true,
        center: true,
        cell: (row) => <span className="text-capitalize">{row?.type || "N/A"}</span>,
      },
      {
        name: "Parent Category",
        selector: (row) => row?.categoryId?.name || row?.parentCategoryId?.name || "N/A",
        sortable: true,
        center: true,
      },
      {
        name: "Status",
        center: true,
        cell: (row) => (
          <span className={`badge badge-light-${normalizeBoolean(row?.isActive) ? "success" : "danger"}`}>
            {normalizeBoolean(row?.isActive) ? "Active" : "Inactive"}
          </span>
        ),
      },
      {
        name: "Option",
        center: true,
        minWidth: "150px",
        cell: (row) => (
          <div className="d-flex">
            <button
              className="btn btn-light p-2 mx-1"
              onClick={() => {
                setSelectedCategory(row);
                setEditModalOpen(true);
              }}
            >
              <i style={{ fontSize: "large", color: "#494949" }} className="fa fa-edit"></i>
            </button>
            <button className="btn btn-light p-2 mx-1" onClick={() => handleDelete(row._id)}>
              <i style={{ fontSize: "large", color: "#494949" }} className="fa fa-trash-o"></i>
            </button>
          </div>
        ),
      },
    ],
    [activeType, currentPage]
  );

  if (loading && !serviceCategories?.length && !addModalOpen && !editModalOpen) {
    return (
      <Col className="vh-100 d-flex align-items-center justify-content-center">
        <div className="loader-box">
          <Spinner attrSpinner={{ className: "loader-5" }} />
        </div>
      </Col>
    );
  }

  return (
    <Fragment>
      <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap p-2">
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <h5 className="text-muted m-0">Category Manager</h5>
          <select
            className="form-select"
            value={activeType || "product"}
            style={{ width: "170px" }}
            onChange={(event) => {
              setCurrentPage(1);
              dispatch(setServiceCategoryType(event.target.value));
            }}
          >
            <option value="product">Product Categories</option>
            <option value="service">Service Categories</option>
            <option value="all">All Categories</option>
          </select>
        </div>
        <Btn attrBtn={{ color: "primary", onClick: toggleAddModal }}>Add Category</Btn>
      </div>

      {error ? <p className="text-danger px-2">{error}</p> : null}

      {loading && (serviceCategories?.length || addModalOpen || editModalOpen) ? (
        <div className="px-2 pb-2">
          <span className="text-muted">Loading categories...</span>
        </div>
      ) : null}

      <DataTable
        data={serviceCategories || []}
        columns={tableColumns}
        striped
        center
        pagination
        paginationServer
        paginationTotalRows={pagination?.total || pagination?.totalCategories || serviceCategories?.length || 0}
        onChangePage={setCurrentPage}
        paginationDefaultPage={currentPage}
        noDataComponent={<div className="text-center p-4">No categories found</div>}
      />

      <AddModal isOpen={addModalOpen} toggle={toggleAddModal} categoryType={activeType || "product"} />

      <EditModal
        category={selectedCategory}
        isOpen={editModalOpen}
        toggle={() => {
          toggleEditModal();
          setSelectedCategory(null);
        }}
        categoryType={activeType || "product"}
      />
    </Fragment>
  );
};

export default DataTableComponent;
