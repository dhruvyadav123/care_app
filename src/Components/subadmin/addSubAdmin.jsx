import React, { useState, useEffect } from 'react';
import { Modal, ModalBody, ModalHeader, ModalFooter, Form, FormGroup, Label, Input, Button, FormFeedback } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { addSubAdmin, fetchSubAdmins } from '../../Redux/stateSlice/subAdmin';
import fetchRoles from '../../Redux/stateSlice/roleReducer';
import { z } from 'zod';

const AddSubAdmin = ({ addModal, setAddModal }) => {
  const dispatch = useDispatch();
  const { roles } = useSelector((state) => state.roles);
  const { loading } = useSelector((state) => state.users);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    avatar: null,
    roles: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    avatar: '',
    roles: '',
  });

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  const schema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string().min(6, { message: 'Confirm Password must be at least 6 characters' }),
    phoneNumber: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
    roles: z.string().min(1, { message: 'Role is required' }),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, avatar: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationResult = schema.safeParse(formData);
    if (!validationResult.success) {
      const newErrors = validationResult.error.errors.reduce((acc, error) => {
        acc[error.path[0]] = error.message;
        return acc;
      }, {});
      setErrors(newErrors);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('name', formData.name);
    formDataToSubmit.append('email', formData.email);
    formDataToSubmit.append('password', formData.password);
    formDataToSubmit.append('phoneNumber', formData.phoneNumber);
    formDataToSubmit.append('avatar', formData.avatar);
    formDataToSubmit.append('roles', formData.roles);

    await dispatch(addSubAdmin(formDataToSubmit));
    dispatch(fetchSubAdmins());
    setAddModal(false);
  };

  return (
    <Modal isOpen={addModal} toggle={() => setAddModal(false)} size="md" centered>
      <ModalHeader toggle={() => setAddModal(false)}>Create SubAdmin</ModalHeader>
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
            <FormFeedback className="text-danger">{errors.name}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="email">Email</Label>
            <Input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              invalid={!!errors.email}
            />
            <FormFeedback className="text-danger">{errors.email}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="password">Password</Label>
            <Input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              invalid={!!errors.password}
            />
            <FormFeedback className="text-danger">{errors.password}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="confirmPassword">Confirm Password</Label>
            <Input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              invalid={!!errors.confirmPassword}
            />
            <FormFeedback className="text-danger">{errors.confirmPassword}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="phoneNumber">Phone Number</Label>
            <Input
              type="text"
              name="phoneNumber"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              invalid={!!errors.phoneNumber}
            />
            <FormFeedback className="text-danger">{errors.phoneNumber}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="avatar">Avatar</Label>
            <Input
              type="file"
              name="avatar"
              id="avatar"
              onChange={handleFileChange}
              invalid={!!errors.avatar}
            />
            <FormFeedback className="text-danger">{errors.avatar}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="roles">Role</Label>
            <Input
              type="select"
              name="roles"
              id="roles"
              value={formData.roles}
              onChange={handleChange}
              invalid={!!errors.roles}
            >
              <option value="">Select Role</option>
              {roles && roles.length > 0 ? (
                roles.map((res) => (
                  <option key={res._id} value={res._id}>
                    {res.role}
                  </option>
                ))
              ) : (
                <option>No roles available</option>
              )}
            </Input>
            <FormFeedback className="text-danger">{errors.roles}</FormFeedback>
          </FormGroup>

          <ModalFooter>
            <Button color="secondary" onClick={() => setAddModal(false)}>Cancel</Button>
            <Button color="primary" type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </ModalFooter>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default AddSubAdmin;
