import React, { useState, useEffect } from "react";
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

const UpdateActivity = ({ modal, setModal, data, refresh }) => {
  const [formData, setFormData] = useState({
    title: "",
    thumbnail: null,
    music: null,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData({
        title: data.title || "",
        thumbnail: null,
        music: null,
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "thumbnail") {
      setFormData({ ...formData, thumbnail: files[0], music: null });
    } else if (name === "music") {
      setFormData({ ...formData, music: files[0], thumbnail: null });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data?._id) return;

    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      if (formData.thumbnail) payload.append("thumbnail", formData.thumbnail);
      if (formData.music) payload.append("music", formData.music);

      await alzheimerService.updateActivity(data._id, payload);
      refresh();
      setModal(false);
    } catch (err) {
      console.error("Error updating activity:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={modal} toggle={() => setModal(false)} size="md" centered>
      <ModalHeader toggle={() => setModal(false)}>Update Activity</ModalHeader>
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
              {data?.thumbnail && (
                <img
                  src={data.thumbnail}
                  alt="Current thumbnail"
                  style={{ width: "120px", marginTop: "10px", borderRadius: "8px" }}
                />
              )}
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
              {data?.music && !formData.thumbnail && (
                <audio
                  src={data.music}
                  controls
                  style={{ marginTop: "10px", width: "100%" }}
                />
              )}
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

export default UpdateActivity;