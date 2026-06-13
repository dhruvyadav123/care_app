import React, { useState } from "react";
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
import alzheimerService from "../../../Services/alzheimer";

const CreateAssessmentCategory = ({ modal, setModal, refresh, onCreated }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrorMessage("");
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await alzheimerService.createQuestionCategory(formData);
      const createdCategory =
        response?.category ||
        response?.data?.category ||
        response?.data ||
        response;

      if (createdCategory && typeof onCreated === "function") {
        onCreated(createdCategory);
      }

      await refresh();
      setModal(false);
      setFormData({ name: "", description: "" });
    } catch (err) {
      const status = err?.response?.status;
      const message =
        status === 404
          ? "Create category API route is missing on backend."
          : err?.response?.data?.message ||
            err?.message ||
            "Create category API failed.";
      setErrorMessage(message);
      console.error("Error creating category:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={modal} toggle={() => setModal(false)} size="md" centered>
      <ModalHeader toggle={() => setModal(false)}>Create Category</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <div className="row">
            <FormGroup className="col-md-12">
              <Label>Name</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter category name"
              />
            </FormGroup>

            <FormGroup className="col-md-12">
              <Label>Description</Label>
              <Input
                type="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
              />
            </FormGroup>
          </div>
          {errorMessage ? <p className="text-danger mb-0 px-3">{errorMessage}</p> : null}

          <ModalFooter className="d-flex justify-content-center">
            <Button color="secondary" onClick={() => setModal(false)}>
              Cancel
            </Button>
            <Button type="submit" color="primary" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </ModalFooter>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default CreateAssessmentCategory;
