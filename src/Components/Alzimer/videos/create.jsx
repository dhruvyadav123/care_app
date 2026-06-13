// import React, { useState } from "react";
// import {
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Form,
//   FormGroup,
//   Label,
//   Input,
//   Button,
// } from "reactstrap";
// import alzheimerService from "../../../Services/alzheimer";

// const AddVideo = ({ modal, setModal, refresh }) => {
//   const [formData, setFormData] = useState({
//     title: "",
//     uploadedBy: "",
//     video: null,
//     thumbnail: null,
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, type, files } = e.target;

//     if (type === "file") {
//       setFormData((prev) => ({ ...prev, [name]: files[0] }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const payload = new FormData();
//       payload.append("title", formData.title);
//       payload.append("uploadedBy", formData.uploadedBy);
//       if (formData.video) payload.append("video", formData.video);
//       if (formData.thumbnail) payload.append("thumbnail", formData.thumbnail);

//       // await alzheimerService.createVideo(payload);
//       refresh();
//       setModal(false);
//       setFormData({ title: "", uploadedBy: "", video: null, thumbnail: null });
//     } catch (err) {
//       console.error("Error creating video:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal isOpen={modal} toggle={() => setModal(false)} size="md" centered>
//       <ModalHeader toggle={() => setModal(false)}>Add Video</ModalHeader>
//       <ModalBody>
//         <Form onSubmit={handleSubmit}>
//           <FormGroup>
//             <Label>Title</Label>
//             <Input
//               type="text"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               placeholder="Enter title"
//               required
//             />
//           </FormGroup>

//           <FormGroup>
//             <Label>Uploaded By</Label>
//             <Input
//               type="text"
//               name="uploadedBy"
//               value='admin'
//               onChange={handleChange}
//               placeholder="Enter uploader name"
//               required
//             />
//           </FormGroup>

//           <FormGroup>
//             <Label>Upload Video</Label>
//             <Input
//               type="file"
//               name="video"
//               accept="video/*"
//               onChange={handleChange}
//               required
//             />
//           </FormGroup>

//           <FormGroup>
//             <Label>Upload Thumbnail</Label>
//             <Input
//               type="file"
//               name="thumbnail"
//               accept="image/*"
//               onChange={handleChange}
//               required
//             />
//           </FormGroup>

//           <ModalFooter className="d-flex justify-content-center">
//             <Button color="secondary" onClick={() => setModal(false)}>
//               Cancel
//             </Button>
//             <Button type="submit" color="primary" disabled={loading}>
//               {loading ? "Creating..." : "Create"}
//             </Button>
//           </ModalFooter>
//         </Form>
//       </ModalBody>
//     </Modal>
//   );
// };

// export default AddVideo;


























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

const AddVideo = ({ modal, setModal, refresh }) => {
  const [formData, setFormData] = useState({
    title: "",
    uploadedBy: "admin",
    video: null,
    thumbnail: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
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
      payload.append("uploadedBy", formData.uploadedBy);
      if (formData.video) payload.append("video", formData.video);
      if (formData.thumbnail) payload.append("thumbnail", formData.thumbnail);

      // ✅ API call
      await alzheimerService.createVideo(payload);

      refresh();
      setModal(false);
      setFormData({
        title: "",
        uploadedBy: "admin",
        video: null,
        thumbnail: null,
      });
    } catch (err) {
      console.error("Error creating video:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={modal} toggle={() => setModal(false)} size="md" centered>
      <ModalHeader toggle={() => setModal(false)}>Add Video</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Title</Label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter video title"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Uploaded By</Label>
            <Input
              type="text"
              name="uploadedBy"
              value={formData.uploadedBy}
              onChange={handleChange}
              placeholder="Uploader name"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Upload Video</Label>
            <Input
              type="file"
              name="video"
              accept="video/*"
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Upload Thumbnail</Label>
            <Input
              type="file"
              name="thumbnail"
              accept="image/*"
              onChange={handleChange}
              required
            />
          </FormGroup>

          <ModalFooter className="d-flex justify-content-center">
            <Button color="secondary" onClick={() => setModal(false)}>
              Cancel
            </Button>
            <Button type="submit" color="primary" disabled={loading}>
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </ModalFooter>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default AddVideo;