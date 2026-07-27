import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Col,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import { Btn } from "../../AbstractElements";

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

const ANSWER_TYPE_OPTIONS = [
  { label: "Radio", value: "radio" },
  { label: "Checkbox", value: "checkbox" },
  { label: "Dropdown", value: "dropdown" },
  { label: "Select", value: "select" },
  { label: "Multi Select", value: "multi-select" },
  { label: "Text", value: "text" },
  { label: "Voice", value: "voice" },
];

const createEmptyOption = () => ({
  label: "",
  score: "",
});

const modalBodyStyles = {
  padding: "0.65rem 0.9rem",
  maxHeight: "58vh",
  overflowY: "auto",
  msOverflowStyle: "none",
  scrollbarWidth: "none",
};

const initialForm = {
  questionNo: "",
  question: "",
  description: "",
  type: "radio",
  maxScore: "",
  isRequired: true,
  options: [createEmptyOption()],
};

const normalizeType = (value) => String(value || "").trim().toLowerCase();

const typeUsesOptions = (type) => OPTION_BASED_TYPES.has(normalizeType(type));

const buildPayload = (formData) => ({
  questionNo: Number(formData.questionNo),
  question: String(formData.question || "").trim(),
  description: String(formData.description || "").trim(),
  type: String(formData.type || "").trim(),
  maxScore: Number(formData.maxScore),
  isRequired: Boolean(formData.isRequired),
  options: typeUsesOptions(formData.type)
    ? formData.options
        .map((option) => ({
          label: String(option?.label || "").trim(),
          score: Number(option?.score),
        }))
        .filter((option) => option.label)
    : [],
});

