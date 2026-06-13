import React, { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalHeader, ModalFooter, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { createDoctor, fetchDoctors } from '../../../Redux/stateSlice/doctor';
import { API_URL } from '../../../Config/AppConstant';


const AddDoctor = ({ addModal, setAddModal }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.doctor)
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


  const getDisease = async () => {
    const token = localStorage.getItem('token')
    await axios.get(`${API_URL}/disease`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      setDisease(res.data.data)
    }).catch((error) => {
      console.log("error::", error)
    })
  }


  useEffect(() => {
    getDisease()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    await dispatch(createDoctor(formData));
    dispatch(fetchDoctors());
    setAddModal(false);
  };

  return (
    <Modal isOpen={addModal} toggle={() => { setAddModal(false) }} size="md" centered>
      <ModalHeader toggle={() => { setAddModal(false) }}>Create Doctor</ModalHeader>
      <hr />
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="name">Doctor Name</Label>
            <Input
              type="text"
              name="doctorName"
              id="doctorName"
              value={formData.doctorName}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for="doctorNumber">Doctor mNumber</Label>
            <Input
              type="text"
              name="doctorNumber"
              id="doctorNumber"
              value={formData.doctorNumber}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for="hospitalName">Hospital Name</Label>
            <Input
              type="text"
              name="hospitalName"
              id="hospitalName"
              value={formData.hospitalName}
              onChange={handleChange}
              required
            />
          </FormGroup>


          <FormGroup>
            <Label for="hospitalNumber">Hospital Number</Label>
            <Input
              type="text"
              name="hospitalNumber"
              id="hospitalNumber"
              value={formData.hospitalNumber}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for="relativeName">Relative Name</Label>
            <Input
              type="text"
              name="relativeName"
              id="relativeName"
              value={formData.relativeName}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for="relativeNumber">Relative Number</Label>
            <Input
              type="text"
              name="relativeNumber"
              id="relativeNumber"
              value={formData.relativeNumber}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="disease">Disease</Label>
            <Input
              type="select"
              name="disease"
              id="disease"
              value={formData.disease}
              onChange={handleChange}
              required
            >
              <option value="">Select Disease</option>
              {disease && disease.length > 0 ? (
                disease.map((res) => (
                  <option key={res._id} value={res._id}>
                    {res.disease}
                  </option>
                ))
              ) : (
                <option>No disease available</option>
              )}
            </Input>
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

export default AddDoctor;
