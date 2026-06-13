import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../../Config/AppConstant";
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
import { Btn } from "../../../AbstractElements";
import { useDispatch } from "react-redux";
import { editVendor, fetchVendors } from "../../../Redux/stateSlice/vendorReducer";

const EditModal = (props) => {
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
    if (props.data) {
      setFormData({
        name: props.data.name || "",
        phoneNumber: props.data.phoneNumber || "",
        email: props.data.email || "",
        dob: props.data.dob || "",
        file: null,
      });
    }
  }, [props.data]);

  // Handle input changes for text and file fields
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Handle edit user submission
  const handleEditUser = async () => {
    const { name, phoneNumber, email, dob, file } = formData;

    if (!name || !phoneNumber || !email || !dob) {
      alert("Please fill all required fields.");
      return;
    }

    const data = new FormData();
    data.append("name", name);
    data.append("phoneNumber", phoneNumber);
    data.append("email", email);
    data.append("dob", dob);
    if (file) {
      data.append("image", file); 
    }

    await dispatch(editVendor(props.data._id, data));
    props.EditModaltoggle();
    await dispatch(fetchVendors(1, 10));
  };

  return (
    <Modal
      isOpen={props.editModal}
      toggle={props.EditModaltoggle}
      size="md"
      centered
    >
      <ModalHeader toggle={props.EditModaltoggle}>
        Edit User
      </ModalHeader>
      <hr />
      <ModalBody>
        <Form className="theme-form">
          <FormGroup>
            <Label>Name</Label>
            <Input
              type="text"
              name="name"
              placeholder="Enter name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Phone Number</Label>
            <Input
              type="text"
              name="phoneNumber"
              placeholder="Enter phone number"
              value={formData.phoneNumber}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Date of Birth</Label>
            <Input
              type="text"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <img
              src={`${BASE_URL}/uploads/${props?.data?.avatar}`}
              alt="Avatar"
              width="60"
              height="60"
            />
          </FormGroup>
          <FormGroup>
            <Label>Upload New Avatar</Label>
            <Col>
              <Input
                type="file"
                name="file"
                onChange={handleInputChange}
              />
            </Col>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Btn attrBtn={{ color: "secondary", onClick: props.EditModaltoggle }}>
          Close
        </Btn>
        <Btn attrBtn={{ color: "primary", onClick: handleEditUser }}>
          Save
        </Btn>
      </ModalFooter>
    </Modal>
  );
};

export default EditModal;
