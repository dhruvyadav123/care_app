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

const UpdateTask = ({ modal, setModal, data, refresh }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    thumbnail: null,
    category: "",
    activityTask: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData({
        title: data.title || "",
        description: data.description || "",
        link: data.link || "",
        thumbnail: null,
        category: data.category || "",
        activityTask: data.activityTask || "",
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "thumbnail") {
      setFormData((prev) => ({ ...prev, thumbnail: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!data || !data._id) return;

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

      await alzheimerService.updateTask(data._id, payload);
      refresh();
      setModal(false);
    } catch (err) {
      console.error("Error updating task:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={modal} toggle={() => setModal(false)} size="md" centered>
      <ModalHeader toggle={() => setModal(false)}>Update Task</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleUpdate}>
          <div className="row">
            <FormGroup className="col-md-6">
              <Label>Title</Label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter task title"
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
                value={formData.link}
                onChange={handleChange}
                placeholder="Enter video or task link"
              />
            </FormGroup>

            <FormGroup className="col-md-6">
              <Label>Activity Task</Label>
              <Input
                type="text"
                name="activityTask"
                value={formData.activityTask}
                onChange={handleChange}
                placeholder="Enter activity task"
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
              {data?.thumbnail && (
                <img
                  src={data.thumbnail}
                  alt="Current thumbnail"
                  style={{ width: "100px", marginTop: "10px", borderRadius: "6px" }}
                />
              )}
            </FormGroup>

            <FormGroup className="col-md-6">
              <Label>Description</Label>
              <Input
                type="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter task description"
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

export default UpdateTask;