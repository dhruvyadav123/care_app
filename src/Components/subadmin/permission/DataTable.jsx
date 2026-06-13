import React, { Fragment, useCallback, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import PermissionCreate from "./create";
import { API_URL } from "../../../Config/AppConstant";

const DataTableComponent = () => {
    const token = localStorage.getItem('token')
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleDelet, setToggleDelet] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [addRoleModal, setAddRoleModal] = useState(false);
  const [permissions,setPermissions] = useState([])

  const allPermission = async() => {
    await axios.get(`${API_URL}/permission/fetch`,{headers:{Authorization:`Bearer ${token}`}}).then((res) => {
        setPermissions(res.data.data)
        console.log("res::",res.data)
    }).catch((error) => {
        console.log("error::",error)
    })
  }
  
  useEffect(() => {
    allPermission()
  }, []);

  const handleRowSelected = useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const tableColumns = [
    { 
      name: "Permission", 
      selector: (row) => row?.name, 
      sortable: true, 
      center: true 
    },
  ];

  return (
    <Fragment>
      <div className="d-flex align-items-center justify-content-between p-2">
        <h5 className="text-muted m-0">Permission</h5>
        <button 
          className="btn btn-success" 
          onClick={() => setAddRoleModal(true)}
        >
          Add Permission
        </button>
      </div>
      
      <DataTable
        data={permissions}
        columns={tableColumns}
        striped
        paginationServer
        onChangePage={handlePageChange}
        paginationDefaultPage={currentPage}
        selectableRows
        onSelectedRowsChange={handleRowSelected}
        clearSelectedRows={toggleDelet}
      />

      <PermissionCreate addRoleModal={addRoleModal} allPermission={allPermission} setAddRoleModal={setAddRoleModal} />
    </Fragment>
  );
};

export default DataTableComponent;
