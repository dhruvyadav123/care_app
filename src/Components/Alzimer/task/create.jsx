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

const AddTask = ({ modal, setModal, refresh }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    thumbnail: null,
    category: "",
    activityTask: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "thumbnail") {
      setFormData((prev) => ({ ...prev, thumbnail: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("link", formData.link);
      payload.append("category", formData.category);
      payload.append("activityTask", formData.activityTask);
      if (formData.thumbnail) {
        payload.append("thumbnail", formData.thumbnail);
      }

      await alzheimerService.createTask(payload);
      refresh();
      setModal(false);
      setFormData({
        title: "",
        description: "",
        link: "",
        thumbnail: null,
        category: "",
        activityTask: "",
      });
    } catch (err) {
      console.error("Error creating task:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={modal} toggle={() => setModal(false)} size="md" centered>
      <ModalHeader toggle={() => setModal(false)}>Create Task</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <div className="row">
            <FormGroup className="col-md-6">
              <Label>Title</Label>
              <Input
                type="text"
                name="title"
                placeholder="Enter task title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup className="col-md-6">
              <Label>Category</Label>
              <Input
                type="select"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>
                <option value="memory">Memory</option>
                <option value="cognitive">Cognitive</option>
                <option value="physical">Physical</option>
              </Input>
            </FormGroup>

            <FormGroup className="col-md-6">
              <Label>Link</Label>
              <Input
                type="url"
                name="link"
                placeholder="Enter video or task link"
                value={formData.link}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup className="col-md-6">
              <Label>Activity Task</Label>
              <Input
                type="text"
                name="activityTask"
                placeholder="Enter activity task"
                value={formData.activityTask}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup className="col-md-6">
              <Label>Thumbnail</Label>
              <Input
                type="file"
                name="thumbnail"
                accept="image/*"
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup className="col-md-6">
              <Label>Description</Label>
              <Input
                type="textarea"
                name="description"
                placeholder="Enter task description"
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
              {loading ? "Creating..." : "Create"}
            </Button>
          </ModalFooter>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default AddTask;