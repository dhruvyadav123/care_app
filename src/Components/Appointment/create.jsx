import React, { useEffect, useState } from "react";
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
} from "reactstrap";
import Select from "react-select";
import axios from "axios";
import alzheimerService from "../../Services/alzheimer";
import { API_URL } from "../../Config/AppConstant";

const DEV_API_URL = process.env.REACT_APP_DEV_API_URL || "http://172.104.206.4:5000/api";

const resolveAppointmentApiBase = () => {
  if (typeof window === "undefined") {
    return API_URL;
  }

  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") {
    return DEV_API_URL;
  }

  return API_URL;
};

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

const CreateAppointment = ({ modal, setModal, refresh }) => {
  const [formData, setFormData] = useState({
    patientId: "",
    doctorIds: [],
    appointmentDate: "",
    appointmentTime: "",
  });

  const [patients, setPatients] = useState([]);
  const [doctorOptions, setDoctorOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(false);

  const token = localStorage.getItem("token"); 
  const apiBase = resolveAppointmentApiBase();

  // Fetch patients & doctors
  useEffect(() => {
    if (modal) {
      setOptionsLoading(true);
      Promise.all([fetchPatients(), fetchDoctors()]).finally(() => {
        setOptionsLoading(false);
      });
    }
  }, [modal]);

  // ✅ Fetch patients with token
  const fetchPatients = async () => {
    try {
      const res = await axios.get(`${apiBase}/admin/getAllUsers?page=1&limit=500`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(res.data.users || res.data.data || []);
    } catch (err) {
      console.error("Error fetching patients:", err);
    }
  };

  // ✅ Fetch doctors with token
  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${apiBase}/doctor`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const doctorSource = res.data.data || res.data.doctors || [];
      const doctorList = doctorSource.map((doc) => ({
        value: doc._id,
        label: `${doc.doctorName || doc.name || doc.fullName || "Doctor"}${
          doc.hospitalName ? ` (${doc.hospitalName})` : ""
        }`,
      }));
      setDoctorOptions(doctorList);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle doctor multi-select
  const handleDoctorChange = (selectedOptions) => {
    const ids = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
    setFormData((prev) => ({ ...prev, doctorIds: ids }));
  };

  // ✅ Submit appointment with token
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        patientId: formData.patientId,
        doctorIds: formData.doctorIds,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
      };

      await alzheimerService.appointment(payload);

      refresh();
      setModal(false);

      // reset form
      setFormData({
        patientId: "",
        doctorIds: [],
        appointmentDate: "",
        appointmentTime: "",
      });
    } catch (error) {
      console.error("Error creating appointment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={modal} toggle={() => setModal(false)} size="lg" centered>
      <ModalHeader toggle={() => setModal(false)}>Add Appointment</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <div className="row">
            {/* Select Patient */}
            <FormGroup className="col-md-6">
              <Label>Select Patient</Label>
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
                    {getPatientDisplayLabel(p)}
                  </option>
                ))}
              </Input>
            </FormGroup>

            {/* Select Doctor(s) */}
            <FormGroup className="col-md-6">
              <Label>Select Doctor(s)</Label>
              <Select
                isMulti
                options={doctorOptions}
                onChange={handleDoctorChange}
                value={doctorOptions.filter((opt) =>
                  formData.doctorIds.includes(opt.value)
                )}
                placeholder="Select doctor"
                isLoading={optionsLoading}
                noOptionsMessage={() =>
                  optionsLoading ? "Loading doctors..." : "No doctors available"
                }
              />
            </FormGroup>

            {/* Appointment Date */}
            <FormGroup className="col-md-6">
              <Label>Appointment Date</Label>
              <Input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                required
              />
            </FormGroup>

            {/* Appointment Time */}
            <FormGroup className="col-md-6">
              <Label>Appointment Time</Label>
              <Input
                type="time"
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange}
                required
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

export default CreateAppointment;
