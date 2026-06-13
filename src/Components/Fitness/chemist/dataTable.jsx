import React, { Fragment, useCallback, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Btn, Image, Spinner } from "../../../AbstractElements";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, fetchUsers } from "../../../Redux/stateSlice/userReducer";
import { Col, FormGroup, Input, Form, Button } from "reactstrap";
import { BASE_URL } from "../../../Config/AppConstant";
import { changeVendorStatus, fetchVendors, searchVendor } from "../../../Redux/stateSlice/vendorReducer";
import Switch from 'react-switch';
import ViewModal from "./view";
import EditModal from "./edit";

const DataTableComponent = () => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [toggleDelet, setToggleDelet] = useState(false);
    const [viewData, setViewData] = useState("");
    const [viewModal, setViewModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [search, setSearch] = useState("");
    const [isSearch, setIsSearch] = useState(false);
    const dispatch = useDispatch();
    const { loading, vendors, error, pagination } = useSelector((state) => state.vendors);

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(fetchVendors(currentPage, 10, 'Chemist'));
    }, [dispatch, currentPage]);

    const EditModaltoggle = (data) => {
        setViewData(data);
        setEditModal(!editModal);
    };

    const handleRowSelected = useCallback((state) => {
        setSelectedRows(state.selectedRows);
    }, []);

    const handleDelete = (id) => {
        dispatch(deleteUser(id));
        dispatch(fetchUsers(currentPage, 10));
    };

    const handleView = (data) => {
        setViewModal(true);
        setViewData(data);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleStatusToggle = async (e, id, currentStatus) => {
        const newStatus = currentStatus === "1" ? "0" : "1";

        await dispatch(changeVendorStatus(newStatus, id));
        dispatch(fetchVendors(1, 10, 'Chemist'))
    };

    const handleSearch = (e) => {
        e.preventDefault();
        dispatch(searchVendor(search));
        setIsSearch(true);
    };

    const handleClearSearch = () => {
        setSearch('');
        setIsSearch(false);
        dispatch(fetchVendors(currentPage, 10));
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

    const CustomOption = ({ row, handleDelete, EditModaltoggle }) => (
        <div className="d-flex">
            <button
                className="btn btn-light p-2 mx-1"
                onClick={() => handleView(row)}
            >
                <i
                    style={{ fontSize: "large", color: "#494949" }}
                    className="fa fa-arrows-alt"
                ></i>
            </button>
        </div>
    );

    // Define columns
    const tableColumns = [
        {
            name: "Profile",
            sortable: true,
            center: false,
            cell: (row) => (
                <div className="avatar">
                    <Image
                        attrImage={{
                            body: true,
                            className: "img-60 rounded-circle",
                            src: `${BASE_URL}/uploads/${isSearch ? row?.avatar : row?.expert?.avatar}`,
                            alt: "#",
                        }}
                    />
                </div>
            ),
        },
        {
            name: "Name",
            selector: (row) => (isSearch ? `${row?.name}` : `${row?.expert?.name}`),
            sortable: true,
            center: true,
        },
        {
            name: "Email",
            selector: (row) => (isSearch ? `${row?.email}` : `${row?.expert?.email}`),
            sortable: true,
            center: true,
        },
        {
            name: "Phone",
            selector: (row) => (isSearch ? `${row?.phoneNumber}` : `${row?.expert?.phoneNumber}`),
            sortable: true,
            center: true,
        },
        {
            name: "DOB",
            selector: (row) => (isSearch ? `${row?.dob}` : `${row?.expert?.dob}`),
            sortable: true,
            center: true,
        },
        {
            name: "Status",
            cell: (row) => (
                <Switch
                    onChange={(e) => handleStatusToggle(e, isSearch ? row?._id : row?.expert?._id, row?.expert?.status)}
                    checked={row?.expert?.status === "1"}
                    offColor="#dc3545"
                    onColor="#28a745"
                    uncheckedIcon={false}
                    checkedIcon={false}
                    height={20}
                    width={40}
                />
            ),
        },
        {
            name: "Option",
            center: true,
            minWidth: "150px",
            button: true,
            cell: (row) => (
                <CustomOption
                    row={row}
                    handleDelete={handleDelete}
                    EditModaltoggle={EditModaltoggle}
                />
            ),
        },
    ];

    const Modaltoggle = () => setViewModal(!viewModal);

    return (
        <Fragment>
            {/* Search Form */}
            {vendors && <Form onSubmit={handleSearch}>
                <FormGroup>
                    <div className="d-flex gap-3">
                        <Input
                            type="text"
                            name="search"
                            id="search"
                            placeholder="Search Vendors..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            required
                            style={{ width: "250px" }}
                        />
                        <Btn attrBtn={{ color: "primary" }}>Search</Btn>
                        {isSearch && (
                            <Button color="secondary" onClick={handleClearSearch}>
                                Clear
                            </Button>
                        )}
                    </div>
                </FormGroup>
            </Form>}

            <DataTable
                data={vendors}
                columns={tableColumns}
                striped={true}
                center={true}
                pagination
                paginationServer
                paginationTotalRows={pagination?.totalExperts || 0}
                onChangePage={handlePageChange}
                paginationDefaultPage={currentPage}
                selectableRows
                onSelectedRowsChange={handleRowSelected}
                clearSelectedRows={toggleDelet}
            />
            <ViewModal
                data={viewData}
                viewModal={viewModal}
                setViewModal={setViewData}
                Modaltoggle={Modaltoggle}
            />
            <EditModal
                data={viewData}
                editModal={editModal}
                setEditModal={setEditModal}
                EditModaltoggle={EditModaltoggle}
            />
        </Fragment>
    );
};

export default DataTableComponent;
