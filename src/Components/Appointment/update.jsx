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
  Button
} from 'reactstrap';
import alzheimerService from "../../Services/alzheimer";

const UpdateCaregiver = ({ modal, setModal, data, refresh }) => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    relation: "",
    address: "",
    patientId: "",
    fcmToken: "",
    image: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Populate form when data changes
  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || "",
        phoneNumber: data.phoneNumber || "",
        relation: data.relation || "",
        address: data.address || "",
        patientId: data.patientId?._id || "",
        fcmToken: data.fcmToken || "",
        image: null, // new file only
      });

      setPreviewImage(data.image || null); // previously uploaded image
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData(prev => ({ ...prev, image: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!data || !data._id) return;

    setLoading(true);
    try {
      const formPayload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) formPayload.append(key, value);
      });

      await alzheimerService.updateCaregiver(data._id, formPayload);
      refresh();
      setModal(false);
    } catch (err) {
      console.error("Error updating caregiver:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={modal} toggle={() => setModal(false)} size="lg" centered>
      <ModalHeader toggle={() => setModal(false)}>Update Caregiver</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleUpdate}>
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
              />
            </FormGroup>

            <FormGroup className="col-md-6">
              <Label>Address</Label>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
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
              <Label>Upload New Image</Label>
              <Input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup className="col-md-6">
              <Label>Current Image</Label><br />
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="caregiver"
                  height="50"
                  className="me-2 mb-1"
                />
              ) : (
                <p className="text-muted">No image uploaded</p>
              )}
            </FormGroup>
          </div>

          <ModalFooter className="d-flex justify-content-center gap-2">
            <Button color="secondary" onClick={() => setModal(false)}>
              Cancel
            </Button>
            <Button type="submit" color="primary" disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </Button>
          </ModalFooter>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default UpdateCaregiver;