const AddModal = ({ isOpen, toggle, onSubmit, submitting }) => {
  const [formData, setFormData] = useState(initialForm);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialForm);
      setTouched({});
    }
  }, [isOpen]);

  const errors = useMemo(() => {
    const nextErrors = {};
    const questionNo = Number(formData.questionNo);
    const maxScore = Number(formData.maxScore);

    if (String(formData.questionNo).trim() === "") {
      nextErrors.questionNo = "Question number is required.";
    } else if (!Number.isFinite(questionNo) || !Number.isInteger(questionNo) || questionNo < 0) {
      nextErrors.questionNo = "Question number must be a whole number greater than or equal to 0.";
    }

    if (!String(formData.question || "").trim()) {
      nextErrors.question = "Question is required.";
    }

    if (!String(formData.type || "").trim()) {
      nextErrors.type = "Answer type is required.";
    }

    if (String(formData.maxScore).trim() === "") {
      nextErrors.maxScore = "Max score is required.";
    } else if (!Number.isFinite(maxScore)) {
      nextErrors.maxScore = "Max score must be a valid number.";
    }

    if (typeUsesOptions(formData.type)) {
      const normalizedOptions = formData.options.filter(
        (option) => String(option?.label || "").trim() || String(option?.score || "").trim()
      );

      if (!normalizedOptions.length) {
        nextErrors.options = "Add at least one option for the selected answer type.";
      } else if (
        normalizedOptions.some(
          (option) =>
            !String(option?.label || "").trim() ||
            String(option?.score).trim() === "" ||
            !Number.isFinite(Number(option?.score))
        )
      ) {
        nextErrors.options = "Each option needs a label and a valid score.";
      }
    }

    return nextErrors;
  }, [formData]);

  const handleInputChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === "isRequired" ? value === "true" : value,
    }));
  };

  const handleOptionChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((option, optionIndex) =>
        optionIndex === index
          ? {
              ...option,
              [field]: value,
            }
          : option
      ),
    }));
  };

  const handleAddOption = () => {
    if (submitting) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, createEmptyOption()],
    }));
  };

  const handleRemoveOption = (index) => {
    if (submitting) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      options:
        prev.options.length === 1
          ? [createEmptyOption()]
          : prev.options.filter((_, optionIndex) => optionIndex !== index),
    }));
  };

  const handleBlur = ({ target: { name } }) => {
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleSave = async () => {
    setTouched({
      questionNo: true,
      question: true,
      description: true,
      type: true,
      maxScore: true,
      isRequired: true,
      options: true,
    });

    if (Object.keys(errors).length > 0 || submitting) {
      return;
    }

    await onSubmit(buildPayload(formData));
  };

  return (
    <>
      <style>{`
        .caregiver-question-modal.modal-dialog {
          width: calc(100% - 1.5rem);
          max-width: 620px;
          margin: 0 auto;
        }

        .caregiver-question-modal .modal-content {
          width: 100%;
        }

        .caregiver-question-modal .modal-body::-webkit-scrollbar {
          width: 0;
          height: 0;
        }

        .caregiver-question-modal .form-group {
          margin-bottom: 0.5rem;
        }

        .caregiver-question-modal label {
          font-size: 0.8rem;
          margin-bottom: 0.2rem;
        }

        .caregiver-question-modal .form-control,
        .caregiver-question-modal select.form-control {
          padding: 0.35rem 0.6rem;
          font-size: 0.85rem;
          height: auto;
        }

        .caregiver-question-modal .option-row {
          margin-bottom: 0.35rem;
        }

        .caregiver-question-modal hr {
          margin: 0.5rem 0;
        }
      `}</style>
      <Modal isOpen={isOpen} toggle={toggle} centered size="md" modalClassName="caregiver-question-modal">
        <ModalHeader toggle={toggle} style={{ padding: "0.6rem 0.9rem" }}>
          Add Caregiver Question
        </ModalHeader>
        <ModalBody style={modalBodyStyles}>
          <Row className="g-2">
            <Col md="6">
              <FormGroup>
                <Label>Question number</Label>
                <Input
                  name="questionNo"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.questionNo}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  invalid={Boolean(touched.questionNo && errors.questionNo)}
                />
                <FormFeedback>{errors.questionNo}</FormFeedback>
              </FormGroup>
            </Col>

            <Col md="6">
              <FormGroup>
                <Label>Required</Label>
                <Input
                  name="isRequired"
                  type="select"
                  value={String(formData.isRequired)}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Input>
              </FormGroup>
            </Col>

            <Col md="12">
              <FormGroup>
                <Label>Question</Label>
                <Input
                  name="question"
                  placeholder="How is the patient's mood?"
                  value={formData.question}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  invalid={Boolean(touched.question && errors.question)}
                />
                <FormFeedback>{errors.question}</FormFeedback>
              </FormGroup>
            </Col>

            <Col md="12">
              <FormGroup>
                <Label>Description (optional)</Label>
                <Input
                  name="description"
                  placeholder="Add context for this question"
                  value={formData.description}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
              </FormGroup>
            </Col>

            <Col md="8">
              <FormGroup>
                <Label>Answer type</Label>
                <Input
                  name="type"
                  type="select"
                  value={formData.type}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  invalid={Boolean(touched.type && errors.type)}
                >
                  {ANSWER_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Input>
                <FormFeedback>{errors.type}</FormFeedback>
              </FormGroup>
            </Col>

            <Col md="4">
              <FormGroup>
                <Label>Max score</Label>
                <Input
                  name="maxScore"
                  type="number"
                  step="any"
                  value={formData.maxScore}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  invalid={Boolean(touched.maxScore && errors.maxScore)}
                />
                <FormFeedback>{errors.maxScore}</FormFeedback>
              </FormGroup>
            </Col>

            <Col md="12">
              <hr />
            </Col>

            <Col md="12">
              <FormGroup className="mb-0">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <Label className="mb-0">Options</Label>
                  {typeUsesOptions(formData.type) ? (
                    <Button
                      color="light"
                      size="sm"
                      type="button"
                      onClick={handleAddOption}
                      disabled={submitting}
                    >
                      + Add option
                    </Button>
                  ) : null}
                </div>

                {typeUsesOptions(formData.type) ? (
                  <div className="d-flex flex-column">
                    {formData.options.map((option, index) => (
                      <Row key={`caregiver-create-option-${index}`} className="g-1 align-items-center option-row">
                        <Col md="8">
                          <Input
                            placeholder="Option label"
                            value={option.label}
                            onChange={(event) => handleOptionChange(index, "label", event.target.value)}
                          />
                        </Col>
                        <Col md="3">
                          <Input
                            type="number"
                            step="any"
                            placeholder="Score"
                            value={option.score}
                            onChange={(event) => handleOptionChange(index, "score", event.target.value)}
                          />
                        </Col>
                        <Col md="1">
                          <Button
                            color="light"
                            size="sm"
                            type="button"
                            className="w-100 border"
                            onClick={() => handleRemoveOption(index)}
                            disabled={submitting}
                          >
                            x
                          </Button>
                        </Col>
                      </Row>
                    ))}
                  </div>
                ) : (
                  <small className="text-muted">This answer type does not require options.</small>
                )}

                {touched.options && errors.options ? (
                  <div className="text-danger mt-1" style={{ fontSize: "0.8rem" }}>
                    {errors.options}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter style={{ padding: "0.6rem 0.9rem" }}>
          <Btn attrBtn={{ color: "secondary", size: "sm", onClick: toggle, disabled: submitting }}>
            Cancel
          </Btn>
          <Btn attrBtn={{ color: "primary", size: "sm", onClick: handleSave, disabled: submitting }}>
            {submitting ? "Saving..." : "Save question"}
          </Btn>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default AddModal;