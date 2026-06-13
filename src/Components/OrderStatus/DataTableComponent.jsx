import React, { Fragment, useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { Col, Input } from "reactstrap";
import { Btn, Spinner } from "../../AbstractElements";
import {
  clearOrderStatusError,
  fetchOrderStatuses,
  updateOrderStatus,
} from "../../Redux/stateSlice/orderStatusReducer";
import { getProductImageFallbackLabel, getProductImageSource } from "../../Utils/productImage";

const ORDER_STATUS_OPTIONS = [
  { label: "Processing", value: "Processing" },
  { label: "Confirmed", value: "Confirmed" },
  { label: "Shipped", value: "Shipped" },
  { label: "Delivered", value: "Delivered" },
  { label: "Cancelled", value: "Cancelled" },
];

const ORDER_STATUS_LOOKUP = ORDER_STATUS_OPTIONS.reduce((lookup, option) => {
  lookup[option.value.toLowerCase()] = option.value;
  return lookup;
}, {});

const FINAL_ORDER_STATUSES = new Set(["Delivered", "Cancelled"]);

const normalizeOrderStatus = (value) => {
  const normalizedValue = String(value || "").trim();
  return ORDER_STATUS_LOOKUP[normalizedValue.toLowerCase()] || normalizedValue || "Processing";
};

const formatCurrency = (value) => `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

const formatDate = (value) => {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ProductImageCell = ({ row }) => {
  const [failed, setFailed] = useState(false);
  const product = row?.productId || {};
  const imageSource = getProductImageSource(product);
  const fallbackLabel = getProductImageFallbackLabel(product);

  if (!imageSource || failed) {
    return (
      <div
        className="rounded d-flex align-items-center justify-content-center text-white"
        style={{
          width: "52px",
          height: "52px",
          fontSize: "18px",
          fontWeight: 600,
          background: "linear-gradient(135deg, #0f766e 0%, #2563eb 100%)",
        }}
      >
        {fallbackLabel}
      </div>
    );
  }

  return (
    <img
      src={imageSource}
      alt={product?.name || "Product"}
      className="rounded"
      style={{ width: "52px", height: "52px", objectFit: "cover" }}
      onError={() => setFailed(true)}
    />
  );
};

const DataTableComponent = () => {
  const dispatch = useDispatch();
  const { orders, pagination, loading, submitting, error } = useSelector((state) => state.orderStatuses);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusDrafts, setStatusDrafts] = useState({});

  const statusOptions = useMemo(() => ORDER_STATUS_OPTIONS, []);

  const getStatusOptionsForRow = (row) => {
    const normalizedCurrentStatus = normalizeOrderStatus(row?.status);
    const hasCurrentStatus = statusOptions.some((option) => option.value === normalizedCurrentStatus);

    if (!hasCurrentStatus) {
      return [{ label: normalizedCurrentStatus, value: normalizedCurrentStatus }, ...statusOptions];
    }

    return statusOptions;
  };

  const isFinalStatus = (status) => FINAL_ORDER_STATUSES.has(normalizeOrderStatus(status));

  useEffect(() => {
    dispatch(fetchOrderStatuses({ page: currentPage, limit: 10 }));
  }, [currentPage, dispatch]);

  useEffect(() => {
    const nextDrafts = {};

    (orders || []).forEach((order) => {
      if (order?._id) {
        nextDrafts[order._id] = normalizeOrderStatus(order?.status);
      }
    });

    setStatusDrafts(nextDrafts);
  }, [orders]);

  const handleStatusDraftChange = (orderId, value) => {
    if (error) {
      dispatch(clearOrderStatusError());
    }

    setStatusDrafts((previousDrafts) => ({
      ...previousDrafts,
      [orderId]: normalizeOrderStatus(value),
    }));
  };

  const handleStatusUpdate = async (row) => {
    if (!row?._id) {
      return;
    }

    const currentStatus = normalizeOrderStatus(row?.status);
    const nextStatus = statusDrafts[row._id] || currentStatus;

    if (isFinalStatus(currentStatus) || nextStatus === currentStatus) {
      return;
    }

    const response = await dispatch(updateOrderStatus({ orderId: row._id, status: nextStatus }));

    if (!response.error) {
      setStatusDrafts((previousDrafts) => ({
        ...previousDrafts,
        [row._id]: nextStatus,
      }));
    }
  };

  const tableColumns = useMemo(
    () => [
      {
        name: "Product",
        minWidth: "220px",
        cell: (row) => (
          <div className="d-flex align-items-center gap-2 py-1">
            <ProductImageCell row={row} />
            <div>
              <div className="fw-semibold">{row?.productId?.name || "N/A"}</div>
              <div className="text-muted small">{formatCurrency(row?.productId?.price)}</div>
            </div>
          </div>
        ),
      },
      {
        name: "Customer",
        minWidth: "180px",
        cell: (row) => (
          <div className="py-1">
            <div className="fw-semibold">{row?.userId?.name || "N/A"}</div>
            <div className="text-muted small">{row?.userId?.phoneNumber || row?.contactNumber || "N/A"}</div>
          </div>
        ),
      },
      {
        name: "Quantity",
        selector: (row) => row?.quantity ?? 0,
        sortable: true,
        center: true,
        width: "110px",
      },
      {
        name: "Amount",
        sortable: true,
        minWidth: "140px",
        cell: (row) => <span>{formatCurrency(row?.totalAmount)}</span>,
      },
      {
        name: "Urgency",
        center: true,
        minWidth: "120px",
        cell: (row) => <span>{row?.urgency || "N/A"}</span>,
      },
      {
        name: "Status",
        center: true,
        minWidth: "250px",
        cell: (row) => {
          const currentStatus = normalizeOrderStatus(row?.status);
          const selectedStatus = statusDrafts[row?._id] || currentStatus;
          const statusLocked = isFinalStatus(currentStatus);

          return (
            <div className="d-flex align-items-center gap-2 py-1" style={{ minWidth: "230px" }}>
              <Input
                type="select"
                value={selectedStatus}
                onChange={(event) => handleStatusDraftChange(row?._id, event.target.value)}
                disabled={submitting || statusLocked}
                style={{
                  minWidth: "150px",
                  height: "38px",
                  borderRadius: "10px",
                  fontWeight: 500,
                }}
              >
                {getStatusOptionsForRow(row).map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </Input>
              <Btn
                attrBtn={{
                  color: "primary",
                  size: "sm",
                  disabled: submitting || statusLocked || selectedStatus === currentStatus,
                  onClick: () => handleStatusUpdate(row),
                  style: {
                    minWidth: "72px",
                    height: "38px",
                    borderRadius: "10px",
                    fontWeight: 600,
                    padding: "0 14px",
                    whiteSpace: "nowrap",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 18px rgba(99, 102, 241, 0.18)",
                  },
                }}
              >
                Save
              </Btn>
            </div>
          );
        },
      },
      {
        name: "Address",
        minWidth: "260px",
        cell: (row) => {
          const address = row?.deliveryAddress || {};
          const summary = [address.location, address.street, address.city, address.postalCode]
            .filter(Boolean)
            .join(", ");

          return <span>{summary || "N/A"}</span>;
        },
      },
      {
        name: "Ordered On",
        minWidth: "170px",
        sortable: true,
        cell: (row) => <span>{formatDate(row?.createdAt)}</span>,
      },
    ],
    [statusDrafts, submitting, statusOptions]
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
        <h5 className="text-muted m-0">Order Status</h5>
        <span className="text-muted small">
          Total Orders: {pagination?.total || orders?.length || 0}
        </span>
      </div>

      {error ? <p className="text-danger px-2">{error}</p> : null}

      <DataTable
        data={orders || []}
        columns={tableColumns}
        striped
        center
        pagination
        paginationServer
        paginationTotalRows={pagination?.total || orders?.length || 0}
        onChangePage={setCurrentPage}
        paginationDefaultPage={currentPage}
        noDataComponent={<div className="text-center p-4">No orders found</div>}
      />
    </Fragment>
  );
};

export default DataTableComponent;
