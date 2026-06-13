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

const CreateActivity = ({ modal, setModal, refresh }) => {
  const [formData, setFormData] = useState({
    title: "",
    thumbnail: null,
    music: null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, files } = e.target;

    // Only one file: either thumbnail or music
    if (name === "thumbnail") {
      setFormData({ ...formData, thumbnail: files[0], music: null });
    } else if (name === "music") {
      setFormData({ ...formData, music: files[0], thumbnail: null });
    } else {
      setFormData({ ...formData, [name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      if (formData.thumbnail) payload.append("thumbnail", formData.thumbnail);
      if (formData.music) payload.append("music", formData.music);

      await alzheimerService.createActivity(payload);
      refresh();
      setModal(false);
      setFormData({ title: "", thumbnail: null, music: null });
    } catch (err) {
      console.error("Error creating activity:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={modal} toggle={() => setModal(false)} size="md" centered>
      <ModalHeader toggle={() => setModal(false)}>Create Activity</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <div className="row">
            <FormGroup className="col-md-12">
              <Label>Title</Label>
              <Input
                type="text"
                name="title"
                placeholder="Enter activity title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup className="col-md-6">
              <Label>Thumbnail</Label>
              <Input
                type="file"
                name="thumbnail"
                accept="image/*"
                onChange={handleChange}
                disabled={formData.music !== null}
              />
            </FormGroup>

            <FormGroup className="col-md-6">
              <Label>Music</Label>
              <Input
                type="file"
                name="music"
                accept="audio/*"
                onChange={handleChange}
                disabled={formData.thumbnail !== null}
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

export default CreateActivity;
