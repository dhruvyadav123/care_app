import React, { Fragment, useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Col } from "reactstrap";
import { Btn, Spinner } from "../../AbstractElements";
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from "../../Redux/stateSlice/productReducer";
import { getProductImageFallbackLabel, getProductImageSource } from "../../Utils/productImage";
import ProductModal from "./ProductModal";

const normalizeBoolean = (value) => {
  if (typeof value === "boolean") {
    return value;
  }

  return String(value || "").toLowerCase() === "true";
};

const ProductImageCell = ({ row }) => {
  const [failed, setFailed] = useState(false);
  const imageSource = getProductImageSource(row);
  const fallbackLabel = getProductImageFallbackLabel(row);

  if (!imageSource || failed) {
    return (
      <div
        className="rounded d-flex align-items-center justify-content-center text-white"
        style={{
          width: "52px",
          height: "52px",
          fontSize: "18px",
          fontWeight: 600,
          background: "linear-gradient(135deg, #16a34a 0%, #0ea5e9 100%)",
        }}
      >
        {fallbackLabel}
      </div>
    );
  }

  return (
    <img
      src={imageSource}
      alt={row?.name || "Product"}
      className="rounded"
      style={{ width: "52px", height: "52px", objectFit: "cover" }}
      onError={() => setFailed(true)}
    />
  );
};

const DataTableComponent = () => {
  const dispatch = useDispatch();
  const { products, pagination, loading, submitting, error } = useSelector((state) => state.products);

  const [currentPage, setCurrentPage] = useState(1);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts({ page: currentPage, limit: 10 }));
  }, [dispatch, currentPage]);

  const toggleAddModal = () => setAddModalOpen((prevState) => !prevState);
  const toggleEditModal = () => setEditModalOpen((prevState) => !prevState);

  const handleCreateProduct = async (payload) => {
    const response = await dispatch(createProduct(payload));
    if (!response.error) {
      setAddModalOpen(false);
      dispatch(fetchProducts({ page: currentPage, limit: 10 }));
    }
  };

  const handleUpdateProduct = async (payload) => {
    if (!selectedProduct?._id) {
      return;
    }

    const response = await dispatch(updateProduct({ productId: selectedProduct._id, payload }));
    if (!response.error) {
      setEditModalOpen(false);
      setSelectedProduct(null);
      dispatch(fetchProducts({ page: currentPage, limit: 10 }));
    }
  };

  const handleDeleteProduct = async (productId) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) {
      return;
    }

    const response = await dispatch(deleteProduct(productId));
    if (!response.error) {
      dispatch(fetchProducts({ page: currentPage, limit: 10 }));
    }
  };

  const tableColumns = useMemo(
    () => [
      {
        name: "Image",
        center: true,
        cell: (row) => <ProductImageCell row={row} />,
      },
      {
        name: "Name",
        selector: (row) => row?.name || "N/A",
        sortable: true,
        center: true,
      },
      {
        name: "Category",
        selector: (row) => row?.categoryId?.name || row?.serviceCategoryId?.name || "N/A",
        sortable: true,
        center: true,
      },
      {
        name: "Price",
        selector: (row) => row?.price ?? 0,
        sortable: true,
        center: true,
        cell: (row) => <span>Rs. {row?.price ?? 0}</span>,
      },
      {
        name: "Stock",
        selector: (row) => row?.stock ?? 0,
        sortable: true,
        center: true,
      },
      {
        name: "Condition",
        selector: (row) => row?.condition || "N/A",
        sortable: true,
        center: true,
        cell: (row) => <span className="text-capitalize">{row?.condition || "N/A"}</span>,
      },
      {
        name: "Status",
        center: true,
        cell: (row) => (
          <span className={`badge badge-light-${normalizeBoolean(row?.isAvailable) ? "success" : "danger"}`}>
            {normalizeBoolean(row?.isAvailable) ? "Available" : "Unavailable"}
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
                setSelectedProduct(row);
                setEditModalOpen(true);
              }}
            >
              <i style={{ fontSize: "large", color: "#494949" }} className="fa fa-edit"></i>
            </button>
            <button className="btn btn-light p-2 mx-1" onClick={() => handleDeleteProduct(row._id)}>
              <i style={{ fontSize: "large", color: "#494949" }} className="fa fa-trash-o"></i>
            </button>
          </div>
        ),
      },
    ],
    []
  );

  if (loading) {
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
      <div className="d-flex align-items-center justify-content-between p-2">
        <h5 className="text-muted m-0">Products</h5>
        <div className="d-flex align-items-center gap-2">
          <Link to={`${process.env.PUBLIC_URL}/services/category`} className="btn btn-light">
            Manage Categories
          </Link>
          <Btn attrBtn={{ color: "primary", onClick: toggleAddModal }}>Add Product</Btn>
        </div>
      </div>

      {error ? <p className="text-danger px-2">{error}</p> : null}

      <DataTable
        data={products || []}
        columns={tableColumns}
        striped
        center
        pagination
        paginationServer
        paginationTotalRows={pagination?.totalProducts || pagination?.total || products?.length || 0}
        onChangePage={setCurrentPage}
        paginationDefaultPage={currentPage}
        noDataComponent={<div className="text-center p-4">No products found</div>}
      />

      <ProductModal
        isOpen={addModalOpen}
        toggle={toggleAddModal}
        title="Add Product"
        onSubmit={handleCreateProduct}
        submitting={submitting}
      />

      <ProductModal
        isOpen={editModalOpen}
        toggle={() => {
          toggleEditModal();
          setSelectedProduct(null);
        }}
        title="Edit Product"
        initialProduct={selectedProduct}
        onSubmit={handleUpdateProduct}
        submitting={submitting}
      />
    </Fragment>
  );
};

export default DataTableComponent;
