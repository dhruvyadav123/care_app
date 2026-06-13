import React, { useEffect, useState, Fragment } from "react";
import DataTable from "react-data-table-component";
import { Input, FormGroup, Form } from "reactstrap";
import { H5, Btn } from "../../../AbstractElements";
import Delete from "../../../CommonElements/deleteModal";
import AddVideo from "./create";
import UpdateVideo from "./update";
import ViewVideo from "./view";
import alzheimerService from "../../../Services/alzheimer";
import { BASE_URL } from "../../../Config/AppConstant";

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. Please log in again.");
      return;
    }
    setLoading(true);
    try {
      const res = await alzheimerService.getAllVideos(); 
      setVideos(res.data || []);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      // await alzheimerService.deleteVideo(selected._id);
      setDeleteModal(false);
      fetchData();
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  const filteredData = videos.filter((item) =>
    item.title?.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => { 
    fetchData();
  }, []);
//
  const columns = [
     {
      name: "_id",
      selector: (row) => row._id,
      sortable: true,
    },
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
            src={`${BASE_URL}/uploads/${row.thumbnail}`}
            alt="thumbnail"
            style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 6 }}
          />
        ) : (
          "-"
        ),
    },
    {
      name: "Video",
      cell: (row) =>
        row.video ? (
          <a
            href={`${BASE_URL}/uploads/${row.video}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View
          </a>
        ) : (
          "-"
        ),
    },
    {
      name: "Uploaded By",
      selector: (row) => row.uploadedBy,
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
        <H5>Videos</H5>
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
          Add Video
        </Btn>
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        progressPending={loading}
        pagination
      />

      <AddVideo modal={addModal} setModal={setAddModal} refresh={fetchData} />
      <UpdateVideo
        modal={editModal}
        setModal={setEditModal}
        data={selected}
        refresh={fetchData}
      />
      <ViewVideo modal={viewModal} setModal={setViewModal} data={selected} />
      <Delete
        isDelete={deleteModal}
        setIsDelete={setDeleteModal}
        onDelete={handleDelete}
      />
    </Fragment>
  );
};

export default VideoList;
