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

const LOG_TYPES = ["alzheimer", "autism"];

const createEmptyOption = () => ({
  label: "",
  score: "",
});

const initialForm = {
  logType: "alzheimer",
  questionNo: "",
  question: "",
  type: "",
  options: [createEmptyOption()],
};

const normalizeType = (value) => String(value || "").trim().toLowerCase();

const typeUsesOptions = (type) => OPTION_BASED_TYPES.has(normalizeType(type));

const normalizeOption = (option) => ({
  label: String(option?.label || "").trim(),
  score:
    option?.score === 0 || option?.score === "0" || Number.isFinite(Number(option?.score))
      ? String(option?.score)
      : "",
});

const buildPayload = (formData) => ({
  logType: String(formData.logType || "").trim().toLowerCase(),
  questionNo: Number(formData.questionNo),
  question: String(formData.question || "").trim(),
  type: String(formData.type || "").trim(),
  options: typeUsesOptions(formData.type)
    ? formData.options
        .map((option) => ({
          label: String(option?.label || "").trim(),
          score: Number(option?.score),
        }))
        .filter((option) => option.label)
    : [],
});

const EditModal = ({ isOpen, toggle, questionData, onSubmit, submitting }) => {
  const [formData, setFormData] = useState(initialForm);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (isOpen && questionData) {
      const normalizedOptions = Array.isArray(questionData?.options)
        ? questionData.options.map(normalizeOption).filter((option) => option.label)
        : [];

      setFormData({
        logType: String(questionData?.logType || "alzheimer").trim().toLowerCase(),
        questionNo:
          questionData?.questionNo ??
          questionData?.question_number ??
          questionData?.questionNoValue ??
          "",
        question: questionData?.question || "",
        type: questionData?.type || "",
        options: normalizedOptions.length ? normalizedOptions : [createEmptyOption()],
      });
      setTouched({});
    }
  }, [isOpen, questionData]);

  const errors = useMemo(() => {
    const nextErrors = {};
    const questionNo = Number(formData.questionNo);

    if (!LOG_TYPES.includes(String(formData.logType || "").trim().toLowerCase())) {
      nextErrors.logType = "Log type is required.";
    }

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

    if (typeUsesOptions(formData.type)) {
      const normalizedOptions = formData.options.filter(
        (option) => String(option?.label || "").trim() || String(option?.score || "").trim()
      );

      if (!normalizedOptions.length) {
        nextErrors.options = "Add at least one option for the selected type.";
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
      [name]: value,
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
      logType: true,
      questionNo: true,
      question: true,
      type: true,
      options: true,
    });

    if (Object.keys(errors).length > 0 || submitting || !questionData) {
      return;
    }

    await onSubmit(buildPayload(formData));
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="lg">
      <ModalHeader toggle={toggle}>Edit Daily Log Question</ModalHeader>
      <ModalBody>
        <Row>
          <Col md="6">
            <FormGroup>
              <Label>Log Type</Label>
              <Input
                name="logType"
                type="select"
                value={formData.logType}
                onChange={handleInputChange}
                onBlur={handleBlur}
                invalid={Boolean(touched.logType && errors.logType)}
              >
                <option value="alzheimer">Alzheimer</option>
                <option value="autism">Autism</option>
              </Input>
              <FormFeedback>{errors.logType}</FormFeedback>
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label>Question No.</Label>
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
          <Col md="12">
            <FormGroup>
              <Label>Question</Label>
              <Input
                name="question"
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
              <Label>Type</Label>
              <Input
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                onBlur={handleBlur}
                invalid={Boolean(touched.type && errors.type)}
              />
              <FormFeedback>{errors.type}</FormFeedback>
            </FormGroup>
          </Col>
          <Col md="12">
            <FormGroup className="mb-0">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <Label className="mb-0">Options</Label>
                {typeUsesOptions(formData.type) ? (
                  <Button color="light" type="button" onClick={handleAddOption} disabled={submitting}>
                    Add Option
                  </Button>
                ) : null}
              </div>
              {typeUsesOptions(formData.type) ? (
                <div className="d-flex flex-column gap-2">
                  {formData.options.map((option, index) => (
                    <Row key={`daily-log-edit-option-${index}`} className="g-2 align-items-center">
                      <Col md="7">
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
                      <Col md="2">
                        <Button
                          color="danger"
                          type="button"
                          className="w-100"
                          onClick={() => handleRemoveOption(index)}
                          disabled={submitting}
                        >
                          Remove
                        </Button>
                      </Col>
                    </Row>
                  ))}
                </div>
              ) : (
                <small className="text-muted">
                  For types like voice or text, options will be submitted as an empty array.
                </small>
              )}
              {touched.options && errors.options ? (
                <div className="text-danger mt-2" style={{ fontSize: "0.875rem" }}>
                  {errors.options}
                </div>
              ) : null}
            </FormGroup>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Btn attrBtn={{ color: "secondary", onClick: toggle, disabled: submitting }}>
          Cancel
        </Btn>
        <Btn attrBtn={{ color: "primary", onClick: handleSave, disabled: submitting }}>
          {submitting ? "Saving..." : "Save Changes"}
        </Btn>
      </ModalFooter>
    </Modal>
  );
};

export default EditModal;
