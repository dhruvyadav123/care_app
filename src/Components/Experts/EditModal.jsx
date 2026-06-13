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

const initialForm = {
  name: "",
  email: "",
  phoneNumber: "",
  password: "",
  gender: "",
  status: "active",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const indianPhoneRegex = /^\+91\d{10}$/;

const normalizePhoneNumber = (value) => {
  const cleanedValue = String(value || "").replace(/[^\d+]/g, "");

  if (!cleanedValue) {
    return "";
  }

  if (cleanedValue.startsWith("+91")) {
    return cleanedValue;
  }

  if (cleanedValue.startsWith("91") && cleanedValue.length === 12) {
    return `+${cleanedValue}`;
  }

  if (/^\d{10}$/.test(cleanedValue)) {
    return `+91${cleanedValue}`;
  }

  return cleanedValue;
};

const EditModal = ({ isOpen, toggle, expertData, onSubmit, submitting }) => {
  const [formData, setFormData] = useState(initialForm);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (isOpen && expertData) {
      setFormData({
        name: expertData?.name || "",
        email: expertData?.email || "",
        phoneNumber: expertData?.phoneNumber || "",
        password: "",
        gender: expertData?.gender || "",
        status: String(expertData?.status || "active").toLowerCase(),
      });
      setTouched({});
    }
  }, [isOpen, expertData]);

  const errors = useMemo(() => {
    const nextErrors = {};
    const normalizedPhoneNumber = normalizePhoneNumber(formData.phoneNumber);

    if (!formData.name.trim()) {
      nextErrors.name = "Name is required.";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!formData.phoneNumber.trim()) {
      nextErrors.phoneNumber = "Phone number is required.";
    } else if (!indianPhoneRegex.test(normalizedPhoneNumber)) {
      nextErrors.phoneNumber = "Enter a valid 10 digit Indian number. Country code +91 will be saved automatically.";
    }

    if (formData.password.trim() && formData.password.trim().length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    if (!formData.gender) {
      nextErrors.gender = "Gender is required.";
    }

    if (!formData.status) {
      nextErrors.status = "Status is required.";
    }

    return nextErrors;
  }, [formData]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;

    if (name === "phoneNumber") {
      setFormData((prev) => ({
        ...prev,
        phoneNumber: normalizePhoneNumber(value),
      }));
    }

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleSave = async () => {
    setTouched({
      name: true,
      email: true,
      phoneNumber: true,
      password: true,
      gender: true,
      status: true,
    });

    if (Object.keys(errors).length > 0 || !expertData?._id) {
      return;
    }

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phoneNumber: normalizePhoneNumber(formData.phoneNumber),
      gender: formData.gender,
      status: formData.status,
    };

    if (formData.password.trim()) {
      payload.password = formData.password.trim();
    }

    await onSubmit(expertData._id, payload);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="lg">
      <ModalHeader toggle={toggle}>Update Expert</ModalHeader>
      <ModalBody>
        <Row>
          <Col md="6">
            <FormGroup>
              <Label>Name</Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                invalid={Boolean(touched.name && errors.name)}
              />
              <FormFeedback>{errors.name}</FormFeedback>
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label>Email</Label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                invalid={Boolean(touched.email && errors.email)}
              />
              <FormFeedback>{errors.email}</FormFeedback>
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label>Phone Number</Label>
              <Input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                onBlur={handleBlur}
                invalid={Boolean(touched.phoneNumber && errors.phoneNumber)}
              />
              <FormFeedback>{errors.phoneNumber}</FormFeedback>
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label>Password</Label>
              <Input
                name="password"
                type="password"
                placeholder="Leave blank to keep unchanged"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                invalid={Boolean(touched.password && errors.password)}
              />
              <FormFeedback>{errors.password}</FormFeedback>
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label>Gender</Label>
              <Input
                name="gender"
                type="select"
                value={formData.gender}
                onChange={handleInputChange}
                onBlur={handleBlur}
                invalid={Boolean(touched.gender && errors.gender)}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Input>
              <FormFeedback>{errors.gender}</FormFeedback>
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label>Status</Label>
              <Input
                name="status"
                type="select"
                value={formData.status}
                onChange={handleInputChange}
                onBlur={handleBlur}
                invalid={Boolean(touched.status && errors.status)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Input>
              <FormFeedback>{errors.status}</FormFeedback>
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
