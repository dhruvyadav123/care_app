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
import { Btn, Image, Spinner } from "../../AbstractElements";
import { BASE_URL } from "../../Config/AppConstant";

export default function DataTableComponent() {
  const [quizList, setQuizList] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [editQuestion, setEditQuestion] = useState(null);

  const toggleViewModal = () => setViewModal(!viewModal);
  const toggleEditModal = () => setEditModal(!editModal);

  // Fetch quizzes
  const fetchQuizList = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/quiz/getAllQuiz`);
      setQuizList(res.data.data);
    } catch (err) {
      console.log("Fetching error:", err);
    }
  };

  useEffect(() => {
    fetchQuizList();
  }, []);

  // Update Question
  const handleUpdateQuestion = async () => {
    try {
      const payload = {
        questionNo: editQuestion.questionNo,
        questionText: editQuestion.questionText,
        imageUrl: editQuestion.imageUrl,
        correctAnswer: editQuestion.correctAnswer,
        coins: editQuestion.coins,
        options: editQuestion.options,
      };

      await axios.put(
        `${BASE_URL}/api/quiz/updateQuestion/${selectedQuiz._id}/${editQuestion._id}`,
        payload
      );

      alert("Question updated successfully!");
      toggleEditModal();
      fetchQuizList();
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
      name: "Age Range",
      selector: (row) => row.age_range,
    },
    {
      name: "Total Questions",
      selector: (row) => row.totalQuestions,
    },
    {
      name: "Thumbnail",
      cell: (row) => (
        <Image
          attrImage={{
            className: "img-60 rounded-circle",
            src: `${BASE_URL}${row.questions?.[0]?.imageUrl}`,
            alt: "thumbnail",
          }}
        />
      ),
    },
    {
      name: "Actions",
      center: true,
      cell: (row) => (
        <button
          className="btn btn-sm btn-outline-primary px-3"
          onClick={() => {
            setSelectedQuiz(row);
            toggleViewModal();
          }}
        >
          View Questions
        </button>
      ),
    },
  ];

  return (
    <>
      {/* MAIN TABLE */}
      <div className="card shadow p-4">
        <h4 className="mb-3 fw-bold text-primary">Animal Quiz List</h4>

        <DataTable
          columns={columns}
          data={quizList}
          pagination
          highlightOnHover
          striped
          responsive
          customStyles={{
            headCells: {
              style: {
                fontWeight: "bold",
                fontSize: "14px",
              },
            },
          }}
        />
      </div>

      {/* VIEW QUESTIONS MODAL */}
      {selectedQuiz && (
        <Modal isOpen={viewModal} toggle={toggleViewModal} size="lg">
          <ModalHeader toggle={toggleViewModal} className="fw-bold">
            {selectedQuiz.title} — All Questions
          </ModalHeader>

          <ModalBody>
            {selectedQuiz.questions?.map((q) => (
              <div
                key={q._id}
                className="p-3 mb-4 border rounded shadow-sm bg-white"
                style={{ borderLeft: "5px solid #0d6efd" }}
              >
                {/* QUESTION HEADER */}
                <div className="d-flex justify-content-between align-items-start">
                  <h5 className="fw-bold text-dark mb-2">
                    {q.questionNo}. {q.questionText}
                  </h5>

                  {/* EDIT BUTTON */}
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => {
                      setEditQuestion(q);
                      toggleEditModal();
                    }}
                  >
                    Edit
                  </button>
                </div>

                {/* IMAGE */}
                <div className="text-center my-3">
                  <img
                    src={q.imageUrl}
                    className="rounded border"
                    style={{
                      width: "180px",
                      height: "180px",
                      objectFit: "contain",
                      background: "#f8f9fa",
                      padding: "8px",
                      borderRadius: "10px",
                    }}
                    alt="question"
                  />
                </div>

                {/* ANSWER */}
                <p className="mt-2 mb-1">
                  <strong className="text-primary">Correct Answer:</strong>{" "}
                  <span className="badge bg-success">{q.correctAnswer}</span>
                </p>

                {/* OPTIONS */}
                <div className="mt-3">
                  <strong className="text-dark">Options:</strong>
                  <div className="mt-2">
                    {q.options.map((op) => (
                      <div
                        key={op._id}
                        className="p-2 border rounded mb-2 d-flex justify-content-between align-items-center"
                        style={{
                          background: op.isCorrect ? "#d1f7d1" : "#f8f9fa",
                          borderLeft: op.isCorrect ? "5px solid #198754" : "5px solid #ced4da",
                        }}
                      >
                        <span className="fw-semibold">{op.text}</span>

                        {op.isCorrect && (
                          <span className="badge bg-success px-3 py-2">Correct</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </ModalBody>
        </Modal>
      )}

      {/* EDIT QUESTION MODAL */}
      {editQuestion && (
        <Modal isOpen={editModal} toggle={toggleEditModal} size="lg">
          <ModalHeader toggle={toggleEditModal} className="fw-bold">
            Edit Question #{editQuestion.questionNo}
          </ModalHeader>

          <ModalBody>
            {/* Question Text */}
            <FormGroup className="mb-3">
              <Label className="fw-bold">Question Text</Label>
              <Input
                value={editQuestion.questionText}
                onChange={(e) =>
                  setEditQuestion({
                    ...editQuestion,
                    questionText: e.target.value,
                  })
                }
              />
            </FormGroup>

            {/* Image */}
            <FormGroup className="mb-3">
              <Label className="fw-bold">Image URL</Label>
              <Input
                value={editQuestion.imageUrl}
                onChange={(e) =>
                  setEditQuestion({
                    ...editQuestion,
                    imageUrl: e.target.value,
                  })
                }
              />
            </FormGroup>

            {/* Correct Answer */}
            <FormGroup className="mb-3">
              <Label className="fw-bold">Correct Answer</Label>
              <Input
                value={editQuestion.correctAnswer}
                onChange={(e) =>
                  setEditQuestion({
                    ...editQuestion,
                    correctAnswer: e.target.value,
                  })
                }
              />
            </FormGroup>

            {/* Coins */}
            <FormGroup className="mb-3">
              <Label className="fw-bold">Coins</Label>
              <Input
                type="number"
                value={editQuestion.coins}
                onChange={(e) =>
                  setEditQuestion({
                    ...editQuestion,
                    coins: e.target.value,
                  })
                }
              />
            </FormGroup>

            {/* Options */}
            <Label className="fw-bold">Options</Label>

            {editQuestion.options.map((op, i) => (
              <div
                key={i}
                className="p-2 border rounded d-flex align-items-center gap-3 mb-3"
                style={{
                  background: op.isCorrect ? "#d1f7d1" : "#f8f9fa",
                  borderLeft: op.isCorrect ? "5px solid #198754" : "5px solid #ced4da",
                }}
              >
                {/* Option Text */}
                <Input
                  value={op.text}
                  onChange={(e) => {
                    const updated = [...editQuestion.options];
                    updated[i].text = e.target.value;
                    setEditQuestion({ ...editQuestion, options: updated });
                  }}
                />

                {/* Checkbox - Only One Correct Allowed */}
                <div className="d-flex align-items-center ms-2">
                  <Input
                    type="checkbox"
                    checked={op.isCorrect}
                    onChange={() => {
                      const updated = editQuestion.options.map((opt, idx) => ({
                        ...opt,
                        isCorrect: idx === i, // Only one correct
                      }));

                      setEditQuestion({ ...editQuestion, options: updated });

                      // Also update correctAnswer field automatically
                      setEditQuestion((prev) => ({
                        ...prev,
                        correctAnswer: updated[i].text,
                      }));
                    }}
                  />
                  <Label className="ms-2 mb-0">Correct</Label>
                </div>
              </div>
            ))}

            <div className="text-end mt-4">
              <Button color="success" className="px-4" onClick={handleUpdateQuestion}>
                Save Changes
              </Button>
            </div>
          </ModalBody>
        </Modal>
      )}

    </>
  );
}
