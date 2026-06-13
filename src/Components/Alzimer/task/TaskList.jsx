import React, { useEffect, useState, Fragment } from "react";
import DataTable from "react-data-table-component";
import { Col, Input, FormGroup, Form, Button, Spinner } from "reactstrap";
import { H5, Btn } from "../../../AbstractElements";
import Delete from "../../../CommonElements/deleteModal";
import alzheimerService from "../../../Services/alzheimer";
import AddTask from "./create";
import UpdateTask from "./update";
import ViewTask from "./view";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
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
      // Dummy data
      const dummyTasks = [
        {
          _id: "1",
          title: "Yoga Session",
          description: "Morning yoga routine",
          link: "https://youtube.com/yoga",
          thumbnail: "https://via.placeholder.com/120x80",
          category: "Fitness",
          activityTask: "Stretching",
        },
        {
          _id: "2",
          title: "Memory Game",
          description: "Play this card matching game",
          link: "https://games.com/memory",
          thumbnail: "https://via.placeholder.com/120x80",
          category: "Cognitive",
          activityTask: "Match Cards",
        },
      ];
      setTasks(dummyTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await alzheimerService.deleteTask(selected._id);
      setDeleteModal(false);
      fetchData();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const filteredData = tasks.filter((item) =>
    item.title?.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Thumbnail",
      cell: (row) =>
        row.thumbnail ? (
          <img
            src={row.thumbnail}
            alt="thumb"
            style={{ width: "80px", borderRadius: "6px" }}
          />
        ) : (
          "No Image"
        ),
    },
    {
      name: "Category",
      selector: (row) => row.category,
    },
    {
      name: "Activity Task",
      selector: (row) => row.activityTask,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex">
          <button
            onClick={() => {
              setSelected(row);
              setEditModal(true);
            }}
            className="btn btn-light p-1 mx-1"
          >
            <i className="fa fa-edit" />
          </button>
          <button
            onClick={() => {
              setSelected(row);
              setViewModal(true);
            }}
            className="btn btn-light p-1 mx-1"
          >
            <i className="fa fa-eye" />
          </button>
          <button
            onClick={() => {
              setSelected(row);
              setDeleteModal(true);
            }}
            className="btn btn-light p-1 mx-1"
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
        <H5>Tasks</H5>
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
          Add Task
        </Btn>
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        progressPending={loading}
        pagination
      />

      <AddTask modal={addModal} setModal={setAddModal} refresh={fetchData} />
      <UpdateTask modal={editModal} setModal={setEditModal} data={selected} refresh={fetchData} />
      <ViewTask modal={viewModal} setModal={setViewModal} data={selected} />
      <Delete isDelete={deleteModal} setIsDelete={setDeleteModal} onDelete={handleDelete} />
    </Fragment>
  );
};

export default TaskList;