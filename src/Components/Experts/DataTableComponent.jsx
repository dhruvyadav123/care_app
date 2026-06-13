import React, { Fragment, useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { Badge, Col, Input, InputGroup, InputGroupText } from "reactstrap";
import { Btn, H5, Spinner } from "../../AbstractElements";
import { createExpert, deleteExpert, fetchExperts, updateExpert, updateExpertStatus } from "../../Redux/stateSlice/expertReducer";
import { toast } from "react-toastify";
import AddModal from "./AddModal";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";

const formatDate = (value) => {
  if (!value) {
    return "N/A";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getSafeGender = (value) => {
  if (!value) {
    return "Unknown";
  }

  return String(value).trim();
};

const getSafeStatus = (value) => String(value || "active").trim().toLowerCase();

const DataTableComponent = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);

  const { experts, loading, submitting, error, pagination } = useSelector((state) => state.experts);

  useEffect(() => {
    dispatch(fetchExperts());
  }, [dispatch]);

  const filteredExperts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return experts;
    }

    return experts.filter((expert) => {
      const searchableValues = [
        expert?.name,
        expert?.email,
        expert?.phoneNumber,
        expert?.gender,
      ];

      return searchableValues.some((value) => String(value || "").toLowerCase().includes(query));
    });
  }, [experts, search]);

  const stats = useMemo(() => {
    const total = experts.length;
    const male = experts.filter((expert) => getSafeGender(expert?.gender).toLowerCase() === "male").length;
    const female = experts.filter((expert) => getSafeGender(expert?.gender).toLowerCase() === "female").length;

    return { total, male, female };
  }, [experts]);

  const handleCreateExpert = async (payload) => {
    try {
      await dispatch(createExpert(payload)).unwrap();
      toast.success("Expert created successfully.");
      setIsCreateModalOpen(false);
      dispatch(fetchExperts());
    } catch (createError) {
      const message =
        createError?.msg ||
        createError?.message ||
        createError?.error ||
        "Failed to create expert.";

      toast.error(message);
    }
  };

  const handleUpdateExpert = async (expertId, payload) => {
    try {
      await dispatch(updateExpert({ expertId, payload })).unwrap();
      toast.success("Expert updated successfully.");
      setIsEditModalOpen(false);
      setSelectedExpert(null);
      dispatch(fetchExperts());
    } catch (updateError) {
      const message =
        updateError?.msg ||
        updateError?.message ||
        updateError?.error ||
        "Failed to update expert.";

      toast.error(message);
    }
  };

  const handleDeleteExpert = async () => {
    if (!selectedExpert?._id) {
      return;
    }

    try {
      await dispatch(deleteExpert(selectedExpert._id)).unwrap();
      toast.success("Expert deleted successfully.");
      setIsDeleteModalOpen(false);
      setSelectedExpert(null);
      dispatch(fetchExperts());
    } catch (deleteError) {
      const message =
        deleteError?.msg ||
        deleteError?.message ||
        deleteError?.error ||
        "Failed to delete expert.";

      toast.error(message);
    }
  };

  const handleToggleStatus = async (expert) => {
    if (!expert?._id) {
      return;
    }

    const nextStatus = getSafeStatus(expert?.status) === "inactive" ? "active" : "inactive";

    try {
      await dispatch(updateExpertStatus({ expertId: expert._id, status: nextStatus })).unwrap();
      toast.success(`Expert marked ${nextStatus}.`);
      dispatch(fetchExperts());
    } catch (statusError) {
      const message =
        statusError?.msg ||
        statusError?.message ||
        statusError?.error ||
        "Failed to update expert status.";

      toast.error(message);
    }
  };

  const columns = [
    {
      name: "Name",
      selector: (row) => row?.name || "N/A",
      sortable: true,
      grow: 1.4,
    },
    {
      name: "Email",
      selector: (row) => row?.email || "N/A",
      sortable: true,
      grow: 1.6,
    },
    {
      name: "Phone",
      selector: (row) => row?.phoneNumber || "N/A",
      grow: 1.2,
    },
    {
      name: "Gender",
      cell: (row) => {
        const gender = getSafeGender(row?.gender);
        const color =
          gender.toLowerCase() === "male"
            ? "primary"
            : gender.toLowerCase() === "female"
            ? "success"
            : "secondary";

        return <Badge color={color}>{gender}</Badge>;
      },
      center: true,
    },
    {
      name: "Status",
      cell: (row) => {
        const status = getSafeStatus(row?.status);
        const color = status === "inactive" ? "danger" : "success";

        return <Badge color={color}>{status === "inactive" ? "Inactive" : "Active"}</Badge>;
      },
      center: true,
    },
    {
      name: "Created",
      selector: (row) => formatDate(row?.createdAt),
      sortable: true,
      center: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-light p-2"
            onClick={() => {
              setSelectedExpert(row);
              setIsEditModalOpen(true);
            }}
          >
            <i className="fa fa-edit" style={{ fontSize: "15px", color: "#494949" }}></i>
          </button>
          <button
            className="btn btn-light p-2"
            onClick={() => handleToggleStatus(row)}
            title={getSafeStatus(row?.status) === "inactive" ? "Mark active" : "Mark inactive"}
          >
            <i className={`fa ${getSafeStatus(row?.status) === "inactive" ? "fa-toggle-off" : "fa-toggle-on"}`} style={{ fontSize: "15px", color: "#5c61f2" }}></i>
          </button>
          <button
            className="btn btn-light p-2"
            onClick={() => {
              setSelectedExpert(row);
              setIsDeleteModalOpen(true);
            }}
          >
            <i className="fa fa-trash-o" style={{ fontSize: "15px", color: "#dc3545" }}></i>
          </button>
        </div>
      ),
      minWidth: "150px",
      center: true,
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

  return (
    <Fragment>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <div>
          <H5 attrH4={{ className: "text-muted m-0" }}>Experts Directory</H5>
          <small className="text-muted">
            {pagination?.totalExperts || experts.length || 0} experts available
          </small>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <Btn attrBtn={{ color: "light", onClick: () => dispatch(fetchExperts()) }}>
            Refresh
          </Btn>
          <Btn attrBtn={{ color: "primary", onClick: () => setIsCreateModalOpen(true) }}>
            Add Expert
          </Btn>
        </div>
      </div>

      <div className="d-flex flex-wrap gap-2 mb-3">
        <span className="badge badge-light-primary p-2">Total: {stats.total}</span>
        <span className="badge badge-light-success p-2">Female: {stats.female}</span>
        <span className="badge badge-light-info p-2">Male: {stats.male}</span>
      </div>

      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <InputGroup style={{ maxWidth: "360px" }}>
          <InputGroupText
            style={{
              borderTopLeftRadius: "999px",
              borderBottomLeftRadius: "999px",
              backgroundColor: "#f8f9fa",
            }}
          >
            <i className="fa fa-search text-muted"></i>
          </InputGroupText>
          <Input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search..." 
            style={{
              borderTopRightRadius: "999px",
              borderBottomRightRadius: "999px",
            }}
          />
        </InputGroup>
        {error ? <small className="text-danger">{String(error?.msg || error?.message || error)}</small> : null}
      </div>

      <DataTable
        data={filteredExperts}
        columns={columns}
        striped
        highlightOnHover
        responsive
        pagination
        noDataComponent={<div className="py-4 text-muted">No experts found.</div>}
      />

      <AddModal
        isOpen={isCreateModalOpen}
        toggle={() => setIsCreateModalOpen((prev) => !prev)}
        onSubmit={handleCreateExpert}
        submitting={submitting}
      />

      <EditModal
        isOpen={isEditModalOpen}
        toggle={() => {
          setIsEditModalOpen(false);
          setSelectedExpert(null);
        }}
        expertData={selectedExpert}
        onSubmit={handleUpdateExpert}
        submitting={submitting}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        toggle={() => {
          setIsDeleteModalOpen(false);
          setSelectedExpert(null);
        }}
        onConfirm={handleDeleteExpert}
        deleting={submitting}
        expertName={selectedExpert?.name}
      />
    </Fragment>
  );
};

export default DataTableComponent;
