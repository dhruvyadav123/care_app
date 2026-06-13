import React, { Fragment, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Col, Input, FormGroup, Form } from "reactstrap";
import { H5, Btn } from "../../../AbstractElements";
import AddAssessment from "./create";
import UpdateAssessment from "./update";
import ViewAssessment from "./view";
import Delete from "../../../CommonElements/deleteModal";
import alzheimerService from "../../../Services/alzheimer";

const AssessmentTable = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const dummy = [
        {
          _id: "1",
          question: "What is the shape of a circle?",
          questionCategory: "Shapes",
          images: [
            "https://via.placeholder.com/60",
            "https://via.placeholder.com/60",
          ],
          shapes: ["circle", "square"],
          connectshape: "circle",
          options: ["Circle", "Square"],
          points: 5,
        },
        {
          _id: "2",
          question: "Select the triangle shape.",
          questionCategory: "Geometry",
          images: ["https://via.placeholder.com/60"],
          shapes: ["triangle", "hexagon"],
          connectshape: "triangle",
          options: ["Triangle", "Rectangle"],
          points: 8,
        },
      ];
      setAssessments(dummy);
    } catch (error) {
      console.error("Error fetching assessments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await alzheimerService.deleteQuestion(selected._id);
      setDeleteModal(false);
      fetchData();
    } catch (error) {
      console.error("Error deleting assessment:", error);
    }
  };

  const filteredData = assessments.filter((item) =>
    item.question?.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      name: "Question",
      selector: (row) => row.question,
      sortable: true,
      center: true,
    },
    {
      name: "Category",
      selector: (row) => row.questionCategory || "N/A",
      center: true,
    },
    {
      name: "Images",
      cell: (row) =>
        row.images && row.images.length > 0 ? (
          <div className="d-flex flex-wrap gap-1">
            {row.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`img-${i}`}
                width={40}
                height={40}
                style={{ objectFit: "cover", borderRadius: "4px" }}
              />
            ))}
          </div>
        ) : (
          <span>No Images</span>
        ),
      center: true,
    },
    {
      name: "Shapes",
      selector: (row) => (row.shapes ? row.shapes.join(", ") : "-"),
      center: true,
    },
    {
      name: "Connect Shape",
      selector: (row) => row.connectshape || "-",
      center: true,
    },
    {
      name: "Options",
      selector: (row) => (row.options ? row.options.join(", ") : "-"),
      center: true,
    },
    {
      name: "Points",
      selector: (row) => row.points || 0,
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
            <i className="fa fa-arrows-alt" style={{ fontSize: "small", color: "#494949" }}></i>
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
        {/* <H5>Alzheimer Question</H5> */}
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
          Add Question
        </Btn>
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        progressPending={loading}
        pagination
        striped
      />

      <AddAssessment modal={addModal} setModal={setAddModal} refresh={fetchData} />
      <UpdateAssessment modal={editModal} setModal={setEditModal} data={selected} refresh={fetchData} />
      <ViewAssessment modal={viewModal} setModal={setViewModal} data={selected} />
      <Delete isDelete={deleteModal} setIsDelete={setDeleteModal} onDelete={handleDelete} />
    </Fragment>
  );
};

export default AssessmentTable;