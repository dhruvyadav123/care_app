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
    const endpoint = `${API_URL}/admin/lessonsThree`;
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
      const token = localStorage.getItem("token");

      const payload = {
        questionImage: editScreen.questionImage,
        coinReward: editScreen.coinReward,
        instruction: editScreen.instruction,
        options: editScreen.options,
        correctKey: editScreen.correctKey,
        screenNo: editScreen.screenNo
      };

      await axios.put(
        `${BASE_URL}/api/quiz/updateScreenLession3/${selectedLesson._id}/${editScreen._id}`,
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
                    <div className="p-2 bg-light">
                      <img
                        src={scr.questionImage || "/default-image.png"}
                        className="img-fluid rounded"
                        style={{ height: "180px", width: "100%", objectFit: "cover" }}
                      />
                    </div>

                    <div className="card-body">
                      <h6 className="fw-bold text-primary">Screen {index + 1}</h6>

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
                            <img
                              src={op.imageUrl || "/default-image.png"}
                              style={{
                                width: "60px",
                                height: "60px",
                                objectFit: "cover",
                                borderRadius: "6px",
                                border:
                                  scr.correctKey === op.key
                                    ? "3px solid #198754"
                                    : "1px solid #ddd",
                              }}
                            />

                            <span
                              className={`fw-bold ${scr.correctKey === op.key
                                  ? "text-success"
                                  : "text-dark"
                                }`}
                            >
                              {op.key.toUpperCase()}
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
      {editScreen && (
        <Modal size="lg" isOpen={editModal} toggle={toggleEditModal}>
          <ModalHeader toggle={toggleEditModal} className="fw-bold">
            Edit Screen
          </ModalHeader>

          <ModalBody>
            <div className="row">

              {/* LEFT SIDE - QUESTION IMAGE */}
              <div className="col-md-5 mb-3">
                <div
                  className="border rounded p-2 d-flex justify-content-center align-items-center"
                  style={{ height: "240px", background: "#f7f7f7" }}
                >
                  <img
                    src={editScreen.questionImage || "/default-image.png"}
                    className="img-fluid rounded"
                    style={{ height: "100%", width: "100%", objectFit: "cover" }}
                  />
                </div>

                {/* Question Image URL */}
                <FormGroup className="mt-3">
                  <Label className="fw-bold">Question Image URL</Label>
                  <Input
                    value={editScreen.questionImage}
                    onChange={(e) =>
                      setEditScreen({ ...editScreen, questionImage: e.target.value })
                    }
                    placeholder="Paste image URL"
                  />
                </FormGroup>
              </div>

              {/* RIGHT SIDE */}
              <div className="col-md-7">

                {/* Coin Reward */}
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

                {/* Instruction */}
                <FormGroup className="mb-3">
                  <Label className="fw-bold">Instruction</Label>
                  <Input
                    type="text"
                    value={editScreen.instruction}
                    onChange={(e) =>
                      setEditScreen({ ...editScreen, instruction: e.target.value })
                    }
                    placeholder="Enter instruction"
                  />
                </FormGroup>

                {/* OPTIONS */}
                <div className="border p-3 rounded bg-light">
                  <h6 className="fw-bold mb-3">Options</h6>

                  {editScreen.options?.map((op, idx) => {
                    const isCorrect = editScreen.correctKey === op.key;

                    return (
                      <div
                        key={op._id}
                        className="d-flex align-items-center mb-3 p-2 rounded border"
                        style={{
                          backgroundColor: isCorrect ? "#d1f7d6" : "white",
                          border: isCorrect ? "2px solid #28a745" : "1px solid #ccc",
                          transition: "0.2s ease",
                        }}
                      >
                        {/* Preview */}
                        <img
                          src={op.imageUrl || "/default-image.png"}
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "6px",
                            objectFit: "cover",
                            border: "1px solid #ccc",
                            marginRight: "10px",
                          }}
                        />

                        <div className="flex-grow-1">

                          {/* Image URL */}
                          <Input
                            value={op.imageUrl}
                            className="mb-2"
                            onChange={(e) => {
                              const updatedOptions = [...editScreen.options];
                              updatedOptions[idx].imageUrl = e.target.value;
                              setEditScreen({ ...editScreen, options: updatedOptions });
                            }}
                            placeholder="Image URL"
                          />

                          {/* Key */}
                          <Input
                            value={op.key}
                            onChange={(e) => {
                              const updated = [...editScreen.options];
                              const oldKey = updated[idx].key;
                              const newKey = e.target.value;

                              updated[idx].key = newKey;

                              // Fix correctKey if this key was selected earlier
                              let updatedCorrect = editScreen.correctKey;
                              if (editScreen.correctKey === oldKey) {
                                updatedCorrect = newKey;
                              }

                              setEditScreen({
                                ...editScreen,
                                options: updated,
                                correctKey: updatedCorrect,
                              });
                            }}
                            placeholder="Enter key"
                          />
                        </div>

                        {/* Correct Answer Radio */}
                        <div className="ms-3 text-center">
                          <Input
                            type="radio"
                            checked={isCorrect}
                            onChange={() =>
                              setEditScreen({ ...editScreen, correctKey: op.key })
                            }
                          />
                          <div className="fw-bold mt-1">{op.key}</div>
                        </div>
                      </div>
                    );
                  })}

                </div>
              </div>

            </div>

            {/* SAVE BUTTON */}
            <div className="text-end mt-4">
              <Button color="secondary" onClick={toggleEditModal}>
                Cancel
              </Button>
              <Button
                color="success"
                className="ms-2"
                onClick={handleUpdateScreen}
              >
                Save Changes
              </Button>
            </div>
          </ModalBody>
        </Modal>
      )}


    </>
  );
}
