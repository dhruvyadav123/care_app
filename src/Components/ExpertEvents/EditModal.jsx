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
import { Btn, Image } from "../../AbstractElements";
import { BASE_URL } from "../../Config/AppConstant";

const resolveImageUrl = (imagePath) => {
  if (!imagePath) {
    return "";
  }

  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  const normalizedPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${BASE_URL}${normalizedPath}`;
};

const toDateTimeLocalValue = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (num) => String(num).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const isValidImageFile = (file) => {
  if (!file) {
    return true;
  }

  return ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(file.type);
};

const EditModal = ({ isOpen, toggle, eventData, onSave, saving }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    duration: "",
    maxParticipants: "",
    coverImage: null,
  });
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (eventData) {
      setFormData({
        title: eventData?.title || "",
        description: eventData?.description || "",
        startTime: toDateTimeLocalValue(eventData?.startTime),
        endTime: toDateTimeLocalValue(eventData?.endTime),
        duration: String(eventData?.duration ?? ""),
        maxParticipants: String(eventData?.maxParticipants ?? ""),
        coverImage: null,
      });
      setTouched({});
    }
  }, [eventData]);

  const errors = useMemo(() => {
    const nextErrors = {};

    if (!formData.title.trim()) nextErrors.title = "Title is required.";
    if (!formData.description.trim()) nextErrors.description = "Description is required.";
    if (!formData.startTime) nextErrors.startTime = "Start time is required.";
    if (!formData.endTime) nextErrors.endTime = "End time is required.";
    if (!formData.duration || Number(formData.duration) <= 0) nextErrors.duration = "Enter valid duration.";
    if (!formData.maxParticipants || Number(formData.maxParticipants) <= 0) nextErrors.maxParticipants = "Enter valid max participants.";
    if (formData.startTime && formData.endTime && new Date(formData.endTime) <= new Date(formData.startTime)) {
      nextErrors.endTime = "End time must be after start time.";
    }
    if (!isValidImageFile(formData.coverImage)) {
      nextErrors.coverImage = "Upload JPG, PNG, or WEBP image only.";
    }

    return nextErrors;
  }, [formData]);

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

    if (Object.keys(errors).length > 0 || !eventData?._id) {
      return;
    }

    const payload = new FormData();
    payload.append("title", formData.title.trim());
    payload.append("description", formData.description.trim());
    payload.append("startTime", new Date(formData.startTime).toISOString());
    payload.append("endTime", new Date(formData.endTime).toISOString());
    payload.append("duration", formData.duration);
    payload.append("maxParticipants", formData.maxParticipants);

    if (formData.coverImage) {
      payload.append("coverImage", formData.coverImage);
    }

    await onSave(eventData._id, payload);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle}>Edit Event</ModalHeader>
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
          {eventData?.coverImage ? (
            <Col md="12">
              <Label className="mb-2">Current Cover</Label>
              <div>
                <Image
                  attrImage={{
                    src: resolveImageUrl(eventData.coverImage),
                    alt: eventData?.title || "Event cover",
                    style: { width: "120px", height: "120px", objectFit: "cover", borderRadius: "14px" },
                  }}
                />
              </div>
            </Col>
          ) : null}
        </Row>
      </ModalBody>
      <ModalFooter>
        <Btn attrBtn={{ color: "secondary", onClick: toggle, disabled: saving }}>
          Cancel
        </Btn>
        <Btn attrBtn={{ color: "primary", onClick: handleSave, disabled: saving }}>
          {saving ? "Saving..." : "Update Event"}
        </Btn>
      </ModalFooter>
    </Modal>
  );
};

export default EditModal;
