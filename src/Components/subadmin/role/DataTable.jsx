import React, { Fragment, useCallback, useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import fetchRoles from "../../../Redux/stateSlice/roleReducer";
import { Spinner } from "../../../AbstractElements";
import RoleCreate from "./create";
import { API_URL } from "../../../Config/AppConstant";
import { toast } from "react-toastify";

const DataTableComponent = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleDelet, setToggleDelet] = useState(false);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [addRoleModal, setAddRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roleName, setRoleName] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const { loading, error, pagination, roles } = useSelector((state) => state.roles);
  
  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch, currentPage]);

  const handleRowSelected = useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getAuthConfig = () => ({
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });

  const openEditModal = (role) => {
    setEditingRole(role);
    setRoleName(role?.role || "");
  };

  const closeEditModal = () => {
    if (!actionLoading) {
      setEditingRole(null);
      setRoleName("");
    }
  };

  const handleUpdateRole = async () => {
    const nextRoleName = roleName.trim();

    if (!editingRole?._id || !nextRoleName) {
      return;
    }

    setActionLoading(true);

    try {
      await axios.put(
        API_URL + "/role/update/" + editingRole._id,
        { role: nextRoleName },
        getAuthConfig()
      );
      toast.success("Role updated successfully.");
      setEditingRole(null);
      setRoleName("");
      dispatch(fetchRoles());
    } catch (requestError) {
      toast.error(requestError?.response?.data?.message || "Unable to update role.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRole = async (role) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete the "' + (role?.role || "") + '" role?'
    );

    if (!role?._id || !confirmed) {
      return;
    }

    setActionLoading(true);

    try {
      await axios.delete(API_URL + "/role/delete/" + role._id, getAuthConfig());
      toast.success("Role deleted successfully.");
      dispatch(fetchRoles());
    } catch (requestError) {
      toast.error(requestError?.response?.data?.message || "Unable to delete role.");
    } finally {
      setActionLoading(false);
    }
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

  const tableColumns = [
    { 
      name: "Role", 
      selector: (row) => row?.role, 
      sortable: true, 
      center: true 
    },
    {
      name: "Assign Permission",
      selector: (row) => {
        return row?.permissions?.length > 0
          ? row.permissions.map((perm) => perm.name).join(", ")
          : "No Permissions";
      },
      sortable: true,
      center: true,
    },
    {
      name: "Actions",
      center: true,
      cell: (row) => (
        <div className="d-flex">
          <button
            type="button"
            className="btn btn-light p-1 mx-1"
            onClick={() => openEditModal(row)}
            disabled={actionLoading}
            aria-label={"Edit " + (row?.role || "role")}
            title="Edit role"
          >
            <i className="fa fa-edit" style={{ fontSize: "small", color: "#494949" }}></i>
          </button>
          <button
            type="button"
            className="btn btn-light p-1 mx-1"
            onClick={() => handleDeleteRole(row)}
            disabled={actionLoading}
            aria-label={"Delete " + (row?.role || "role")}
            title="Delete role"
          >
            <i className="fa fa-trash-o" style={{ fontSize: "small", color: "#494949" }}></i>
          </button>
        </div>
      ),
    },
  ];

  return (
    <Fragment>
      <div className="d-flex align-items-center justify-content-between p-2">
        <h5 className="text-muted m-0">Roles</h5>
        <button 
          className="btn btn-success" 
          onClick={() => setAddRoleModal(true)}
        >
          Add Role
        </button>
      </div>
      
      <DataTable
        data={roles}
        columns={tableColumns}
        striped
        pagination
        paginationServer
        paginationTotalRows={pagination?.totalRoles || pagination?.total || roles?.length || 0}
        onChangePage={handlePageChange}
        paginationDefaultPage={currentPage}
        selectableRows
        onSelectedRowsChange={handleRowSelected}
        clearSelectedRows={toggleDelet}
      />

      <RoleCreate addRoleModal={addRoleModal} setAddRoleModal={setAddRoleModal} />

      <Modal isOpen={Boolean(editingRole)} toggle={closeEditModal} centered>
        <ModalHeader toggle={closeEditModal}>Edit Role</ModalHeader>
        <ModalBody>
          <FormGroup className="mb-0">
            <Label for="edit-role-name">Role Name</Label>
            <Input
              id="edit-role-name"
              value={roleName}
              onChange={(event) => setRoleName(event.target.value)}
              disabled={actionLoading}
              autoFocus
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={closeEditModal} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={handleUpdateRole}
            disabled={actionLoading || !roleName.trim()}
          >
            {actionLoading ? "Saving..." : "Save Changes"}
          </Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
};

export default DataTableComponent;
