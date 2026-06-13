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

    if (!formData.password.trim()) {
      nextErrors.password = "Password is required.";
    } else if (formData.password.trim().length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    if (!formData.gender) {
      nextErrors.gender = "Gender is required.";
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
    const allTouched = {
      name: true,
      email: true,
      phoneNumber: true,
      password: true,
      gender: true,
    };

    setTouched(allTouched);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const normalizedPhoneNumber = normalizePhoneNumber(formData.phoneNumber);

    await onSubmit({
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phoneNumber: normalizedPhoneNumber,
      password: formData.password,
      gender: formData.gender,
    });
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="lg">
      <ModalHeader toggle={toggle}>Create Expert</ModalHeader>
      <ModalBody>
        {/* <Alert color="light" className="border">
          //Expert account create hote hi list me reflect ho jayega. Required fields ko validate karke hi submit kiya ja raha hai.
        </Alert> */}

        <Row>
          <Col md="6">
            <FormGroup>
              <Label>Name</Label>
              <Input
                name="name"
                placeholder="Enter full name"
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
                placeholder="Enter email address"
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
                placeholder="9999888802"
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
                placeholder="Minimum 8 characters"
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
        </Row>
      </ModalBody>
      <ModalFooter>
        <Btn attrBtn={{ color: "secondary", onClick: toggle, disabled: submitting }}>
          Cancel
        </Btn>
        <Btn attrBtn={{ color: "primary", onClick: handleSave, disabled: submitting }}>
          {submitting ? "Creating..." : "Create Expert"}
        </Btn>
      </ModalFooter>
    </Modal>
  );
};

export default AddModal;
