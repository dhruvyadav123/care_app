import React, { useState, useEffect } from 'react';
import { Modal, ModalBody, ModalHeader, ModalFooter, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { updateSubAdmin } from '../../Redux/stateSlice/subAdmin';
import fetchRoles from '../../Redux/stateSlice/roleReducer';

const EditModal = ({ data, editModal, setEditModal }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    avatar: null,
    roles: ''
  });

  const { roles } = useSelector((state) => state.roles);

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phoneNumber: data.phoneNumber || '',
        avatar: null,
        roles: data?.roles?.role || ''
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, avatar: file });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('name', formData.name);
    formDataToSubmit.append('email', formData.email);
    formDataToSubmit.append('phoneNumber', formData.phoneNumber);
    if (formData.avatar) formDataToSubmit.append('avatar', formData.avatar);
    if (formData.roles) formDataToSubmit.append('roles', formData.roles);

    dispatch(updateSubAdmin(data._id, formDataToSubmit,setEditModal));
  };

  return (
    <Modal isOpen={editModal} toggle={() => setEditModal(false)} size="md" centered>
      <ModalHeader toggle={() => { setEditModal(false) }}>Update SubAdmin</ModalHeader>
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
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for="email">Email</Label>
            <Input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for="phoneNumber">Phone Number</Label>
            <Input
              type="text"
              name="phoneNumber"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for="avatar">Avatar</Label>
            <Input
              type="file"
              name="avatar"
              id="avatar"
              onChange={handleFileChange}
            />
          </FormGroup>

          <FormGroup>
            <Label for="roles">Role</Label>
            <Input
              type="select"
              name="roles"
              id="roles"
              value={formData?.roles || ''}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              {roles && roles.length > 0 ? (
                roles.map((res) => (
                  <option selected key={res._id} value={res._id}>
                    {res.role}
                  </option>
                ))
              ) : (
                <option>No roles available</option>
              )}
            </Input>
          </FormGroup>

          <ModalFooter>
            <Button color="secondary" onClick={() => { setEditModal(false) }}>Cancel</Button>
            <Button color="primary" type="submit">
              Update
            </Button>
          </ModalFooter>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default EditModal;