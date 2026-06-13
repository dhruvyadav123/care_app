import React, { Fragment, useCallback, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Spinner, Col, FormGroup, Input, Form, Button } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { Btn } from "../../../AbstractElements";
import { deleteVacination, fetchVacinations } from "../../../Redux/stateSlice/vacination";
import AddVacination from "./create";
import UpdateVacination from "./update";
import Delete from "../../../CommonElements/deleteModal";
import ViewVacination from "./view";

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

    const [searchInput, setSearchInput] = useState(""); // search input
    const [isSearch, setIsSearch] = useState(false); // trigger search

    const { vacinations, error, loading, pagination } = useSelector((state) => state.vacination);

    useEffect(() => {
        dispatch(fetchVacinations());
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
            dispatch(deleteVacination(deleteUserId)).then(() => {
                dispatch(fetchVacinations());
                setIsDelete(false);
            });
        }
    };

    const handleView = (data) => {
        setViewModal(true);
        setViewData(data);
    };

    // filtered data based on search
    const filteredData = isSearch
        ? vacinations.filter((item) =>
              item.vaccinationType.toLowerCase().includes(searchInput.toLowerCase())
          )
        : vacinations;

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
        { name: "Vaccination Type", selector: (row) => row.vaccinationType, sortable: true, center: true },
        { name: "Description", selector: (row) => row.description, sortable: true, center: true },
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
            <div className="d-flex align-items-center justify-content-between p-2 mb-2">
                <Form
                    inline
                    onSubmit={(e) => {
                        e.preventDefault();
                        setIsSearch(true); // trigger search
                    }}
                >
                    <FormGroup className="d-flex gap-2">
                        <Input
                            type="text"
                            placeholder="Search by type..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                        <Button color="primary" type="submit">
                            Search
                        </Button>
                        {isSearch && (
                            <Button
                                color="secondary"
                                type="button"
                                onClick={() => {
                                    setSearchInput("");
                                    setIsSearch(false); // reset search
                                }}
                            >
                                Clear
                            </Button>
                        )}
                    </FormGroup>
                </Form>

                <Btn attrBtn={{ color: "primary", onClick: () => setAddModal(true) }}>Add Vaccination</Btn>
            </div>

            <DataTable
                data={filteredData}
                columns={tableColumns}
                striped
                pagination
                paginationServer
                paginationTotalRows={pagination?.totalVacination || 0}
                onChangePage={handlePageChange}
                paginationDefaultPage={currentPage}
                selectableRows
                onSelectedRowsChange={handleRowSelected}
                clearSelectedRows={toggleDelet}
            />

            <AddVacination addModal={addModal} setAddModal={setAddModal} />
            <UpdateVacination data={viewData} editModal={editModal} setEditModal={setEditModal} />
            <Delete isDelete={isDelete} setIsDelete={setIsDelete} onDelete={handleConfirmDelete} />
            <ViewVacination data={viewData} ViewModal={viewModal} setViewModal={setViewModal} />
        </Fragment>
    );
};

export default DataTables;
