import React, { Fragment, useCallback, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Spinner, Col, FormGroup, Input, Form } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { H5, Btn } from "../../../AbstractElements";
import Delete from "../../../CommonElements/deleteModal";
import AddMedicine from "./create";
import UpdateMedicine from "./update";
import ViewMedicine from "./view";
import { deleteDoctor, fetchDoctors } from "../../../Redux/stateSlice/doctor";

const DataTables = () => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [toggleDelet, setToggleDelet] = useState(false);
    const dispatch = useDispatch();
    const [addModal, setAddModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteUserId, setDeleteUserId] = useState(null);
    const [isDelete, setIsDelete] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [viewData, setViewData] = useState("");
    const [viewModal, setViewModal] = useState(false);
    const [search, setSearch] = useState(null);

    const { doctors, error, loading, pagination } = useSelector((state) => state.doctor);

    useEffect(() => {
        dispatch(fetchDoctors());
    }, [dispatch, currentPage, editModal]);


    const handleRowSelected = useCallback((state) => {
        setSelectedRows(state.selectedRows);
    }, []);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDelete = (id) => {
        setDeleteUserId(id);
        setIsDelete(true);
    };

    const EditModaltoggle = (data) => {
        setViewData(data);
        setEditModal(!editModal);
    };

    const handleConfirmDelete = () => {
        if (deleteUserId) {
            dispatch(deleteDoctor(deleteUserId)).then(() => {
                dispatch(fetchDoctors());
                setIsDelete(false);
            });
        }
    };

    const handleView = (data) => {
        setViewModal(true);
        setViewData(data);
    };

    // const handleSubmit = () => {
    //     // dispatch(search(search));
    //     setSearch(null);
    // }

    // useEffect(() => {
    //     dispatch(searchMedicines(search));
    // },[search])


    if (loading) {
        return (
            <Col className="vh-100 d-flex align-items-center justify-content-center">
                <div className="loader-box">
                    <Spinner className="loader-5" />
                </div>
            </Col>
        );
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    const tableColumns = [
        { name: "Doctor Name", selector: (row) => row.doctorName, sortable: true, center: true },
        { name: "Doctor Number", selector: (row) => row.doctorNumber, sortable: true, center: true },
        { name: "Hospital Name", selector: (row) => row.hospitalName, sortable: true, center: true },
        { name: "Relative Name", selector: (row) => row.relativeName, sortable: true, center: true },
        { name: "Relative Number", selector: (row) => row.relativeNumber, sortable: true, center: true },
        { name: "Disease", selector: (row) => row.disease, sortable: true, center: true },

        {
            name: "Actions",
            cell: (row) => (
                <div className="d-flex">
                    <button className="btn btn-light p-1 mx-1" onClick={() => EditModaltoggle(row)}>
                        <i className="fa fa-edit" style={{ fontSize: "small", color: "#494949" }}></i>
                    </button>
                    <button className="btn btn-light p-1 mx-1" onClick={() => handleView(row)}>
                        <i className="fa fa-arrows-alt" style={{ fontSize: "small", color: "#494949" }}></i>
                    </button>
                    <button className="btn btn-light p-1 mx-1" onClick={() => handleDelete(row._id)}>
                        <i className="fa fa-trash-o" style={{ fontSize: "small", color: "#494949" }}></i>
                    </button>
                </div>
            ),
        },
    ];

    return (
        <Fragment>
            <div className="d-flex align-items-center justify-content-between p-2">
                <H5 attrH5={{ className: "text-muted m-0" }}>Doctor</H5>
                {/* <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <div className="d-flex gap-3">
                            <Input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value) }}
                                required
                            />
                            <Btn attrBtn={{ color: "primary" }}>Search</Btn>
                        </div>
                    </FormGroup>
                </Form> */}
                {/* <Btn attrBtn={{ color: "primary", onClick: () => setAddModal(true) }}>Add Doctor</Btn> */}
            </div>
            <DataTable
                data={doctors}
                columns={tableColumns}
                striped
                pagination
                paginationServer
                paginationTotalRows={pagination?.totalDoctors || 0}
                onChangePage={handlePageChange}
                paginationDefaultPage={currentPage}
                selectableRows
                onSelectedRowsChange={handleRowSelected}
                clearSelectedRows={toggleDelet}
            />
            <UpdateMedicine data={viewData} editModal={editModal} setEditModal={setEditModal} />
            <AddMedicine addModal={addModal} setAddModal={setAddModal} />
            <Delete isDelete={isDelete} setIsDelete={setIsDelete} onDelete={handleConfirmDelete} />
            <ViewMedicine data={viewData} ViewModal={viewModal} setViewModal={setViewModal} />
        </Fragment>
    );
};

export default DataTables;