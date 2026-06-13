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

const UpdateDoctor = ({ modal, setModal, data, refresh }) => {
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    specialist: "",
    image: null,
    experience: "",
    rating: "",
    about: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || "",
        number: data.number || "",
        specialist: data.specialist || "",
        image: null,
        experience: data.experience || "",
        rating: data.rating || "",
        about: data.about || "",
      });
    }
  }, [data]);

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
    if (!data || !data._id) return;

    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("number", formData.number);
      payload.append("specialist", formData.specialist);
      payload.append("experience", formData.experience);
      payload.append("rating", formData.rating);
      payload.append("about", formData.about);
      if (formData.image) {
        payload.append("image", formData.image);
      }

      // await alzheimerService.updateDoctor(data._id, payload); // Uncomment for real request
      refresh();
      setModal(false);
    } catch (err) {
      console.error("Error updating doctor:", err);
    } finally {
      setLoading(false);
    }
  };
const doctorSpecialistOptions = [
  "General Physician (GP)",
  "Pediatrician",
  "Gynecologist",
  "Cardiologist",
  "Dermatologist",
  "Orthopedic Surgeon",
  "Neurologist",
  "Psychiatrist",
  "ENT Specialist (Otolaryngologist)",
  "Ophthalmologist",
  "Dentist",
  "Urologist",
  "Nephrologist",
  "Gastroenterologist",
  "Oncologist",
  "Endocrinologist",
  "Pulmonologist",
  "Rheumatologist",
  "Hematologist",
  "Allergist / Immunologist",
  "Radiologist",
  "Anesthesiologist",
  "Plastic Surgeon",
  "Infectious Disease Specialist",
  "Sexologist",
  "Diabetologist",
  "Geriatrician",
  "Neonatologist",
  "Pathologist",
  "Psychologist",
  "Other"
  ];
  return (
    <Modal isOpen={modal} toggle={() => setModal(false)} size="md" centered>
      <ModalHeader toggle={() => setModal(false)}>Update Doctor</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <div className="row">
            <FormGroup className="col-md-6">
              <Label>Name</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter doctor name"
              />
            </FormGroup>

            <FormGroup className="col-md-6">
              <Label>Phone Number</Label>
              <Input
                type="tel"
                name="number"
                value={formData.number}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </FormGroup>

       <FormGroup>
  <Label>Specialist</Label>
  <Input
    type="select"
    name="specialist"
    value={formData.specialist}
    onChange={handleChange}
    required
  >
    <option value="">Select specialization</option>
    {doctorSpecialistOptions.map((specialist, idx) => (
      <option key={idx} value={specialist}>
        {specialist}
      </option>
    ))}
  </Input>
</FormGroup>

            <FormGroup className="col-md-6">
              <Label>Experience</Label>
              <Input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g. 10 years"
              />
            </FormGroup>

            <FormGroup className="col-md-6">
              <Label>Image</Label>
              <Input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />
              {data?.image && (
                <img
                  src={data.image}
                  alt="Doctor"
                  style={{ width: 70, marginTop: 10, borderRadius: "50%" }}
                />
              )}
            </FormGroup>

            <FormGroup className="col-md-12">
              <Label>About</Label>
              <Input
                type="textarea"
                name="about"
                value={formData.about}
                onChange={handleChange}
                placeholder="Short bio or expertise"
              />
            </FormGroup>
          </div>

          <ModalFooter className="d-flex justify-content-center">
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

export default UpdateDoctor;