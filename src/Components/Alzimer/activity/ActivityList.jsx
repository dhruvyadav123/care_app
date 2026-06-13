import React, { useState, useEffect, Fragment } from "react";
import DataTable from "react-data-table-component";
import { Button, Col, FormGroup, Input, Form, Spinner } from "reactstrap";
import { H5, Btn } from "../../../AbstractElements";
import Delete from "../../../CommonElements/deleteModal";
// import alzheimerService from "../../../Services/alzheimer";
import AddActivity from "./create";
import UpdateActivity from "./update";
import ViewActivity from "./view";

const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const dummyData = [
    {
      _id: "1",
      title: "Meditation Calm",
      thumbnail: "https://via.placeholder.com/80x50?text=Image",
      music: "",
    },
    {
      _id: "2",
      title: "Relaxing Sounds",
      thumbnail: "",
      music: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    },
    {
      _id: "3",
      title: "Nature Walk",
      thumbnail: "https://via.placeholder.com/80x50?text=Nature",
      music: "",
    },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      // Simulate delay
      setTimeout(() => {
        setActivities(dummyData);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching activities:", error);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const filtered = activities.filter((item) => item._id !== selected._id);
    setActivities(filtered);
    setDeleteModal(false);
  };

  const filteredData = activities.filter((item) =>
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
          <img src={row.thumbnail} alt="thumb" style={{ width: 60, borderRadius: 4 }} />
        ) : (
          "-"
        ),
    },
    {
      name: "Music",
      cell: (row) =>
        row.music ? (
          <audio controls style={{ width: 140 }}>
            <source src={row.music} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        ) : (
          "-"
        ),
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
        <H5>Activities</H5>
        <Form inline onSubmit={(e) => e.preventDefault()}>
          <FormGroup>
            <Input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </FormGroup>
        </Form>
        <Btn attrBtn={{ color: "primary", onClick: () => setAddModal(true) }}>
          Add Activity
        </Btn>
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        progressPending={loading}
        pagination
      />

      <AddActivity modal={addModal} setModal={setAddModal} refresh={fetchData} />
      <UpdateActivity modal={editModal} setModal={setEditModal} data={selected} refresh={fetchData} />
      <ViewActivity modal={viewModal} setModal={setViewModal} data={selected} />
      <Delete isDelete={deleteModal} setIsDelete={setDeleteModal} onDelete={handleDelete} />
    </Fragment>
  );
};

export default ActivityList;