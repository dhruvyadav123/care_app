import React, { useEffect, useMemo, useState } from "react";
import {
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

const initialForm = {
  questionNo: "",
  question: "",
  description: "",
  type: "",
  maxScore: "",
  isRequired: false,
  optionsText: "",
};


const normalizeType = (value) => String(value || "").trim().toLowerCase();

const typeUsesOptions = (type) => OPTION_BASED_TYPES.has(normalizeType(type));

const parseOptions = (value) =>
  String(value || "")
    .split(/\r?\n/)
    .map((option) => option.trim())
    .filter(Boolean);

const buildPayload = (formData) => {
  const normalizedType = String(formData.type || "").trim();
  const options = parseOptions(formData.optionsText);

  return {
    questionNo: Number(formData.questionNo),
    question: String(formData.question || "").trim(),
    description: String(formData.description || "").trim(),
    type: normalizedType,
    maxScore: Number(formData.maxScore),
    isRequired: Boolean(formData.isRequired),
    options: typeUsesOptions(normalizedType) ? options : [],
  };
};

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
    const options = parseOptions(formData.optionsText);

    if (String(formData.questionNo).trim() === "") {
      nextErrors.questionNo = "Question number is required.";
    } else if (!Number.isFinite(questionNo) || !Number.isInteger(questionNo) || questionNo < 0) {
      nextErrors.questionNo = "Question number must be a whole number greater than or equal to 0.";
    }

    if (!String(formData.question || "").trim()) {
      nextErrors.question = "Question is required.";
    }

    if (!String(formData.type || "").trim()) {
      nextErrors.type = "Type is required.";
    }

    if (String(formData.maxScore).trim() === "") {
      nextErrors.maxScore = "Max score is required.";
    } else if (!Number.isFinite(maxScore)) {
      nextErrors.maxScore = "Max score must be a valid number.";
    }

    if (typeUsesOptions(formData.type) && options.length === 0) {
      nextErrors.optionsText = "Add at least one option for the selected type.";
    }

    return nextErrors;
  }, [formData]);

  const handleInputChange = (event) => {
    const { name, value, checked, type } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
      optionsText: true,
    });

    if (Object.keys(errors).length > 0 || submitting) {
      return;
    }

    await onSubmit(buildPayload(formData));
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="lg">
      <ModalHeader toggle={toggle}>Add Caregiver Question</ModalHeader>
      <ModalBody>
        <Row>
          <Col md="6">
            <FormGroup>
              <Label>Question No.</Label>
              <Input
                name="questionNo"
                type="number"
                min="0"
                step="1"
                placeholder="Enter question number"
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
              <Label>Type</Label>
              <Input
                name="type"
                placeholder="voice, text, radio, select..."
                value={formData.type}
                onChange={handleInputChange}
                onBlur={handleBlur}
                invalid={Boolean(touched.type && errors.type)}
              />
              <FormFeedback>{errors.type}</FormFeedback>
            </FormGroup>
          </Col>
          <Col md="12">
            <FormGroup>
              <Label>Question</Label>
              <Input
                name="question"
                placeholder="Enter question"
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
              <Label>Description</Label>
              <Input
                name="description"
                type="textarea"
                rows="3"
                placeholder="Enter description"
                value={formData.description}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label>Max Score</Label>
              <Input
                name="maxScore"
                type="number"
                step="any"
                placeholder="Enter max score"
                value={formData.maxScore}
                onChange={handleInputChange}
                onBlur={handleBlur}
                invalid={Boolean(touched.maxScore && errors.maxScore)}
              />
              <FormFeedback>{errors.maxScore}</FormFeedback>
            </FormGroup>
          </Col>
          <Col md="6" className="d-flex align-items-center">
            <FormGroup check className="mt-4">
              <Input
                id="caregiver-question-required-create"
                name="isRequired"
                type="checkbox"
                checked={formData.isRequired}
                onChange={handleInputChange}
              />
              <Label check for="caregiver-question-required-create">
                Required question
              </Label>
            </FormGroup>
          </Col>
          <Col md="12">
            <FormGroup>
              <Label>Options</Label>
              <Input
                name="optionsText"
                type="textarea"
                rows="5"
                placeholder="Enter one option per line"
                value={formData.optionsText}
                onChange={handleInputChange}
                onBlur={handleBlur}
                invalid={Boolean(touched.optionsText && errors.optionsText)}
              />
              <FormFeedback>{errors.optionsText}</FormFeedback>
              <small className="text-muted">
                {typeUsesOptions(formData.type)
                  ? "Enter one option per line for option-based questions."
                  : "For types like voice or text, options will be submitted as an empty array."}
              </small>
            </FormGroup>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Btn attrBtn={{ color: "secondary", onClick: toggle, disabled: submitting }}>
          Cancel
        </Btn>
        <Btn attrBtn={{ color: "primary", onClick: handleSave, disabled: submitting }}>
          {submitting ? "Saving..." : "Save Question"}
        </Btn>
      </ModalFooter>
    </Modal>
  );
};

export default AddModal;
