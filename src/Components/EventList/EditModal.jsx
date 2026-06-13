import React, { useEffect, useMemo, useState } from "react";
import {
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { Btn } from "../../AbstractElements";

const statusOptions = [
  { label: "Scheduled", value: "scheduled" },
  { label: "Live", value: "live" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

const normalizeStatusValue = (value) => {
  const normalized = String(value || "scheduled").trim().toLowerCase();
  return normalized === "active" ? "scheduled" : normalized;
};

const EditModal = ({ eventData, isOpen, toggle, onSave, saving }) => {
  const [formData, setFormData] = useState({
    title: "",
    status: "scheduled",
  });
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (eventData) {
      setFormData({
        title: eventData?.title || "",
        status: normalizeStatusValue(eventData?.status),
      });
      setTouched({});
    }
  }, [eventData]);

  const errors = useMemo(() => {
    const nextErrors = {};

    if (!formData.title.trim()) {
      nextErrors.title = "Title is required.";
    }

    if (!formData.status) {
      nextErrors.status = "Status is required.";
    }

    return nextErrors;
  }, [formData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlur = (event) => {
    setTouched((prev) => ({
      ...prev,
      [event.target.name]: true,
    }));
  };

  const handleSubmit = async () => {
    setTouched({
      title: true,
      status: true,
    });

    if (Object.keys(errors).length > 0 || !eventData?._id) {
      return;
    }

    await onSave(eventData._id, {
      title: formData.title.trim(),
      status: normalizeStatusValue(formData.status),
    });
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>Update Event</ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label>Title</Label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            onBlur={handleBlur}
            invalid={Boolean(touched.title && errors.title)}
            placeholder="Enter event title"
          />
          <FormFeedback>{errors.title}</FormFeedback>
        </FormGroup>

        <FormGroup className="mb-0">
          <Label>Status</Label>
          <Input
            type="select"
            name="status"
            value={formData.status}
            onChange={handleChange}
            onBlur={handleBlur}
            invalid={Boolean(touched.status && errors.status)}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Input>
          <FormFeedback>{errors.status}</FormFeedback>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Btn attrBtn={{ color: "secondary", onClick: toggle, disabled: saving }}>
          Cancel
        </Btn>
        <Btn attrBtn={{ color: "primary", onClick: handleSubmit, disabled: saving }}>
          {saving ? "Saving..." : "Save Changes"}
        </Btn>
      </ModalFooter>
    </Modal>
  );
};

export default EditModal;
