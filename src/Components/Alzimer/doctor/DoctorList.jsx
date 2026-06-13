import React, { useState, useEffect, Fragment } from "react";
import DataTable from "react-data-table-component";
import { Button, FormGroup, Input, Form } from "reactstrap";
import { H5, Btn } from "../../../AbstractElements";
import Delete from "../../../CommonElements/deleteModal";
import AddDoctor from "./create";
import UpdateDoctor from "./update";
import ViewDoctor from "./view";
import alzheimerService from "../../../Services/alzheimer";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const [searchInput, setSearchInput] = useState(""); // input value
  const [isSearch, setIsSearch] = useState(false); // trigger search

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await alzheimerService.getAllDoctors();
      setDoctors(response.data);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await alzheimerService.deleteDoctor(selected._id);
      const filtered = doctors.filter((item) => item._id !== selected._id);
      setDoctors(filtered);
    } catch (error) {
      console.error("Error deleting doctor:", error);
    } finally {
      setDeleteModal(false);
    }
  };

  // filtered data based on search
  const filteredData = isSearch
    ? doctors.filter((item) =>
        item.doctorName.toLowerCase().includes(searchInput.toLowerCase())
      )
    : doctors;

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      name: "Doctor Name",
      selector: (row) => row.doctorName,
      sortable: true,
    },
    {
      name: "Doctor Number",
      selector: (row) => row.doctorNumber,
    },
    {
      name: "Hospital Name",
      selector: (row) => row.hospitalName,
    },
    {
      name: "Hospital Number",
      selector: (row) => row.hospitalNumber,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex">
          <button
            className="btn btn-light p-1 mx-1"
            onClick={() => {
              setSelected(row);
              setEditModal(true);
            }}
          >
            <i className="fa fa-edit" />
          </button>
          <button
            className="btn btn-light p-1 mx-1"
            onClick={() => {
              setSelected(row);
              setViewModal(true);
            }}
          >
            <i className="fa fa-eye" />
          </button>
          <button
            className="btn btn-light p-1 mx-1"
            onClick={() => {
              setSelected(row);
              setDeleteModal(true);
            }}
          >
            <i className="fa fa-trash" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Fragment>
      <div className="d-flex justify-content-between align-items-center mb-3">
          {/* <H5>Doctors</H5> */}

       <Form
  inline
  onSubmit={(e) => {
    e.preventDefault();
    setIsSearch(true); // trigger search on Search button click
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
    {isSearch && (  // Clear button appears only after Search is clicked
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


        <Btn attrBtn={{ color: "primary", onClick: () => setAddModal(true) }}>
          Add Doctor
        </Btn>
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        progressPending={loading}
        pagination
        highlightOnHover
        striped
      />

      <AddDoctor modal={addModal} setModal={setAddModal} refresh={fetchData} />
      <UpdateDoctor modal={editModal} setModal={setEditModal} data={selected} refresh={fetchData} />
      <ViewDoctor modal={viewModal} setModal={setViewModal} data={selected} />
      <Delete isDelete={deleteModal} setIsDelete={setDeleteModal} onDelete={handleDelete} />
    </Fragment>
  );
};

export default DoctorList;
