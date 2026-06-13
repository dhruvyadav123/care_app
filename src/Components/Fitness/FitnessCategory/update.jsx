import React, { useState, useEffect } from 'react';
import { Modal, ModalBody, ModalHeader, ModalFooter, Form, FormGroup, Label, Input, Button, FormFeedback } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';
import { updateFitnessCategory, fetchFitnessCategory } from '../../../Redux/stateSlice/fitnessCategory';

const UpdateFitnessCategory = ({ data, editModal, setEditModal }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.category);

  const fitnessCategorySchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
  });

  const [formData, setFormData] = useState({
    name: '',
    image: null,
  });

  const [errors, setErrors] = useState({
    name: '',
  });

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || '',
        image: null,
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationResult = fitnessCategorySchema.safeParse(formData);
    if (!validationResult.success) {
      const newErrors = validationResult.error.errors.reduce((acc, error) => {
        acc[error.path[0]] = error.message;
        return acc;
      }, {});
      setErrors(newErrors);
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('name', formData.name);
    if (formData.image) {
      formDataToSubmit.append('image', formData.image);
    }

    dispatch(updateFitnessCategory(data._id, formDataToSubmit));
    dispatch(fetchFitnessCategory());
    setEditModal(false);
  };

  return (
    <Modal isOpen={editModal} toggle={() => { setEditModal(false) }} size="md" centered>
      <ModalHeader toggle={() => { setEditModal(false) }}>Update Vender Category</ModalHeader>
      <hr />
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              invalid={!!errors.name}
            />
            <FormFeedback>{errors.name}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="image">Category Icon</Label>
            <Input
              type="file"
              name="image"
              id="image"
              onChange={handleChange}
            />
            {formData.image && (
              <div>
                <strong>Selected Image:</strong> {formData.image.name}
              </div>
            )}
          </FormGroup>

          <ModalFooter>
            <Button color="secondary" onClick={() => { setEditModal(false) }}>Cancel</Button>
            <Button color="primary" type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </ModalFooter>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default UpdateFitnessCategory;
