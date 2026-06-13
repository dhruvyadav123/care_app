import React, { Fragment, useCallback, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { Col } from "reactstrap";
import fetchRoles from "../../../Redux/stateSlice/roleReducer";
import { Spinner } from "../../../AbstractElements";
import RoleCreate from "./create";

const DataTableComponent = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleDelet, setToggleDelet] = useState(false);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [addRoleModal, setAddRoleModal] = useState(false);
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
        return row?.permissions.length > 0
          ? row.permissions.map((perm) => perm.name).join(', ') 
          : 'No Permissions';  // If no permissions, display "No Permissions"
      }, 
      sortable: true, 
      center: true 
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
        paginationTotalRows={pagination?.totalUsers || 0}
        onChangePage={handlePageChange}
        paginationDefaultPage={currentPage}
        selectableRows
        onSelectedRowsChange={handleRowSelected}
        clearSelectedRows={toggleDelet}
      />

      <RoleCreate addRoleModal={addRoleModal} setAddRoleModal={setAddRoleModal} />
    </Fragment>
  );
};

export default DataTableComponent;
