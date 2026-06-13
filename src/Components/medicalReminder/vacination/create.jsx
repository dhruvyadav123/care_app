import React, { useState } from 'react';
import { Modal, ModalBody, ModalHeader, ModalFooter, Form, FormGroup, Label, Input, Button, FormFeedback } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createVacination, fetchVacinations } from '../../../Redux/stateSlice/vacination';
import { z } from 'zod';

const AddVacination = ({ addModal, setAddModal }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.vacination);

  const vacinationSchema = z.object({
    vaccinationType: z.string().min(1, { message: "Vaccination Type is required" }),
    description: z.string().min(1, { message: "Description is required" }),
  });

  const [formData, setFormData] = useState({
    vaccinationType: '',
    description: '',
  });

  const [errors, setErrors] = useState({
    vaccinationType: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationResult = vacinationSchema.safeParse(formData);
    if (!validationResult.success) {
      const newErrors = validationResult.error.errors.reduce((acc, error) => {
        acc[error.path[0]] = error.message;
        return acc;
      }, {});
      setErrors(newErrors);
      return;
    }
    await dispatch(createVacination(formData));
    dispatch(fetchVacinations());
    setAddModal(false);
  };

  return (
    <Modal isOpen={addModal} toggle={() => { setAddModal(false) }} size="md" centered>
      <ModalHeader toggle={() => { setAddModal(false) }}>Create Vaccination</ModalHeader>
      <hr />
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="vaccinationType">Vaccination Type</Label>
            <Input
              type="text"
              name="vaccinationType"
              id="vaccinationType"
              value={formData.vaccinationType}
              onChange={handleChange}
              invalid={!!errors.vaccinationType}
            />
            <FormFeedback>{errors.vaccinationType}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="description">Description</Label>
            <Input
              type="text"
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              invalid={!!errors.description}
            />
            <FormFeedback>{errors.description}</FormFeedback>
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

export default AddVacination;
