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

export default function Lesson10TableComponent() {
  const [lessonList, setLessonList] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedScreen, setSelectedScreen] = useState(null);

  const toggleViewModal = () => setViewModal(!viewModal);
  const toggleEditModal = () => setEditModal(!editModal);

  // Fetch Lessons
  const fetchLessonList = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(`${API_URL}/admin/lessonsTen`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLessonList(res.data?.data || res.data || []);
    } catch (err) {
      console.log("Fetching error:", err);
    }
  };

  useEffect(() => {
    fetchLessonList();
  }, []);

  // Handle Update Screen
  const handleUpdateScreen = async () => {
    try {
      const payload = {
        questionImage: selectedScreen.questionImage,
        instruction: selectedScreen.instruction,
        coinReward: selectedScreen.coinReward,
        levelTitle: selectedScreen.levelTitle,
        correctKeys: selectedScreen.correctKeys,
        options: selectedScreen.options,
        screenNo: selectedScreen.screenNo,

      };

      await axios.put(
        `${API_URL}/quiz/updateScreenLession10/${selectedLesson._id}/${selectedScreen._id}`,
        payload
      );

      alert("Screen updated successfully!");
      toggleEditModal();
      fetchLessonList();
    } catch (error) {
      console.log("Update error:", error);
      alert("Update failed");
    }
  };

  // TABLE COLUMNS
  const columns = [
    {
      name: "Title",
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
      name: "Description",
      selector: (row) => row.description,
      wrap: true,
    },
    {
      name: "Total Screens",
      selector: (row) => row.screens?.length || 0,
    },
    {
      name: "Actions",
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
        <h4 className="mb-3 fw-bold text-primary">Lesson 10 Screens</h4>

        <DataTable
          columns={columns}
          data={lessonList}
          pagination
          highlightOnHover
          striped
          responsive
        />
      </div>

      {/* VIEW SCREENS MODAL */}
      {selectedLesson && (
        <Modal isOpen={viewModal} toggle={toggleViewModal} size="lg">
          <ModalHeader toggle={toggleViewModal} className="fw-bold">
            {selectedLesson.title} — All Screens
          </ModalHeader>

          <ModalBody>
            {selectedLesson.screens?.map((scr) => (
              <div
                key={scr._id}
                className="p-3 mb-4 border rounded shadow-sm bg-white"
                style={{ borderLeft: "5px solid #0d6efd" }}
              >
                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-start">
                  <h5 className="fw-bold text-dark mb-1">
                    {scr.levelTitle}
                  </h5>

                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => {
                      setSelectedScreen(scr);
                      toggleEditModal();
                    }}
                  >
                    Edit
                  </button>
                </div>

                {/* Instruction */}
                <p className="text-secondary mb-2">{scr.instruction}</p>

                {/* IMAGE */}
                <div className="text-center my-3">
                  <img
                    src={`${BASE_URL}${scr.questionImage}`}
                    className="rounded border"
                    style={{
                      width: "200px",
                      height: "200px",
                      objectFit: "contain",
                      background: "#f8f9fa",
                      padding: "8px",
                      borderRadius: "10px",
                    }}
                    alt="screen"
                  />
                </div>

                {/* COIN */}
                <p className="mt-2 mb-1">
                  <strong className="text-primary">Coins: </strong>
                  <span className="badge bg-info">{scr.coinReward}</span>
                </p>

                {/* CORRECT KEYS */}
                <p className="mt-1">
                  <strong>Correct Keys:</strong>{" "}
                  {scr.correctKeys?.map((c) => (
                    <span key={c} className="badge bg-success ms-2">
                      {c}
                    </span>
                  )) || "None"}
                </p>

                {/* OPTIONS LIST */}
                <div className="mt-3">
                  <strong className="text-dark">Options:</strong>

                  <div className="mt-2">
                    {scr.options.map((op, i) => (
                      <div
                        key={i}
                        className="p-2 border rounded mb-2 d-flex justify-content-between align-items-center"
                        style={{
                          background: scr.correctKeys.includes(op.key)
                            ? "#d1f7d1"
                            : "#f8f9fa",
                          borderLeft: scr.correctKeys.includes(op.key)
                            ? "5px solid #198754"
                            : "5px solid #ced4da",
                        }}
                      >
                        <span className="fw-semibold">{op.key}</span>

                        <img
                          src={`${BASE_URL}${op.imageUrl}`}
                          style={{
                            width: 70,
                            height: 70,
                            objectFit: "contain",
                            background: "#fff",
                            borderRadius: "8px",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </ModalBody>
        </Modal>
      )}

      {/* EDIT SCREEN MODAL */}
      {selectedScreen && (
        <Modal isOpen={editModal} toggle={toggleEditModal} size="lg">
          <ModalHeader toggle={toggleEditModal} className="fw-bold">
            Edit Screen — {selectedScreen.levelTitle}
          </ModalHeader>

          <ModalBody>
            {/* Level Title */}
            <FormGroup className="mb-3">
              <Label className="fw-bold">Level Title</Label>
              <Input
                value={selectedScreen.levelTitle}
                onChange={(e) =>
                  setSelectedScreen({
                    ...selectedScreen,
                    levelTitle: e.target.value,
                  })
                }
              />
            </FormGroup>

            {/* Instruction */}
            <FormGroup className="mb-3">
              <Label className="fw-bold">Instruction</Label>
              <Input
                value={selectedScreen.instruction}
                onChange={(e) =>
                  setSelectedScreen({
                    ...selectedScreen,
                    instruction: e.target.value,
                  })
                }
              />
            </FormGroup>

            {/* Coins */}
            <FormGroup className="mb-3">
              <Label className="fw-bold">Coins</Label>
              <Input
                type="number"
                value={selectedScreen.coinReward}
                onChange={(e) =>
                  setSelectedScreen({
                    ...selectedScreen,
                    coinReward: e.target.value,
                  })
                }
              />
            </FormGroup>

            {/* Question Image */}
            <FormGroup className="mb-3">
              <Label className="fw-bold">Question Image (URL)</Label>
              <Input
                value={selectedScreen.questionImage}
                onChange={(e) =>
                  setSelectedScreen({
                    ...selectedScreen,
                    questionImage: e.target.value,
                  })
                }
              />
            </FormGroup>

            {/* OPTIONS EDIT */}
            <Label className="fw-bold">Options</Label>

            <div className="d-flex flex-column gap-4 mb-4">
              {selectedScreen.options.map((op, i) => {
                const isSelected = selectedScreen.correctKeys.includes(op.key);

                return (
                  <div
                    key={i}
                    className="p-3 border rounded"
                    style={{
                      background: isSelected ? "#d1f7d1" : "#f8f9fa",
                      borderLeft: isSelected ? "5px solid #198754" : "5px solid #ced4da",
                      transition: "0.2s",
                    }}
                  >
                    {/* CLICKABLE TO SELECT CORRECT KEY */}
                    <div
                      className="d-flex justify-content-between align-items-center mb-3"
                      onClick={() => {
                        let updated = [...selectedScreen.correctKeys];

                        if (updated.includes(op.key)) {
                          updated = updated.filter((k) => k !== op.key);
                        } else {
                          updated.push(op.key);
                        }

                        setSelectedScreen({
                          ...selectedScreen,
                          correctKeys: updated,
                        });
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <strong style={{ fontSize: 16 }}>
                        {isSelected ? "✔ Correct" : "Select as Correct"}
                      </strong>

                      <img
                        src={`${BASE_URL}${op.imageUrl}`}
                        style={{
                          width: 70,
                          height: 70,
                          objectFit: "contain",
                          background: "#fff",
                          borderRadius: 8,
                        }}
                        alt=""
                      />
                    </div>

                    {/* EDIT OPTION KEY */}
                    <FormGroup className="mb-3">
                      <Label className="fw-bold">Option Key</Label>
                      <Input
                        value={op.key}
                        onChange={(e) => {
                          let updatedOptions = [...selectedScreen.options];
                          updatedOptions[i].key = e.target.value;

                          setSelectedScreen({
                            ...selectedScreen,
                            options: updatedOptions,
                          });
                        }}
                      />
                    </FormGroup>

                    {/* EDIT OPTION IMAGE */}
                    <FormGroup className="mb-3">
                      <Label className="fw-bold">Option Image URL</Label>
                      <Input
                        value={op.imageUrl}
                        onChange={(e) => {
                          let updatedOptions = [...selectedScreen.options];
                          updatedOptions[i].imageUrl = e.target.value;

                          setSelectedScreen({
                            ...selectedScreen,
                            options: updatedOptions,
                          });
                        }}
                      />
                    </FormGroup>

                    {/* IMAGE PREVIEW */}
                    <div className="text-center mt-2">
                      <img
                        src={`${BASE_URL}${op.imageUrl}`}
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: "contain",
                          background: "#fff",
                          borderRadius: 10,
                          padding: 5,
                          border: "1px solid #ddd",
                        }}
                        alt="preview"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
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
