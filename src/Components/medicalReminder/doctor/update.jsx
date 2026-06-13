import React, { useState, useEffect } from 'react';
import { Modal, ModalBody, ModalHeader, ModalFooter, Form, FormGroup, Label, Input, Button, FormFeedback } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { updateDoctor, fetchDoctors } from '../../../Redux/stateSlice/doctor';
import { z } from 'zod';
import { API_URL } from '../../../Config/AppConstant';

const UpdateDoctor = ({ data, editModal, setEditModal }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.doctor);
  const [disease, setDisease] = useState([]);
  const [formData, setFormData] = useState({
    doctorName: '',
    doctorNumber: '',
    hospitalName: '',
    hospitalNumber: '',
    disease: '',
    relativeNumber: '',
    relativeName: ''
  });
  const [errors, setErrors] = useState({
    doctorName: '',
    doctorNumber: '',
    hospitalName: '',
    hospitalNumber: '',
    relativeName: '',
    relativeNumber: ''
  });

  const doctorSchema = z.object({
    doctorName: z.string().min(1, { message: 'Doctor Name is required' }),
    doctorNumber: z.string().min(1, { message: 'Doctor Number is required' }),
    hospitalName: z.string().min(1, { message: 'Hospital Name is required' }),
    hospitalNumber: z.string().min(1, { message: 'Hospital Number is required' }),
    relativeName: z.string().min(1, { message: 'Relative Name is required' }),
    relativeNumber: z.string().min(1, { message: 'Relative Number is required' })
  });

  const getDisease = async () => {
    const token = localStorage.getItem('token');
    await axios.get(`${API_URL}/disease`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      setDisease(res.data.data);
    }).catch((error) => {
      console.log("error::", error);
    });
  };

  useEffect(() => {
    getDisease();
    if (data) {
      setFormData({
        doctorName: data.doctorName || '',
        doctorNumber: data.doctorNumber || '',
        hospitalName: data.hospitalName || '',
        hospitalNumber: data.hospitalNumber || '',
        disease: data.disease || '',
        relativeName: data.relativeName || '',
        relativeNumber: data.relativeNumber || ''
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationResult = doctorSchema.safeParse(formData);
    if (!validationResult.success) {
      const newErrors = validationResult.error.errors.reduce((acc, error) => {
        acc[error.path[0]] = error.message;
        return acc;
      }, {});
      setErrors(newErrors);
      return;
    }
    dispatch(updateDoctor(data._id, formData));
    dispatch(fetchDoctors());
    setEditModal(false);
  };

  return (
    <Modal isOpen={editModal} toggle={() => setEditModal(false)} size="md" centered>
      <ModalHeader toggle={() => setEditModal(false)}>Update Doctor</ModalHeader>
      <hr />
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="doctorName">Doctor Name</Label>
            <Input
              type="text"
              name="doctorName"
              id="doctorName"
              value={formData.doctorName}
              onChange={handleChange}
              invalid={!!errors.doctorName}
            />
            <FormFeedback>{errors.doctorName}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="doctorNumber">Doctor Number</Label>
            <Input
              type="text"
              name="doctorNumber"
              id="doctorNumber"
              value={formData.doctorNumber}
              onChange={handleChange}
              invalid={!!errors.doctorNumber}
            />
            <FormFeedback>{errors.doctorNumber}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="hospitalName">Hospital Name</Label>
            <Input
              type="text"
              name="hospitalName"
              id="hospitalName"
              value={formData.hospitalName}
              onChange={handleChange}
              invalid={!!errors.hospitalName}
            />
            <FormFeedback>{errors.hospitalName}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="hospitalNumber">Hospital Number</Label>
            <Input
              type="text"
              name="hospitalNumber"
              id="hospitalNumber"
              value={formData.hospitalNumber}
              onChange={handleChange}
              invalid={!!errors.hospitalNumber}
            />
            <FormFeedback>{errors.hospitalNumber}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="relativeName">Relative Name</Label>
            <Input
              type="text"
              name="relativeName"
              id="relativeName"
              value={formData.relativeName}
              onChange={handleChange}
              invalid={!!errors.relativeName}
            />
            <FormFeedback>{errors.relativeName}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="relativeNumber">Relative Number</Label>
            <Input
              type="text"
              name="relativeNumber"
              id="relativeNumber"
              value={formData.relativeNumber}
              onChange={handleChange}
              invalid={!!errors.relativeNumber}
            />
            <FormFeedback>{errors.relativeNumber}</FormFeedback>
          </FormGroup>

          <ModalFooter>
            <Button color="secondary" onClick={() => setEditModal(false)}>Cancel</Button>
            <Button color="primary" type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update'}
            </Button>
          </ModalFooter>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default UpdateDoctor;
