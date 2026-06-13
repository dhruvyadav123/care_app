import React, { useState } from 'react';
import { Modal, ModalBody, ModalHeader, ModalFooter, Form, FormGroup, Label, Input, Button, FormFeedback } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';
import { createFitnessCategory, fetchFitnessCategory } from '../../../Redux/stateSlice/fitnessCategory';

const CreateFitnessCategory = ({ addModal, setAddModal }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.category);

  const medicineSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
  });

  const [formData, setFormData] = useState({
    name: '',
    image: null,
  });

  const [errors, setErrors] = useState({
    name: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationResult = medicineSchema.safeParse(formData);
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
    formDataToSubmit.append('image', formData.image);

    await dispatch(createFitnessCategory(formDataToSubmit));
    dispatch(fetchFitnessCategory());
    setAddModal(false);
  };

  return (
    <Modal isOpen={addModal} toggle={() => { setAddModal(false) }} size="md" centered>
      <ModalHeader toggle={() => { setAddModal(false) }}>Create Vender Category</ModalHeader>
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
          </FormGroup>

          <ModalFooter>
            <Button color="secondary" onClick={() => { setAddModal(false) }}>Cancel</Button>
            <Button color="primary" type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </ModalFooter>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default CreateFitnessCategory;
