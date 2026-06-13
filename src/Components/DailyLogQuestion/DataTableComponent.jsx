import React, { Fragment, useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import {
  Alert,
  Badge,
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner as ReactstrapSpinner,
} from "reactstrap";
import { Btn, H5, P, Spinner } from "../../AbstractElements";
import { toast } from "react-toastify";
import { normalizeApiError } from "../../Utils/errorHandler";
import dailyLogQuestionService from "../../Services/dailyLogQuestionService";
import AddModal from "./AddModal";
import EditModal from "./EditModal";

const OPTION_BASED_TYPES = new Set([
  "checkbox",
  "dropdown",
  "multiple choice",
  "multiple-choice",
  "multi-select",
  "multiselect",
  "radio",
  "select",
]);

const LOG_TYPE_LABELS = {
  alzheimer: "Alzheimer",
  autism: "Autism",
};

const getQuestionId = (question) => question?._id || question?.id || "";

const normalizeQuestions = (response) => {
  const items =
    response?.data?.questions ||
    response?.data?.data ||
    response?.data ||
    response?.questions ||
    response?.items ||
    response;

  return Array.isArray(items) ? items : [];
};

const normalizeQuestion = (response) => {
  const item =
    response?.data?.question ||
    response?.data?.data ||
    response?.data ||
    response?.question ||
    response;

  return item && typeof item === "object" && !Array.isArray(item) ? item : null;
};

const normalizeOption = (option) => {
  if (!option || typeof option !== "object") {
    return null;
  }

  const label = String(option?.label || option?.text || option?.value || "").trim();
  const rawScore = option?.score;
  const score = rawScore === "" || rawScore === null || rawScore === undefined ? "" : Number(rawScore);

  if (!label) {
    return null;
  }

  return {
    label,
    score: Number.isFinite(score) ? score : "",
  };
};

const normalizeOptions = (options) =>
  Array.isArray(options) ? options.map(normalizeOption).filter(Boolean) : [];

const formatOptionsSummary = (options) => {
  const normalizedOptions = normalizeOptions(options);

  if (!normalizedOptions.length) {
    return "No options";
  }

  const formatted = normalizedOptions.map((option) =>
    option.score === "" ? option.label : `${option.label} (${option.score})`
  );

  if (formatted.length <= 2) {
    return formatted.join(", ");
  }

  return `${formatted.slice(0, 2).join(", ")} +${formatted.length - 2} more`;
};

const getApiErrorMessage = (error, fallbackMessage) =>
  normalizeApiError(error, fallbackMessage).message;

const typeUsesOptions = (type) =>
  OPTION_BASED_TYPES.has(String(type || "").trim().toLowerCase());

const DataTableComponent = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedLogType, setSelectedLogType] = useState("alzheimer");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [viewQuestion, setViewQuestion] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [rowAction, setRowAction] = useState({ type: "", id: "" });

  const fetchQuestions = async ({ showLoader = false, logType = selectedLogType } = {}) => {
    if (showLoader) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      const response = await dailyLogQuestionService.getQuestions(logType);
      const normalizedQuestions = normalizeQuestions(response);

      setQuestions(normalizedQuestions);
      setErrorMessage("");
      return normalizedQuestions;
    } catch (error) {
      const message = getApiErrorMessage(error, "Failed to load daily log questions.");

      setErrorMessage(message);

      if (showLoader) {
        setQuestions([]);
      }

      return [];
    } finally {
      if (showLoader) {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchQuestions({ showLoader: true, logType: selectedLogType });
  }, [selectedLogType]);

  const filteredQuestions = useMemo(() => {
    const query = appliedSearch.trim().toLowerCase();

    if (!query) {
      return questions;
    }

    return questions.filter((question) => {
      const searchableValues = [
        question?.logType,
        question?.questionNo,
        question?.question,
        question?.type,
        formatOptionsSummary(question?.options),
      ];

      return searchableValues.some((value) =>
        String(value || "").toLowerCase().includes(query)
      );
    });
  }, [appliedSearch, questions]);

  const isRowBusy = (row) => {
    const rowId = getQuestionId(row);
    const deleteId = getQuestionId(selectedQuestion);

    return (
      (rowAction.id && rowAction.id === rowId) ||
      (deleteLoading && deleteId && deleteId === rowId)
    );
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setAppliedSearch(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setAppliedSearch("");
  };

  const handleCreateQuestion = async (payload) => {
    if (submitting) {
      return false;
    }

    setSubmitting(true);

    try {
      await dailyLogQuestionService.createQuestion(payload);
      toast.success("Daily log question created successfully.");
      setIsAddModalOpen(false);

      if (selectedLogType !== payload.logType) {
        setSelectedLogType(payload.logType);
      } else {
        await fetchQuestions();
      }

      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to create daily log question."));
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenView = async (row) => {
    const questionId = getQuestionId(row);

    if (!questionId) {
      toast.error("Question id is missing.");
      return;
    }

    setIsViewModalOpen(true);
    setViewLoading(true);
    setViewError("");
    setViewQuestion(null);
    setRowAction({ type: "view", id: questionId });

    try {
      const response = await dailyLogQuestionService.getQuestionById(questionId);
      setViewQuestion(normalizeQuestion(response) || row);
    } catch (error) {
      setViewError(getApiErrorMessage(error, "Failed to load question details."));
    } finally {
      setViewLoading(false);
      setRowAction({ type: "", id: "" });
    }
  };

  const handleOpenEdit = async (row) => {
    const questionId = getQuestionId(row);

    if (!questionId) {
      toast.error("Question id is missing.");
      return;
    }

    setRowAction({ type: "edit", id: questionId });

    try {
      const response = await dailyLogQuestionService.getQuestionById(questionId);
      setSelectedQuestion(normalizeQuestion(response) || row);
      setIsEditModalOpen(true);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to load question for editing."));
    } finally {
      setRowAction({ type: "", id: "" });
    }
  };

  const handleUpdateQuestion = async (payload) => {
    const questionId = getQuestionId(selectedQuestion);

    if (!questionId || submitting) {
      return false;
    }

    setSubmitting(true);

    try {
      await dailyLogQuestionService.updateQuestion(questionId, payload);
      toast.success("Daily log question updated successfully.");
      setIsEditModalOpen(false);
      setSelectedQuestion(null);

      if (selectedLogType !== payload.logType) {
        setSelectedLogType(payload.logType);
      } else {
        await fetchQuestions();
      }

      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update daily log question."));
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteQuestion = async () => {
    const questionId = getQuestionId(selectedQuestion);

    if (!questionId || deleteLoading) {
      return;
    }

    setDeleteLoading(true);

    try {
      await dailyLogQuestionService.deleteQuestion(questionId);
      toast.success("Daily log question deleted successfully.");
      setIsDeleteModalOpen(false);
      setSelectedQuestion(null);
      await fetchQuestions();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to delete daily log question."));
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    {
      name: "Log Type",
      cell: (row) => (
        <Badge color={String(row?.logType || "").toLowerCase() === "autism" ? "warning" : "primary"}>
          {LOG_TYPE_LABELS[String(row?.logType || "").toLowerCase()] || row?.logType || "N/A"}
        </Badge>
      ),
      center: true,
      minWidth: "120px",
    },
    {
      name: "Question No.",
      selector: (row) => row?.questionNo ?? "-",
      sortable: true,
      center: true,
      width: "130px",
    },
    {
      name: "Question",
      selector: (row) => row?.question || "N/A",
      sortable: true,
      grow: 1.8,
      wrap: true,
    },
    {
      name: "Type",
      cell: (row) => (
        <Badge color={typeUsesOptions(row?.type) ? "success" : "light"}>
          {row?.type || "N/A"}
        </Badge>
      ),
      center: true,
      minWidth: "120px",
    },
    {
      name: "Options",
      selector: (row) => formatOptionsSummary(row?.options),
      grow: 1.5,
      wrap: true,
    },
    {
      name: "Actions",
      center: true,
      minWidth: "180px",
      cell: (row) => {
        const isBusy = isRowBusy(row);

        return (
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-light p-2"
              title="View"
              disabled={isBusy}
              onClick={() => handleOpenView(row)}
            >
              <i className="fa fa-eye" style={{ fontSize: "15px", color: "#494949" }}></i>
            </button>
            <button
              type="button"
              className="btn btn-light p-2"
              title="Edit"
              disabled={isBusy}
              onClick={() => handleOpenEdit(row)}
            >
              <i className="fa fa-edit" style={{ fontSize: "15px", color: "#494949" }}></i>
            </button>
            <button
              type="button"
              className="btn btn-light p-2"
              title="Delete"
              disabled={isBusy}
              onClick={() => {
                setSelectedQuestion(row);
                setIsDeleteModalOpen(true);
              }}
            >
              <i className="fa fa-trash-o" style={{ fontSize: "15px", color: "#dc3545" }}></i>
            </button>
          </div>
        );
      },
    },
  ];

  if (loading) {
    return (
      <Col className="vh-100 d-flex align-items-center justify-content-center">
        <div className="loader-box">
          <Spinner attrSpinner={{ className: "loader-5" }} />
        </div>
      </Col>
    );
  }

  return (
    <Fragment>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <div>
          <H5 attrH4={{ className: "text-muted m-0" }}>Daily Log Questions</H5>
          <small className="text-muted">
            {filteredQuestions.length || 0} questions in {LOG_TYPE_LABELS[selectedLogType] || selectedLogType}
            {refreshing ? " | Refreshing..." : ""}
          </small>
        </div>
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <Input
            type="select"
            value={selectedLogType}
            onChange={(event) => setSelectedLogType(event.target.value)}
            style={{ width: "150px" }}
            disabled={refreshing || submitting || deleteLoading}
          >
            <option value="alzheimer">Alzheimer</option>
            <option value="autism">Autism</option>
          </Input>
          <Btn
            attrBtn={{
              color: "light",
              onClick: () => fetchQuestions(),
              disabled: refreshing || submitting || deleteLoading,
            }}
          >
            Refresh
          </Btn>
          <Btn
            attrBtn={{
              color: "primary",
              onClick: () => setIsAddModalOpen(true),
              disabled: submitting,
            }}
          >
            Add Question
          </Btn>
        </div>
      </div>

      {errorMessage ? (
        <Alert color="danger" className="mb-3">
          {errorMessage}
        </Alert>
      ) : null}

      <Form onSubmit={handleSearchSubmit} className="mb-3">
        <FormGroup>
          <div className="d-flex flex-wrap gap-3 align-items-center">
            <Input
              type="text"
              placeholder="Search by question, log type, type or options..."
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              style={{ maxWidth: "420px" }}
            />
            <Btn attrBtn={{ color: "primary", type: "submit" }}>Search</Btn>
            {appliedSearch ? (
              <Button color="secondary" type="button" onClick={handleClearSearch}>
                Clear
              </Button>
            ) : null}
          </div>
        </FormGroup>
      </Form>

      <DataTable
        data={filteredQuestions}
        columns={columns}
        striped
        highlightOnHover
        responsive
        pagination
        noDataComponent={
          <div className="py-4 text-muted">
            {appliedSearch
              ? "No matching daily log questions found."
              : `No daily log questions found for ${LOG_TYPE_LABELS[selectedLogType] || selectedLogType}.`}
          </div>
        }
      />

      <AddModal
        isOpen={isAddModalOpen}
        toggle={() => setIsAddModalOpen((prev) => !prev)}
        onSubmit={handleCreateQuestion}
        submitting={submitting}
      />

      <EditModal
        isOpen={isEditModalOpen}
        toggle={() => {
          setIsEditModalOpen(false);
          setSelectedQuestion(null);
        }}
        questionData={selectedQuestion}
        onSubmit={handleUpdateQuestion}
        submitting={submitting}
      />

      <Modal
        isOpen={isViewModalOpen}
        toggle={() => {
          setIsViewModalOpen(false);
          setViewQuestion(null);
          setViewError("");
        }}
        centered
        size="lg"
      >
        <ModalHeader
          toggle={() => {
            setIsViewModalOpen(false);
            setViewQuestion(null);
            setViewError("");
          }}
        >
          View Daily Log Question
        </ModalHeader>
        <ModalBody>
          {viewLoading ? (
            <div className="d-flex justify-content-center py-4">
              <ReactstrapSpinner color="primary" />
            </div>
          ) : viewError ? (
            <Alert color="danger" className="mb-0">
              {viewError}
            </Alert>
          ) : viewQuestion ? (
            <div className="d-flex flex-column gap-3">
              <p className="mb-0">
                <strong>Log Type:</strong>{" "}
                {LOG_TYPE_LABELS[String(viewQuestion?.logType || "").toLowerCase()] || viewQuestion?.logType || "N/A"}
              </p>
              <p className="mb-0">
                <strong>Question No.:</strong> {viewQuestion?.questionNo ?? "-"}
              </p>
              <p className="mb-0">
                <strong>Question:</strong> {viewQuestion?.question || "N/A"}
              </p>
              <p className="mb-0">
                <strong>Type:</strong> {viewQuestion?.type || "N/A"}
              </p>
              <div>
                <strong>Options:</strong>
                {normalizeOptions(viewQuestion?.options).length ? (
                  <ul className="mb-0 mt-2 ps-3">
                    {normalizeOptions(viewQuestion?.options).map((option, index) => (
                      <li key={`${option.label}-${index}`}>
                        {option.score === "" ? option.label : `${option.label} - ${option.score}`}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <P attrPara={{ className: "mb-0 mt-2 text-muted" }}>No options available.</P>
                )}
              </div>
            </div>
          ) : (
            <P attrPara={{ className: "mb-0 text-muted" }}>No question details available.</P>
          )}
        </ModalBody>
        <ModalFooter>
          <Btn
            attrBtn={{
              color: "secondary",
              onClick: () => {
                setIsViewModalOpen(false);
                setViewQuestion(null);
                setViewError("");
              },
            }}
          >
            Close
          </Btn>
        </ModalFooter>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        toggle={() => {
          if (!deleteLoading) {
            setIsDeleteModalOpen(false);
            setSelectedQuestion(null);
          }
        }}
        centered
      >
        <ModalHeader
          toggle={() => {
            if (!deleteLoading) {
              setIsDeleteModalOpen(false);
              setSelectedQuestion(null);
            }
          }}
        >
          Delete Daily Log Question
        </ModalHeader>
        <ModalBody>
          <P attrPara={{ className: "mb-0 text-muted" }}>
            {`Are you sure you want to delete "${
              selectedQuestion?.question || "this question"
            }"? This action cannot be undone.`}
          </P>
        </ModalBody>
        <ModalFooter>
          <Btn
            attrBtn={{
              color: "secondary",
              onClick: () => {
                if (!deleteLoading) {
                  setIsDeleteModalOpen(false);
                  setSelectedQuestion(null);
                }
              },
              disabled: deleteLoading,
            }}
          >
            Cancel
          </Btn>
          <Btn
            attrBtn={{
              color: "danger",
              onClick: handleDeleteQuestion,
              disabled: deleteLoading,
            }}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Btn>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
};

export default DataTableComponent;
