import React, { useMemo, useState } from "react";
import {
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Col,
} from "reactstrap";
import { Btn } from "../../AbstractElements";

const initialFormState = {
  title: "",
  description: "",
  startTime: "",
  endTime: "",
  duration: "",
  maxParticipants: "",
  coverImage: null,
};

const isValidImageFile = (file) => {
  if (!file) {
    return false;
  }

  return ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(file.type);
};

const AddModal = ({ isOpen, toggle, onSave, saving }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [touched, setTouched] = useState({});

  const errors = useMemo(() => {
    const nextErrors = {};

    if (!formData.title.trim()) nextErrors.title = "Title is required.";
    if (!formData.description.trim()) nextErrors.description = "Description is required.";
    if (!formData.startTime) nextErrors.startTime = "Start time is required.";
    if (!formData.endTime) nextErrors.endTime = "End time is required.";
    if (!formData.duration || Number(formData.duration) <= 0) nextErrors.duration = "Enter valid duration.";
    if (!formData.maxParticipants || Number(formData.maxParticipants) <= 0) nextErrors.maxParticipants = "Enter valid max participants.";
    if (!formData.coverImage) nextErrors.coverImage = "Cover image is required.";
    if (formData.startTime && formData.endTime && new Date(formData.endTime) <= new Date(formData.startTime)) {
      nextErrors.endTime = "End time must be after start time.";
    }
    if (formData.coverImage && !isValidImageFile(formData.coverImage)) {
      nextErrors.coverImage = "Upload JPG, PNG, or WEBP image only.";
    }

    return nextErrors;
  }, [formData]);

  const resetState = () => {
    setFormData(initialFormState);
    setTouched({});
  };

  const handleToggle = () => {
    resetState();
    toggle();
  };

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleBlur = (event) => {
    setTouched((prev) => ({
      ...prev,
      [event.target.name]: true,
    }));
  };

  const handleSave = async () => {
    const allTouched = {
      title: true,
      description: true,
      startTime: true,
      endTime: true,
      duration: true,
      maxParticipants: true,
      coverImage: true,
    };
    setTouched(allTouched);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const payload = new FormData();
    payload.append("title", formData.title.trim());
    payload.append("description", formData.description.trim());
    payload.append("coverImage", formData.coverImage);
    payload.append("duration", formData.duration);
    payload.append("startTime", new Date(formData.startTime).toISOString());
    payload.append("endTime", new Date(formData.endTime).toISOString());
    payload.append("maxParticipants", formData.maxParticipants);

    const isSuccess = await onSave(payload);
    if (isSuccess) {
      handleToggle();
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={handleToggle} size="lg" centered>
      <ModalHeader toggle={handleToggle}>Create Event</ModalHeader>
      <ModalBody>
        <Row>
          <Col md="6">
            <FormGroup>
              <Label>Title</Label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                onBlur={handleBlur}
                invalid={Boolean(touched.title && errors.title)}
              />
              <FormFeedback>{errors.title}</FormFeedback>
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label>Duration (Minutes)</Label>
              <Input
                name="duration"
                type="number"
                min="1"
                value={formData.duration}
                onChange={handleChange}
                onBlur={handleBlur}
                invalid={Boolean(touched.duration && errors.duration)}
              />
              <FormFeedback>{errors.duration}</FormFeedback>
            </FormGroup>
          </Col>
          <Col md="12">
            <FormGroup>
              <Label>Description</Label>
              <Input
                name="description"
                type="textarea"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                onBlur={handleBlur}
                invalid={Boolean(touched.description && errors.description)}
              />
              <FormFeedback>{errors.description}</FormFeedback>
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label>Start Time</Label>
              <Input
                name="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={handleChange}
                onBlur={handleBlur}
                invalid={Boolean(touched.startTime && errors.startTime)}
              />
              <FormFeedback>{errors.startTime}</FormFeedback>
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label>End Time</Label>
              <Input
                name="endTime"
                type="datetime-local"
                value={formData.endTime}
                onChange={handleChange}
                onBlur={handleBlur}
                invalid={Boolean(touched.endTime && errors.endTime)}
              />
              <FormFeedback>{errors.endTime}</FormFeedback>
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label>Max Participants</Label>
              <Input
                name="maxParticipants"
                type="number"
                min="1"
                value={formData.maxParticipants}
                onChange={handleChange}
                onBlur={handleBlur}
                invalid={Boolean(touched.maxParticipants && errors.maxParticipants)}
              />
              <FormFeedback>{errors.maxParticipants}</FormFeedback>
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label>Cover Image</Label>
              <Input
                name="coverImage"
                type="file"
                accept="image/*"
                onChange={handleChange}
                onBlur={handleBlur}
                invalid={Boolean(touched.coverImage && errors.coverImage)}
              />
              {formData.coverImage ? (
                <small className="text-muted d-block mt-2">{formData.coverImage.name}</small>
              ) : null}
              <FormFeedback>{errors.coverImage}</FormFeedback>
            </FormGroup>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Btn attrBtn={{ color: "secondary", onClick: handleToggle, disabled: saving }}>
          Cancel
        </Btn>
        <Btn attrBtn={{ color: "primary", onClick: handleSave, disabled: saving }}>
          {saving ? "Creating..." : "Create Event"}
        </Btn>
      </ModalFooter>
    </Modal>
  );
};

export default AddModal;
