import React, { Fragment, useCallback, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Spinner, Col, FormGroup, Input, Form, Button } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { Btn, Image } from "../../../AbstractElements";
import Delete from "../../../CommonElements/deleteModal";
import { BASE_URL } from "../../../Config/AppConstant";
import { deleteFitnessCategory, fetchFitnessCategory } from "../../../Redux/stateSlice/fitnessCategory";
import CreateFitnessCategory from "./create";
import UpdateFitnessCategory from "./update";
import ViewFitnessCategory from "./view";

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

    const [searchInput, setSearchInput] = useState("");
    const [isSearch, setIsSearch] = useState(false);

    const { categories, error, loading, pagination } = useSelector((state) => state.category);
    
    useEffect(() => {
        dispatch(fetchFitnessCategory());
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
            dispatch(deleteFitnessCategory(deleteUserId)).then(() => {
                dispatch(fetchFitnessCategory());
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
        ? categories.filter((item) =>
            item.name.toLowerCase().includes(searchInput.toLowerCase())
        )
        : categories;

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
        { name: "Name", selector: (row) => row.name, sortable: true, center: true },
        {
            name: "Category Icon",
            cell: (row) => (
                <div className="avatar">
                    <Image
                        attrImage={{
                            body: true,
                            className: "img-60 rounded-circle",
                            src: `${BASE_URL}/uploads/${row?.categoryIcon}`,
                            alt: "#",
                        }}
                    />
                </div>
            ),
        },
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
                        setIsSearch(true);
                        setCurrentPage(1); // reset page on search
                    }}
                >
                    <FormGroup className="d-flex gap-2">
                        <Input
                            type="text"
                            placeholder="Search by name..."
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
                                    setIsSearch(false);
                                }}
                            >
                                Clear
                            </Button>
                        )}
                    </FormGroup>
                </Form>

                <Btn attrBtn={{ color: "primary", onClick: () => setAddModal(true) }}>Add Vender Category</Btn>
            </div>

            <DataTable
                data={filteredData}
                columns={tableColumns}
                striped
                pagination
                paginationServer
                paginationTotalRows={pagination?.totalMedicines || 0}
                onChangePage={handlePageChange}
                paginationDefaultPage={currentPage}
                selectableRows
                onSelectedRowsChange={handleRowSelected}
                clearSelectedRows={toggleDelet}
            />

            <UpdateFitnessCategory data={viewData} editModal={editModal} setEditModal={setEditModal} />
            <CreateFitnessCategory addModal={addModal} setAddModal={setAddModal} />
            <Delete isDelete={isDelete} setIsDelete={setIsDelete} onDelete={handleConfirmDelete} />
            <ViewFitnessCategory data={viewData} viewModal={viewModal} setViewModal={setViewModal} />
        </Fragment>
    );
};

export default DataTables;
