"use client";

import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {
  Modal,
  ModalBody,
  ModalHeader,
  Button,
  Input,
  Label,
  FormGroup,
} from "reactstrap";
import axios from "axios";
import { API_URL, BASE_URL } from "../../Config/AppConstant";

export default function LessonTableComponent() {
  const [lessonList, setLessonList] = useState([]);

  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const [selectedLesson, setSelectedLesson] = useState(null);
  const [editScreen, setEditScreen] = useState(null);

  const toggleViewModal = () => setViewModal(!viewModal);
  const toggleEditModal = () => setEditModal(!editModal);

  // Fetch Lessons
  const fetchLessons = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(`${API_URL}/admin/lessonsNine`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLessonList(res.data.data);
    } catch (err) {
      console.log("Fetching error:", err);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  // Update Screen UI (NEW PAYLOAD)
  const handleUpdateScreen = async () => {
    try {
      const token = localStorage.getItem("token");

      const payload = {
        title: editScreen.title,
        content: editScreen.content,
        image: editScreen.image,
        coinReward: editScreen.coinReward,
        screenNo: editScreen.screenNo,
      };

      await axios.put(
        `${API_URL}/quiz/updateScreenLession9/${selectedLesson._id}/${editScreen._id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Screen updated successfully!");
      toggleEditModal();
      fetchLessons();
    } catch (error) {
      console.log("Update error:", error);
      alert("Update failed");
    }
  };

  // Table Columns
  const columns = [
    {
      name: "Lesson",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Age",
      selector: (row) => row.age_range,
      width: "120px",
    },
    {
      name: "Category",
      selector: (row) => row.category,
      width: "150px",
    },
    {
      name: "Screens",
      selector: (row) => row.totalScreens,
      width: "120px",
    },
    {
      name: "Description",
      selector: (row) => row.description,
      wrap: true,
    },
    {
      name: "Actions",
      width: "160px",
      center: true,
      cell: (row) => (
        <button
          className="btn btn-sm btn-outline-primary px-3"
          onClick={() => {
            setSelectedLesson(row);
            toggleViewModal();
          }}
        >
          View Screens
        </button>
      ),
    },
  ];

  return (
    <>
      <div className="card shadow p-4">
        <h4 className="mb-3 fw-bold text-primary">Lessons List</h4>

        <DataTable
          columns={columns}
          data={lessonList}
          pagination
          striped
          responsive
          highlightOnHover
        />
      </div>

      {/* VIEW SCREENS MODAL */}
      {selectedLesson && (
        <Modal isOpen={viewModal} toggle={toggleViewModal} size="xl">
          <ModalHeader toggle={toggleViewModal} className="fw-bold">
            {selectedLesson.title} — Screens
          </ModalHeader>

          <ModalBody className="bg-light">
            <div className="row">
              {selectedLesson.screens?.map((scr, index) => (
                <div key={scr._id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card shadow-sm border-0 h-100">

                    

                    <div className="card-body">
                      <h6 className="fw-bold text-primary">
                        Screen {scr.screenNo}
                      </h6>
                      <div className="p-2 ">
                        <img
                          src={scr.image || "/default-image.png"}
                          className="img-fluid rounded"
                          style={{
                            height: "250px",
                            width: "100%",
                            objectFit: "contain",
                            background: "#fff",
                            padding: "10px",
                          }}
                        />
                      </div>
                      <p>
                        <strong>Title:</strong> {scr.title}
                      </p>

                      {scr.content && (
                        <p>
                          <strong>Content:</strong> {scr.content}
                        </p>
                      )}

                      <p>
                        <strong>Coins:</strong> {scr.coinReward}
                      </p>

                      <div className="text-end mt-3">
                        <button
                          className="btn btn-warning btn-sm px-3"
                          onClick={() => {
                            setEditScreen(scr);
                            toggleEditModal();
                          }}
                        >
                          Edit Screen
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </ModalBody>
        </Modal>
      )}

      {/* EDIT SCREEN MODAL */}
      {editScreen && (
        <Modal size="lg" isOpen={editModal} toggle={toggleEditModal}>
          <ModalHeader toggle={toggleEditModal} className="fw-bold">
            Edit Screen
          </ModalHeader>

          <ModalBody>
            <div className="row">

              <div className="col-md-5 mb-3">
                <div className="border rounded p-2">
                  <img
                    src={editScreen.image || "/default-image.png"}
                    className="img-fluid rounded"
                    style={{
                      height: "250px",
                      width: "100%",
                      objectFit: "contain",
                      background: "#fff",
                      padding: "10px",
                    }}
                  />
                </div>

                <FormGroup className="mt-3">
                  <Label className="fw-bold">Image URL</Label>
                  <Input
                    value={editScreen.image}
                    onChange={(e) =>
                      setEditScreen({ ...editScreen, image: e.target.value })
                    }
                  />
                </FormGroup>
              </div>

              <div className="col-md-7">
                <FormGroup className="mb-3">
                  <Label className="fw-bold">Title</Label>
                  <Input
                    value={editScreen.title}
                    onChange={(e) =>
                      setEditScreen({ ...editScreen, title: e.target.value })
                    }
                  />
                </FormGroup>

               
                <FormGroup className="mb-3">
                  <Label className="fw-bold">Coin Reward</Label>
                  <Input
                    type="number"
                    value={editScreen.coinReward}
                    onChange={(e) =>
                      setEditScreen({
                        ...editScreen,
                        coinReward: Number(e.target.value),
                      })
                    }
                  />
                </FormGroup>
              </div>
            </div>

            <div className="text-end mt-4">
              <Button color="secondary" onClick={toggleEditModal}>
                Cancel
              </Button>
              <Button color="success" className="ms-2" onClick={handleUpdateScreen}>
                Save Changes
              </Button>
            </div>
          </ModalBody>
        </Modal>
      )}
    </>
  );
}
