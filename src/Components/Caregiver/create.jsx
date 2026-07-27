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
import { toast } from "react-toastify";
import { resolveApiUrl } from "../../Config/AppConstant";

const getPatientDisplayLabel = (patient) => {
  const name = patient?.fullName || patient?.name || "";
  const email = patient?.email || "";
  const phone = patient?.phoneNumber || "";
  const idSuffix = patient?._id ? String(patient._id).slice(-4) : "";

  if (name) {
    return `${name}${phone ? ` - ${phone}` : ""}`;
  }

  if (email) {
    return `${email}${phone ? ` - ${phone}` : ""}`;
  }

  if (phone) {
    return `Patient ${idSuffix || ""} - ${phone}`.trim();
  }

  return `Patient ${idSuffix || "Unknown"}`;
};

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
  const [patientsLoading, setPatientsLoading] = useState(false);

  useEffect(() => {
    if (!modal) {
      return;
    }

    const fetchPatients = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setPatients([]);
        return;
      }

      setPatientsLoading(true);

      try {
        const apiUrl = resolveApiUrl();
        const response = await axios.get(`${apiUrl}/admin/getAllUsers?page=1&limit=500`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPatients(response.data?.users || response.data?.data || []);
      } catch (error) {
        console.error("Error fetching patients:", error);
        toast.error(error?.response?.data?.message || "Unable to load patients.");
        setPatients([]);
      } finally {
        setPatientsLoading(false);
      }
    };

    fetchPatients();
  }, [modal]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formPayload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formPayload.append(key, value);
      });

      await alzheimerService.createCaregiver(formPayload);

      refresh();
      setModal(false);
      toast.success("Caregiver created successfully.");

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
      toast.error(error?.response?.data?.message || "Failed to create caregiver.");
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
                <option value="">{patientsLoading ? "Loading patients..." : "Select Patient"}</option>
                {patients.map((p) => (
                  <option key={p._id} value={p._id}>
                    {getPatientDisplayLabel(p)}
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