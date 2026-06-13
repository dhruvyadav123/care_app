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
// import alzheimerService from "../../../Services/alzheimer";

const UpdateVideo = ({ modal, setModal, data, refresh }) => {
  const [formData, setFormData] = useState({
    title: "",
    uploadedBy: "",
    video: null,
    thumbnail: null,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData({
        title: data.title || "",
        uploadedBy: data.uploadedBy || "",
        video: null,
        thumbnail: null,
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
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
      payload.append("uploadedBy", formData.uploadedBy);
      if (formData.video) payload.append("video", formData.video);
      if (formData.thumbnail) payload.append("thumbnail", formData.thumbnail);

      // await alzheimerService.updateVideo(data._id, payload);
      refresh();
      setModal(false);
    } catch (err) {
      console.error("Error updating video:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={modal} toggle={() => setModal(false)} size="md" centered>
      <ModalHeader toggle={() => setModal(false)}>Update Video</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleUpdate}>
          <FormGroup>
            <Label>Title</Label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Uploaded By</Label>
            <Input
              type="text"
              name="uploadedBy"
              value="admin"
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Change Video (Optional)</Label>
            <Input type="file" name="video" accept="video/*" onChange={handleChange} />
          </FormGroup>

          <FormGroup>
            <Label>Change Thumbnail (Optional)</Label>
            <Input type="file" name="thumbnail" accept="image/*" onChange={handleChange} />
          </FormGroup>

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

export default UpdateVideo;