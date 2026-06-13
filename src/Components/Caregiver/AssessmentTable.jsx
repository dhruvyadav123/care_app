import React, { Fragment, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Input, FormGroup, Form } from "reactstrap";
import { Btn } from "../../AbstractElements";
import alzheimerService from "../../Services/alzheimer";
import AddCaregiver from "./create";
import UpdateCaregiver from "./update";
import ViewCaregiver from "./view";
import Delete from "./delete";
const CaregiverTable = () => {
  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  // ✅ Fetch caregivers list
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await alzheimerService.getAllCaregivers();
      if (res?.success) {
        setCaregivers(res.data);
      } else {
        console.warn("No caregivers found:", res);
      }
    } catch (error) {
      console.error("Error fetching caregivers:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Delete
  const handleDelete = async () => {
    try {
      await alzheimerService.deleteCaregiver(selected._id);
      setDeleteModal(false);
      fetchData();
    } catch (error) {
      console.error("Error deleting caregiver:", error);
    }
  };

  // ✅ Search filter
  const filteredData = caregivers.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Table columns
  const columns = [
    {
      name: "Name",
      selector: (row) => row.name || "-",
      sortable: true,
      center: true,
    },
    {
      name: "Phone Number",
      selector: (row) => row.phoneNumber || "-",
      center: true,
    },
    {
      name: "Relation",
      selector: (row) => row.relation || "-",
      center: true,
    },
    {
      name: "Address",
      selector: (row) => row.address || "-",
      center: true,
    },
    {
      name: "Patient",
      selector: (row) =>
        row.patientId
          ? `${row.patientId.fullName} (${row.patientId.age}y, ${row.patientId.gender})`
          : "No Linked Patient",
      center: true,
    },
    {
      name: "Image",
      cell: (row) =>
        row.image ? (
          <img
            src={row.image}
            alt="caregiver"
            width={40}
            height={40}
            style={{ objectFit: "cover", borderRadius: "4px" }}
          />
        ) : (
          <span>No Image</span>
        ),
      center: true,
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
            <i className="fa fa-edit" style={{ fontSize: "small", color: "#494949" }}></i>
          </button>
          <button
            className="btn btn-light p-1 mx-1"
            onClick={() => {
              setSelected(row);
              setViewModal(true);
            }}
          >
            <i className="fa fa-eye" style={{ fontSize: "small", color: "#494949" }}></i>
          </button>
          <button
            className="btn btn-light p-1 mx-1"
            onClick={() => {
              setSelected(row);
              setDeleteModal(true);
            }}
          >
            <i className="fa fa-trash-o" style={{ fontSize: "small", color: "#494949" }}></i>
          </button>
        </div>
      ),
      center: true,
    },
  ];

  return (
    <Fragment>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form inline onSubmit={(e) => e.preventDefault()}>
          <FormGroup>
            <Input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </FormGroup>
        </Form>
        <Btn attrBtn={{ color: "primary", onClick: () => setAddModal(true) }}>
          Add Caregiver
        </Btn>
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        progressPending={loading}
        pagination
        striped
      />

      {/* Optional modals */}
      <AddCaregiver modal={addModal} setModal={setAddModal} refresh={fetchData} />
      <UpdateCaregiver modal={editModal} setModal={setEditModal} data={selected} refresh={fetchData} />
      <ViewCaregiver modal={viewModal} setModal={setViewModal} data={selected} />
      <Delete isDelete={deleteModal} setIsDelete={setDeleteModal} onDelete={handleDelete} />
    </Fragment>
  );
};

export default CaregiverTable;
