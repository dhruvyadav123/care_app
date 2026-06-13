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

  const getLessonQueryParams = () => {
    if (typeof window === "undefined") return { childId: "", quizId: "" };
    const params = new URLSearchParams(window.location.search);
    const childId = (localStorage.getItem("childId") || params.get("childId") || "").toString().trim();
    const quizId = (localStorage.getItem("quizId") || params.get("quizId") || "").toString().trim();

    return { childId, quizId };
  };

  // Fetch Lessons
  const fetchLessons = async () => {
    const token = localStorage.getItem("token");
    const { childId, quizId } = getLessonQueryParams();
    const endpoint = `${API_URL}/admin/lessonsSix`;
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

  // Update Screen (Lesson 4 Payload)
  const handleUpdateScreen = async () => {
    try {
      const token = localStorage.getItem("token");

      const payload = {
        imageUrl: editScreen.imageUrl,
        question: editScreen.question,
        coinReward: editScreen.coinReward,
        options: editScreen.options,
        correctAnswer: editScreen.correctAnswer,
        screenNo: editScreen.screenNo,
      };

      await axios.put(
        `${BASE_URL}/api/quiz/updateScreenLession6/${selectedLesson._id}/${editScreen._id}`,
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
    // {
    //   name: "Thumbnail",
    //   width: "120px",
    //   cell: (row) => (
    //     <img
    //       src={row.screens[0]?.imageUrl || "/default-image.png"}
    //       style={{
    //         width: "55px",
    //         height: "55px",
    //         borderRadius: "10px",
    //         objectFit: "cover",
    //         border: "1px solid #ddd",
    //       }}
    //     />
    //   ),
    // },
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

                    {/* IMAGE */}
                    {/* <div className="p-2 bg-light">
                      <img
                        src={scr.imageUrl || "/default-image.png"}
                        className="img-fluid rounded"
                      style={{
                        height: "250px",
                        width: "100%",
                        objectFit: "contain",
                        background: "#fff",
                        padding: "10px"
                      }}
                      />
                    </div> */}

                    <div className="card-body">
                      <h6 className="fw-bold text-primary">Screen {index + 1}</h6>

                      <div className="mb-2">
                        <strong>Q:</strong> {scr.question}
                      </div>

                      <div className="mb-2">
                        <strong>Coins:</strong> {scr.coinReward}
                      </div>

                      <div className="mt-3">
                        <strong>Options</strong>

                        {scr.options?.map((op, i) => (
                          <div
                            key={i}
                            className="d-flex align-items-center gap-2 mb-2"
                          >
                            <span
                              className={`fw-bold px-2 py-1 rounded ${
                                scr.correctAnswer === op ? "bg-success text-white" : "bg-light"
                              }`}
                            >
                              {op}
                            </span>
                          </div>
                        ))}
                      </div>

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
                {/* <div
                  className="border rounded p-2 d-flex justify-content-center align-items-center"
                  style={{ height: "240px", background: "#f7f7f7" }}
                > */}
                  {/* <img
                    src={editScreen.imageUrl || "/default-image.png"}
                    className="img-fluid rounded"
                      style={{
                        height: "250px",
                        width: "100%",
                        objectFit: "contain",
                        background: "#fff",
                        padding: "10px"
                      }}                  /> */}
                {/* </div> */}

                {/* <FormGroup className="mt-3">
                  <Label className="fw-bold">Image URL</Label>
                  <Input
                    value={editScreen.imageUrl}
                    onChange={(e) =>
                      setEditScreen({ ...editScreen, imageUrl: e.target.value })
                    }
                  />
                </FormGroup> */}
              </div>

              <div className="col-md-7">
                <FormGroup className="mb-3">
                  <Label className="fw-bold">Question</Label>
                  <Input
                    value={editScreen.question}
                    onChange={(e) =>
                      setEditScreen({ ...editScreen, question: e.target.value })
                    }
                  />
                </FormGroup>

                <FormGroup className="mb-3">
                  <Label className="fw-bold">Coin Reward</Label>
                  <Input
                    type="number"
                    value={editScreen.coinReward}
                    onChange={(e) =>
                      setEditScreen({ ...editScreen, coinReward: Number(e.target.value) })
                    }
                  />
                </FormGroup>

                {/* OPTIONS */}
                <div className="border p-3 rounded bg-light">
                  <h6 className="fw-bold mb-3">Options</h6>

                  {editScreen.options?.map((op, idx) => {
                    const isCorrect = editScreen.correctAnswer === op;

                    return (
                      <div
                        key={idx}
                        className="d-flex align-items-center mb-3 p-2 rounded border"
                        style={{
                          backgroundColor: isCorrect ? "#d1f7d6" : "white",
                          border: isCorrect ? "2px solid #28a745" : "1px solid #ccc",
                        }}
                      >
                        <Input
                          value={op}
                          className="me-3"
                          onChange={(e) => {
                            const updated = [...editScreen.options];
                            updated[idx] = e.target.value;

                            let updateCorrect = editScreen.correctAnswer;
                            if (editScreen.correctAnswer === op) {
                              updateCorrect = e.target.value;
                            }

                            setEditScreen({
                              ...editScreen,
                              options: updated,
                              correctAnswer: updateCorrect,
                            });
                          }}
                        />

                        <Input
                          type="radio"
                          checked={isCorrect}
                          onChange={() =>
                            setEditScreen({ ...editScreen, correctAnswer: op })
                          }
                        />
                      </div>
                    );
                  })}
                </div>
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
