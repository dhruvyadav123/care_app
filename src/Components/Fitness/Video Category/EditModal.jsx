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

const EditModal = ({ editModal, setEditModal, data }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    dob: "",
    file: null,
  });

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

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

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

    await dispatch(editVendor(data._id, formDataObj));
    setEditModal(false);
    await dispatch(fetchVendors(1, 10));
  };

  return (
    <Modal isOpen={editModal} toggle={() => setEditModal(false)} size="md" centered>
      <ModalHeader toggle={() => setEditModal(false)}>Edit User</ModalHeader>
      <hr />
      <ModalBody>
        <Form className="theme-form">
          <FormGroup>
            <Label>Name</Label>
            <Input type="text" name="name" value={formData.name} onChange={handleInputChange} />
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
