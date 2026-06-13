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
import { Image } from "../../AbstractElements";
import { API_URL, BASE_URL } from "../../Config/AppConstant";

export default function LessonTableComponent() {
  const [lessonList, setLessonList] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const [selectedLesson, setSelectedLesson] = useState(null);
  const [editScreen, setEditScreen] = useState(null);

  const toggleViewModal = () => setViewModal(!viewModal);
  const toggleEditModal = () => setEditModal(!editModal);

  const getLessonQueryParams = () => {
    if (typeof window === "undefined") return { childId: "", quizId: "" };
    const params = new URLSearchParams(window.location.search);
    const childId = (localStorage.getItem("childId") || params.get("childId") || "").toString().trim();
    const quizId = (localStorage.getItem("quizId") || params.get("quizId") || "").toString().trim();

    return { childId, quizId };
  };

  // Fetch lessons
  const fetchLessons = async () => {
    const token = localStorage.getItem("token");
    const { childId, quizId } = getLessonQueryParams();
    const endpoint = `${API_URL}/admin/lessonsTwo`;
    const params = childId && quizId ? { childId, quizId } : {};

    try {
      const res = await axios.get(endpoint, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        params,
      });

      setLessonList(res.data?.data || []);
    } catch (err) {
      console.error("Fetching error:", err);
    }
  };
  useEffect(() => {
    fetchLessons();
  }, []);

  // Update Screen
  const handleUpdateScreen = async () => {
    try {
      const payload = {
        title: editScreen.title,
        imageUrl: editScreen.imageUrl,
        coinReward: editScreen.coinReward,
      };

      await axios.put(
        `${BASE_URL}/api/quiz/updateScreen/${selectedLesson._id}/${editScreen._id}`,
        payload
      );

      alert("Screen updated successfully!");
      toggleEditModal();
      fetchLessons();
    } catch (error) {
      console.log("Update error:", error);
      alert("Update failed");
    }
  };

  // TABLE COLUMNS
  const columns = [
    {
      name: "Lesson",
      selector: (row) => row.title,
      sortable: true,
      wrap: true,
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
      name: "Thumbnail",
      width: "120px",
      cell: (row) => (
        <img
          src={row.screens?.[0]?.imageUrl}
          style={{
            width: "55px",
            height: "55px",
            borderRadius: "10px",
            objectFit: "cover",
            border: "1px solid #ddd",
          }}
          alt="thumbnail"
        />
      ),
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
      {/* MAIN TABLE */}
      <div className="card shadow p-4">
        <h4 className="mb-3 fw-bold text-primary">Lessons List</h4>

        <DataTable
          columns={columns}
          data={lessonList}
          pagination
          highlightOnHover
          striped
          responsive
          pointerOnHover
        />
      </div>

      {/* VIEW SCREENS MODAL */}
      {selectedLesson && (
        <Modal size="xl" isOpen={viewModal} toggle={toggleViewModal}>
          <ModalHeader toggle={toggleViewModal} className="fw-bold">
            {selectedLesson.title} — {selectedLesson.totalScreens} Screens
          </ModalHeader>

          <ModalBody>
            <div className="row">
              {selectedLesson.screens.map((screen) => (
                <div key={screen._id} className="col-md-6 col-lg-4 mb-4">
                  <div
                    className="card h-100 shadow-sm"
                    style={{ borderLeft: "5px solid #0d6efd" }}
                  >
                    <img
                      src={screen.imageUrl}
                      className="card-img-top p-2"
                      style={{
                        height: "180px",
                        objectFit: "contain",
                        background: "#f8f9fa",
                        borderRadius: "10px",
                      }}
                    />

                    <div className="card-body">
                      <h6 className="fw-bold">{screen.screenNo}. {screen.title}</h6>

                      <p className="mt-2 mb-1">
                        <strong>Coins Reward:</strong>{" "}
                        <span className="badge bg-success">{screen.coinReward}</span>
                      </p>

                      <div className="text-end mt-3">
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => {
                            setEditScreen(screen);
                            toggleEditModal();
                          }}
                        >
                          Edit
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
            Edit Screen #{editScreen.screenNo}
          </ModalHeader>

          <ModalBody>
            {/* Screen Title */}
            <FormGroup className="mb-3">
              <Label className="fw-bold">Screen Title</Label>
              <Input
                value={editScreen.title}
                onChange={(e) =>
                  setEditScreen({ ...editScreen, title: e.target.value })
                }
              />
            </FormGroup>

            {/* Image URL */}
            <FormGroup className="mb-3">
              <Label className="fw-bold">Image URL</Label>
              <Input
                value={editScreen.imageUrl}
                onChange={(e) =>
                  setEditScreen({ ...editScreen, imageUrl: e.target.value })
                }
              />
            </FormGroup>

            {/* Coin Reward */}
            <FormGroup className="mb-3">
              <Label className="fw-bold">Coin Reward</Label>
              <Input
                type="number"
                value={editScreen.coinReward}
                onChange={(e) =>
                  setEditScreen({ ...editScreen, coinReward: e.target.value })
                }
              />
            </FormGroup>

            <div className="text-end mt-4">
              <Button color="success" className="px-4" onClick={handleUpdateScreen}>
                Save Changes
              </Button>
            </div>
          </ModalBody>
        </Modal>
      )}
    </>
  );
}
