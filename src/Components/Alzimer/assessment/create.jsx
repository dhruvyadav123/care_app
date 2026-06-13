import React, { useEffect, useState } from 'react';
import {
  Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input, Button
} from 'reactstrap';
import alzheimerService from "../../../Services/alzheimer";
import axios from "axios";
import { API_URL } from "../../../Config/AppConstant";

const CreateAssessment = ({ modal, setModal, refresh }) => {
  const [formData, setFormData] = useState({
    questionCategory: '',
    question: '',
    images: [],
    shapes: [],
    connectshape: '',
    options: [],
    index: '',
    points: ''
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  const fetchCategories = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. Please log in again.");
      return;
    }
    try {
      const res = await axios.get(`${API_URL}/question-categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Handle different possible API structures
      const data =
        res?.data?.categories ||
        res?.data?.questionCategories ||
        res?.data?.data ||
        res?.data?.results ||
        res?.data?.items ||
        res?.data ||
        [];

      // Only set if it's actually an array
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        setCategories([]); // fallback if API returns invalid format
      }
    } catch (error) {
      console.error("Error fetching categories", error);
      setCategories([]); // prevent undefined if request fails
    }
  };

  fetchCategories();
}, []);

  // ✅ Handle input changes
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

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formPayload = new FormData();
      formPayload.append('questionCategory', formData.questionCategory);
      formPayload.append('question', formData.question);
      formPayload.append('connectshape', formData.connectshape);
      formPayload.append('index', formData.index);
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

      await alzheimerService.createQuestion(formPayload);

      refresh(); // refresh table
      setModal(false); // close modal
      setFormData({
        questionCategory: '',
        question: '',
        images: [],
        shapes: [],
        connectshape: '',
        options: [],
        index: '',
        points: ''
      });
    } catch (err) {
      console.error("Error submitting assessment:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={modal} toggle={() => setModal(false)} size="lg" centered>
      <ModalHeader toggle={() => setModal(false)}>Create Question</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <div className="row">
            <FormGroup className="col-md-6">
              <Label>Question Category</Label>
              <Input
                type="select"
                name="questionCategory"
                value={formData.questionCategory}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </Input>
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
              <Label>Upload Images</Label>
              <Input
                type="file"
                name="images"
                onChange={handleChange}
                multiple
                accept="image/*"
              />
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

          <ModalFooter className="d-flex justify-content-center gap-2">
  <Button color="secondary" onClick={() => setModal(false)}>
    Cancel
  </Button>
  <Button type="submit" color="primary" disabled={loading}>
    {loading ? 'Creating...' : 'Create'}
  </Button>
</ModalFooter>

        </Form>
      </ModalBody>
    </Modal>
  );
};

export default CreateAssessment;
