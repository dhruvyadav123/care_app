import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from 'reactstrap';
import alzheimerService from "../../Services/alzheimer";
import axios from "axios";

const CreateCaregiver = ({ modal, setModal, refresh }) => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    relation: "",
    address: "",
    patientId: "",
    fcmToken: "",
    image: null,
  });

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ Submit caregiver data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formPayload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formPayload.append(key, value);
      });

      // API call
      await alzheimerService.createCaregiver(formPayload);

      refresh(); // refresh caregiver list
      setModal(false); // close modal

      // reset form
      setFormData({
        name: "",
        phoneNumber: "",
        relation: "",
        address: "",
        patientId: "",
        fcmToken: "",
        image: null,
      });
    } catch (error) {
      console.error("Error creating caregiver:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={modal} toggle={() => setModal(false)} size="lg" centered>
      <ModalHeader toggle={() => setModal(false)}>Add Caregiver</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <div className="row">
            <FormGroup className="col-md-6">
              <Label>Full Name</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup className="col-md-6">
              <Label>Phone Number</Label>
              <Input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup className="col-md-6">
              <Label>Relation</Label>
              <Input
                type="text"
                name="relation"
                value={formData.relation}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup className="col-md-6">
              <Label>Address</Label>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup className="col-md-6">
              <Label>Linked Patient</Label>
              <Input
                type="select"
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                required
              >
                <option value="">Select Patient</option>
                {patients.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.fullName} ({p.age}y, {p.gender})
                  </option>
                ))}
              </Input>
            </FormGroup>

            <FormGroup className="col-md-6">
              <Label>FCM Token</Label>
              <Input
                type="text"
                name="fcmToken"
                value={formData.fcmToken}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup className="col-md-6">
              <Label>Upload Image</Label>
              <Input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />
            </FormGroup>
          </div>

          <ModalFooter className="d-flex justify-content-center gap-2">
            <Button color="secondary" onClick={() => setModal(false)}>
              Cancel
            </Button>
            <Button type="submit" color="primary" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </ModalFooter>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default CreateCaregiver;
