import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../Config/AppConstant";
import {
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Form,
  FormGroup,
  Label,
  Input,
  ModalFooter,
} from "reactstrap";
import { Btn } from "../../AbstractElements";
import { useDispatch } from "react-redux";
import { editUser, fetchUsers } from "../../Redux/stateSlice/userReducer";

const EditModal = ({ editModal, setEditModal, data }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    dob: "",
    file: null,
  });

  // Populate form data when props.data changes
  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || "",
        phoneNumber: data.phoneNumber || "",
        email: data.email || "",
        dob: data.dob || "",
        file: null,
      });
    }
  }, [data]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Handle form submission
  const handleEditUser = async () => {
    const { name, phoneNumber, email, dob, file } = formData;

    if (!name || !phoneNumber || !email || !dob) {
      alert("Please fill all required fields.");
      return;
    }

    const formDataObj = new FormData();
    formDataObj.append("name", name);
    formDataObj.append("phoneNumber", phoneNumber);
    formDataObj.append("email", email);
    formDataObj.append("dob", dob);
    if (file) {
      formDataObj.append("image", file);
    }

    await dispatch(editUser(data._id, formDataObj));
    setEditModal(false); // Close the modal after saving
    await dispatch(fetchUsers(1, 10));
  };

  return (
    <Modal isOpen={editModal} toggle={() => setEditModal(false)} size="md" centered>
      <ModalHeader toggle={() => setEditModal(false)}>Edit User</ModalHeader>
      <hr />
      <ModalBody>
        <Form className="theme-form">
          <FormGroup>
            <Label>Name</Label>
            <Input type="text" name="name" placeholder="Enter name" value={formData.name} onChange={handleInputChange} />
          </FormGroup>
          <FormGroup>
            <Label>Phone Number</Label>
            <Input type="text" name="phoneNumber" placeholder="Enter phone number" value={formData.phoneNumber} onChange={handleInputChange} />
          </FormGroup>
          <FormGroup>
            <Label>Email</Label>
            <Input type="email" name="email" placeholder="Enter email" value={formData.email} onChange={handleInputChange} />
          </FormGroup>
          <FormGroup>
            <Label>Date of Birth</Label>
            <Input type="text" name="dob" value={formData.dob} onChange={handleInputChange} />
          </FormGroup>
          <FormGroup>
            <img src={`${BASE_URL}/uploads/${data?.avatar}`} alt="Avatar" width="60" height="60" />
          </FormGroup>
          <FormGroup>
            <Label>Upload Avatar</Label>
            <Col>
              <Input type="file" name="file" onChange={handleInputChange} />
            </Col>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Btn attrBtn={{ color: "secondary", onClick: () => setEditModal(false) }}>Close</Btn>
        <Btn attrBtn={{ color: "primary", onClick: handleEditUser }}>Save</Btn>
      </ModalFooter>
    </Modal>
  );
};

export default EditModal;
