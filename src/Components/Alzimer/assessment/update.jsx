import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button
} from 'reactstrap';
import alzheimerService from "../../../Services/alzheimer";

const UpdateAssessment = ({ modal, setModal, data, refresh }) => {
  const [formData, setFormData] = useState({
    questionCategory: '',
    question: '',
    images: [],
    shapes: [],
    connectshape: '',
    options: [],
    points: '',
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData({
        questionCategory: data.questionCategory || '',
        question: data.question || '',
        images: [], // new uploads only
        shapes: data.shapes || [],
        connectshape: data.connectshape || '',
        options: data.options || [],
        points: data.points || '',
      });
      setPreviewImages(data.images || []); // previously uploaded images
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      setFormData(prev => ({ ...prev, images: files }));
    } else if (name === 'shapes') {
      setFormData(prev => ({ ...prev, shapes: value.split(',').map(s => s.trim()) }));
    } else if (name === 'options') {
      setFormData(prev => ({ ...prev, options: value.split(',').map(o => o.trim()) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!data || !data._id) return;
    setLoading(true);

    try {
      const formPayload = new FormData();
      formPayload.append('questionCategory', formData.questionCategory);
      formPayload.append('question', formData.question);
      formPayload.append('connectshape', formData.connectshape);
      formPayload.append('points', formData.points);

      formData.shapes.forEach((shape, idx) => {
        formPayload.append(`shapes[${idx}]`, shape);
      });

      formData.options.forEach((opt, idx) => {
        formPayload.append(`options[${idx}]`, opt);
      });

      Array.from(formData.images).forEach((file) => {
        formPayload.append('images', file);
      });

      await alzheimerService.updateQuestion(data._id, formPayload);
      refresh();
      setModal(false);
    } catch (err) {
      console.error('Error updating assessment:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={modal} toggle={() => setModal(false)} size="lg" centered>
      <ModalHeader toggle={() => setModal(false)}>Update Question</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleUpdate}>
          <div className="row">
            <FormGroup className="col-md-6">
              <Label>Question Category</Label>
              <Input
                type="text"
                name="questionCategory"
                value={formData.questionCategory}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup className="col-md-6">
              <Label>Question</Label>
              <Input
                type="text"
                name="question"
                value={formData.question}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup className="col-md-6">
              <Label>Upload New Images</Label>
              <Input
                type="file"
                name="images"
                onChange={handleChange}
                multiple
                accept="image/*"
              />
            </FormGroup>

            <FormGroup className="col-md-6">
              <Label>Previously Uploaded Images</Label><br />
              {previewImages.length ? (
                previewImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`uploaded-${idx}`}
                    height="50"
                    className="me-2 mb-1"
                  />
                ))
              ) : (
                <p className="text-muted">No images uploaded</p>
              )}
            </FormGroup>

            <FormGroup className="col-md-6">
              <Label>Shapes</Label>
              <Input
                type="text"
                name="shapes"
                value={formData.shapes.join(', ')}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup className="col-md-6">
              <Label>Connect Shape</Label>
              <Input
                type="text"
                name="connectshape"
                value={formData.connectshape}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup className="col-md-6">
              <Label>Options</Label>
              <Input
                type="text"
                name="options"
                value={formData.options.join(', ')}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup className="col-md-6">
              <Label>Points</Label>
              <Input
                type="number"
                name="points"
                value={formData.points}
                onChange={handleChange}
              />
            </FormGroup>
          </div>

         <ModalFooter className="d-flex justify-content-center">
  <Button color="secondary" onClick={() => setModal(false)} className="me-2">
    Cancel
  </Button>
  <Button type="submit" color="primary" disabled={loading}>
    {loading ? 'Updating...' : 'Update'}
  </Button>
</ModalFooter>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default UpdateAssessment;