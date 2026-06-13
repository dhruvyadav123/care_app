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
import alzheimerService from "../../../Services/alzheimer";

const UpdateAssessmentCategory = ({ modal, setModal, data, refresh }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || "",
        description: data.description || "",
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data?._id) return;

    setLoading(true);
    try {
      await alzheimerService.updateQuestionCategory(data._id, formData);
      refresh();
      setModal(false);
    } catch (err) {
      console.error("Error updating category:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={modal} toggle={() => setModal(false)} size="md" centered>
      <ModalHeader toggle={() => setModal(false)}>Update Category</ModalHeader>
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
              />
            </FormGroup>

            <FormGroup className="col-md-12">
              <Label>Description</Label>
              <Input
                type="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
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

export default UpdateAssessmentCategory;